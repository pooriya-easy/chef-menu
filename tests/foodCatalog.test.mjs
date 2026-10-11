import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToString } from 'react-dom/server';
import * as jsxRuntime from 'react/jsx-runtime';

function loadModule(file, dependencies = {}, globals = {}) {
  const source = fs.readFileSync(new URL(file, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2017, esModuleInterop: true } }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports, require: (name) => dependencies[name], ...globals });
  return exports;
}

const ingredients = loadModule('../src/lib/recipeIngredients.ts');
const defaults = loadModule('../src/lib/defaultFoods.ts');
const catalog = loadModule('../src/lib/foodCatalog.ts', { './defaultFoods': defaults, './recipeIngredients': ingredients });
const { defaultFoods } = defaults;
const { readFoodCatalog, serializeFoodCatalog, normalizeFood, upsertFood } = catalog;

test('all existing site food sources have editable records with unique stable IDs', () => {
  assert.equal(defaultFoods.length, 23);
  assert.equal(new Set(defaultFoods.map((food) => food.id)).size, defaultFoods.length);
  for (const placement of ['menu', 'personalized', 'random', 'search', 'calculator']) {
    assert.ok(defaultFoods.some((food) => food.placements.includes(placement)));
  }
  assert.equal(defaultFoods.filter((food) => food.placements.includes('personalized')).length, 6);
  assert.ok(defaultFoods.find((food) => food.id === 'mock-1').ingredients.length > 0);
  assert.ok(defaultFoods.find((food) => food.id === 'calculator-pasta').ingredients.length > 0);
});

test('old admin arrays retain their foods while adding the original defaults without duplicates', () => {
  const foods = readFoodCatalog(JSON.stringify([
    { id: 123, name: 'غذای ادمین', category: 'غذاهای اصلی', calories: 250, ingredients: ['برنج'] },
    { id: 2, name: 'سالاد سزار', category: 'پیش‌غذا و سالاد', calories: '۳۵۰ کیلوکالری' },
  ]));
  assert.equal(foods.length, defaultFoods.length + 1);
  assert.equal(foods.find((food) => food.id === '123').name, 'غذای ادمین');
  assert.equal(foods.filter((food) => food.name === 'سالاد سزار').length, 1);
  assert.equal(foods.find((food) => food.name === 'سالاد سزار').id, 'suggestion-salad');
  assert.equal(foods.find((food) => food.id === '123').ingredients[0].quantity, null);
});

test('editing preserves ID and all fields across storage round trips without adding a duplicate', () => {
  const existing = defaultFoods[0];
  const edited = { ...existing, name: 'نام تازه', category: 'سالاد', calories: '۴۲۰ کیلوکالری', cookingTime: '۲۰ دقیقه',
    image: 'data:image/png;base64,abc', baseServings: 4,
    ingredients: [{ name: 'برنج', quantity: 450.5, unit: 'گرم' }], instructions: ['مرحله اول', 'مرحله دوم'] };
  const foods = readFoodCatalog(serializeFoodCatalog(upsertFood(defaultFoods, edited, true)));
  assert.equal(foods.length, defaultFoods.length);
  const stored = foods.find((food) => food.id === existing.id);
  for (const property of ['name', 'category', 'calories', 'cookingTime', 'image', 'baseServings']) assert.equal(stored[property], edited[property]);
  assert.equal(stored.ingredients[0].quantity, 450.5);
  assert.equal(stored.instructions.join('\n'), edited.instructions.join('\n'));
  assert.equal(stored.placements.join(','), existing.placements.join(','));
  assert.equal(defaultFoods[0].name, existing.name);
});

test('deleted defaults never reappear and a deliberately empty catalogue remains empty', () => {
  const filtered = defaultFoods.filter((food) => food.id !== 'mock-1');
  assert.equal(readFoodCatalog(serializeFoodCatalog(filtered)).some((food) => food.id === 'mock-1'), false);
  assert.equal(readFoodCatalog(serializeFoodCatalog([])).length, 0);
  assert.throws(() => upsertFood(filtered, defaultFoods[0], true), /حذف شده/);
});

