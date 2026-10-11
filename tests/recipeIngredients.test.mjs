import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToString } from 'react-dom/server';
import * as jsxRuntime from 'react/jsx-runtime';

const source = fs.readFileSync(new URL('../src/lib/recipeIngredients.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
}).outputText;
const library = {};
vm.runInNewContext(compiled, { exports: library });
const { parseServings, parseQuantity, normalizeIngredients, scaleQuantity, formatQuantity } = library;

test('quantities scale from the original recipe, including fractions and a one-person base', () => {
  assert.equal(scaleQuantity(200, 2, 2), 200);
  assert.equal(scaleQuantity(200, 4, 2), 400);
  assert.equal(scaleQuantity(200, 1, 2), 100);
  assert.equal(scaleQuantity(3, 2, 4), 1.5);
  assert.equal(scaleQuantity(0.25, 3, 2), 0.375);
  assert.equal(scaleQuantity(0.1, 1, 2), 0.05);
  assert.equal(scaleQuantity(100, 4, 1), 400);
  assert.equal(scaleQuantity(0, 4, 2), 0);
  for (const servings of [2, 20, 1, 4, 100, 2]) assert.equal(scaleQuantity(200, servings, 2), servings * 100);
});

test('Persian and Arabic numbers work and invalid serving counts are rejected', () => {
  assert.equal(parseServings('۴'), 4);
  assert.equal(parseServings('٢'), 2);
  assert.equal(parseServings(' 100 '), 100);
  for (const value of ['', ' ', '0', '-1', '2.5', '101', 'NaN', '1e2', null, true, Infinity]) {
    assert.equal(parseServings(value), null);
  }
  assert.equal(parseQuantity('۰٫۱۲۵'), 0.125);
  assert.equal(parseQuantity('٢.٥'), 2.5);
  assert.equal(parseQuantity(0), 0);
  for (const value of ['', ' ', '-1', 'abc', Infinity, NaN, null, true]) assert.equal(parseQuantity(value), null);
});

test('existing name-only ingredients remain visible alongside structured admin data', () => {
  const ingredients = normalizeIngredients([
    'برنج', { name: 'شیر', quantity: '۲۵۰', unit: 'میلی‌لیتر' },
    { name: 'روغن', amount: '۱٫۵', unit: 'قاشق غذاخوری' },
    { name: 'نمک', quantity: null, unit: 'به میزان لازم' },
    { name: 'ادویه', quantity: -3, unit: '' }, null, {}, '',
  ]);
  assert.equal(ingredients.length, 5);
  assert.equal(ingredients[0].name, 'برنج');
  assert.equal(ingredients[0].quantity, null);
  assert.equal(ingredients[1].quantity, 250);
  assert.equal(ingredients[2].quantity, 1.5);
  assert.equal(ingredients[3].quantity, null);
  assert.equal(ingredients[3].unit, 'به میزان لازم');
  assert.equal(ingredients[4].quantity, null);
  assert.equal(normalizeIngredients('برنج، مرغ\nزعفران').length, 3);
  assert.equal(normalizeIngredients(undefined).length, 0);
});

test('unknown amounts and invalid bases never produce NaN or infinity', () => {
  assert.equal(scaleQuantity(null, 4, 2), null);
  for (const base of [0, -1, 1.5, Infinity, NaN]) assert.equal(scaleQuantity(100, 4, base), null);
  for (const quantity of [-1, Infinity, NaN]) assert.equal(scaleQuantity(quantity, 4, 2), null);
});

test('formatting keeps fractional amounts and uses Persian numbers', () => {
  assert.equal(formatQuantity(0.375), '۰٫۳۷۵');
  assert.equal(formatQuantity(0.05), '۰٫۰۵');
  assert.equal(formatQuantity(1.5), '۱٫۵');
  assert.equal(formatQuantity(200), '۲۰۰');
});

const componentSource = fs.readFileSync(new URL('../src/components/RecipeIngredientCalculator.tsx', import.meta.url), 'utf8');
const componentCompiled = ts.transpileModule(componentSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2017 },
}).outputText;
const component = {};
const dependencies = { react: React, 'react/jsx-runtime': jsxRuntime, '../lib/recipeIngredients': library };
vm.runInNewContext(componentCompiled, {
  exports: component,
  require: (name) => dependencies[name],
});

test('recipe calculator renders at two servings and scales from a four-serving base without browser globals', () => {
  const html = renderToString(React.createElement(component.default, {
    baseServings: 4,
    ingredients: [
      { name: 'برنج', quantity: 400, unit: 'گرم' },
      { name: 'شیر', quantity: 0.75, unit: 'لیوان' },
    ],
  }));
  assert.ok(html.includes('۲۰۰ گرم'));
  assert.ok(html.includes('۰٫۳۷۵ لیوان'));
  assert.ok(html.includes('value="2"'));
  assert.ok(html.includes('role="spinbutton"'));
  assert.ok(html.includes('aria-label="افزایش تعداد نفرات"'));
  assert.ok(html.includes('aria-label="کاهش تعداد نفرات"'));
  assert.ok(html.includes('aria-live="polite"'));
});

test('legacy ingredients display their names and explain why no amount can be calculated', () => {
  const html = renderToString(React.createElement(component.default, {
    baseServings: 2, ingredients: normalizeIngredients(['برنج', 'مرغ']),
  }));
  assert.ok(html.includes('برنج'));
  assert.ok(html.includes('مرغ'));
  assert.ok(html.includes('مقدار ثبت نشده'));
  assert.equal((html.match(/disabled=""/g) || []).length, 3);
  const empty = renderToString(React.createElement(component.default, { baseServings: 2, ingredients: [] }));
  assert.ok(empty.includes('مواد اولیه این غذا هنوز ثبت نشده است.'));
  assert.equal(empty.includes('spinbutton'), false);
});