test('new food is added once and invalid storage falls back without changing data', () => {
  const food = { ...defaultFoods[0], id: 'new-food', name: 'غذای جدید' };
  const created = upsertFood(defaultFoods, food);
  assert.equal(created.length, defaultFoods.length + 1);
  assert.equal(upsertFood(created, { ...food, name: 'ویرایش جدید' }, true).length, created.length);
  for (const raw of [null, '{broken', 'false', '{}']) assert.equal(readFoodCatalog(raw).length, defaultFoods.length);
  assert.equal(normalizeFood({ name: 'غذا', image: 'invalid relative image' }).image, '/food-placeholder.svg');
  assert.equal(normalizeFood({ name: 'غذا', baseServings: 0, steps: 'اول\nدوم' }).baseServings, 2);
});

test('food writes notify subscribers immediately, read the latest state, and preserve data on quota failure', () => {
  let saved = null;
  let failWrite = false;
  const eventTarget = new EventTarget();
  const browser = {
    localStorage: { getItem: () => saved, setItem: (_key, value) => { if (failWrite) throw new Error('QuotaExceededError'); saved = value; } },
    addEventListener: (...args) => eventTarget.addEventListener(...args),
    removeEventListener: (...args) => eventTarget.removeEventListener(...args),
    dispatchEvent: (event) => eventTarget.dispatchEvent(event),
  };
  const store = loadModule('../src/lib/foodStore.ts', { react: React, './foodCatalog': catalog }, { window: browser, Event });
  let notifications = 0;
  const unsubscribe = store.subscribeToFoods(() => notifications++);
  store.updateFoodCatalog((foods) => upsertFood(foods, { ...foods[0], name: 'تغییر نخست' }, true));
  assert.equal(notifications, 1);
  store.updateFoodCatalog((foods) => upsertFood(foods, { ...foods[1], name: 'تغییر دوم' }, true));
  assert.equal(readFoodCatalog(saved)[0].name, 'تغییر نخست');
  assert.equal(readFoodCatalog(saved)[1].name, 'تغییر دوم');
  const beforeFailure = saved;
  failWrite = true;
  assert.throws(() => store.updateFoodCatalog(() => []), /QuotaExceededError/);
  assert.equal(saved, beforeFailure);
  assert.equal(notifications, 2);
  const storageEvent = new Event('storage');
  Object.defineProperty(storageEvent, 'key', { value: 'admin_foods' });
  browser.dispatchEvent(storageEvent);
  assert.equal(notifications, 3);
  unsubscribe();
  browser.dispatchEvent(new Event('admin-foods-updated'));
  assert.equal(notifications, 3);
});

test('homepage cards and the recipe dialog render the same edited fields and scaled ingredients', () => {
  const food = { ...defaultFoods.find((item) => item.id === 'personal-i1'), name: 'سالاد ویرایش‌شده', calories: '۴۲۰ کیلوکالری',
    cookingTime: '۱۵ دقیقه', baseServings: 4, ingredients: [{ name: 'کاهو', quantity: 500, unit: 'گرم' }],
    instructions: ['سبزیجات را آماده کنید.', 'مواد را مخلوط کنید.'] };
  const foods = upsertFood(defaultFoods, food, true);
  const reactDependencies = { react: React, 'react/jsx-runtime': jsxRuntime };
  const calculator = loadModule('../src/components/RecipeIngredientCalculator.tsx', { ...reactDependencies, '../lib/recipeIngredients': ingredients }).default;
  const image = loadModule('../src/components/FoodImage.tsx', { ...reactDependencies, 'next/image': (props) => React.createElement('span', { 'data-image': props.src }) }).default;
  const dialog = loadModule('../src/components/FoodRecipeDialog.tsx', { ...reactDependencies,
    '../lib/foodStore': { useFoods: () => foods }, './FoodImage': image, './RecipeIngredientCalculator': calculator }).default;
  const personalized = loadModule('../src/components/PersonalizedSuggestions.tsx', { ...reactDependencies,
    '../lib/foodStore': { useFoods: () => foods }, './FoodImage': image, './FoodRecipeDialog': dialog }).default;
  const homepage = renderToString(React.createElement(personalized));
  const details = renderToString(React.createElement(dialog, { foodId: food.id, onClose: () => {} }));
  for (const html of [homepage, details]) {
    assert.ok(html.includes(food.name));
    assert.ok(html.includes(food.calories));
    assert.ok(html.includes(food.cookingTime));
  }
  assert.ok(details.includes('۲۵۰ گرم'));
  assert.ok(details.includes(food.instructions[0]));
  assert.ok(details.includes(food.instructions[1]));
});
