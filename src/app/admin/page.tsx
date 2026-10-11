'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { defaultServings, maxServings, minServings, parseQuantity, parseServings } from '../../lib/recipeIngredients';
import { foodCategories, upsertFood } from '../../lib/foodCatalog';
import type { Food, FoodCategory } from '../../lib/foodCatalog';
import { updateFoodCatalog, useFoods } from '../../lib/foodStore';
import FoodImage from '../../components/FoodImage';

export default function AdminPanel() {
  const router = useRouter();
  const foods = useFoods();
  const [authorized, setAuthorized] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // فرم افزودن غذا
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('غذای اصلی');
  const [calories, setCalories] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageFile, setImageFile] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [status, setStatus] = useState('');
  const [baseServings, setBaseServings] = useState(String(defaultServings));
  const [ingredients, setIngredients] = useState([{ id: 0, name: '', quantity: '', unit: '' }]);
  const nextIngredientId = useRef(1);
  const nameInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const imageReader = useRef<FileReader | null>(null);

  const updateIngredient = (id: number, field: 'name' | 'quantity' | 'unit', value: string) => {
    setIngredients((current) => current.map((ingredient) => ingredient.id === id ? { ...ingredient, [field]: value } : ingredient));
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        if (!localStorage.getItem('isAdmin')) router.push('/login');
        else setAuthorized(true);
      } catch {
        setStorageError('دسترسی به ذخیره‌سازی مرورگر ممکن نیست.');
      }
    });
    return () => { window.cancelAnimationFrame(frame); imageReader.current?.abort(); };
  }, [router]);

  const resetForm = () => {
    imageReader.current?.abort();
    imageReader.current = null;
    if (fileInput.current) fileInput.current.value = '';
    setEditingId(null);
    setFoodName('');
    setCategory('غذای اصلی');
    setCalories('');
    setCookingTime('');
    setInstructions('');
    setImageFile('');
    setImageLoading(false);
    setBaseServings(String(defaultServings));
    setIngredients([{ id: nextIngredientId.current++, name: '', quantity: '', unit: '' }]);
    setStorageError('');
  };

  const saveFoods = (update: (current: Food[]) => Food[]) => {
    try {
      if (!localStorage.getItem('isAdmin')) { router.push('/login'); return false; }
      updateFoodCatalog(update);
      setStorageError('');
      return true;
    } catch (error) {
      setStorageError(error instanceof Error && error.name === 'Error' ? error.message
        : 'ذخیره غذا ممکن نشد؛ فضای مرورگر را بررسی کنید یا تصویر کوچک‌تری انتخاب کنید.');
      return false;
    }
  };

  const handleEditFood = (food: Food) => {
    imageReader.current?.abort();
    imageReader.current = null;
    if (fileInput.current) fileInput.current.value = '';
    setImageLoading(false);
    setEditingId(food.id);
    setFoodName(food.name);
    setCategory(food.category);
    setCalories(food.calories);
    setCookingTime(food.cookingTime);
    setImageFile(food.image);
    setInstructions(food.instructions.join('\n'));
    setBaseServings(String(food.baseServings));
    setIngredients(food.ingredients.map((ingredient) => ({ id: nextIngredientId.current++, name: ingredient.name,
      quantity: ingredient.quantity === null ? '' : String(ingredient.quantity), unit: ingredient.unit })));
    setStorageError('');
    setStatus('');
    form.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    nameInput.current?.focus({ preventScroll: true });
  };

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || imageLoading) return;

    const base = parseServings(baseServings);
    const enteredIngredients = ingredients.filter((ingredient) => ingredient.name.trim() || ingredient.quantity.trim() || ingredient.unit.trim());
    if (base === null || enteredIngredients.some((ingredient) => !ingredient.name.trim()
      || (ingredient.quantity.trim() && (parseQuantity(ingredient.quantity) === null || !ingredient.unit.trim())))) {
      setStorageError('تعداد پایه باید بین ۱ و ۱۰۰ نفر باشد. برای هر ماده نام و برای مقادیر عددی، مقدار غیرمنفی و واحد را وارد کنید.');
      return;
    }

    if (imageFile.trim() && !/^(\/(?!\/)|https?:\/\/|data:image\/|blob:)/i.test(imageFile.trim())) {
      setStorageError('برای تصویر یک نشانی معتبر یا فایل تصویر انتخاب کنید.');
      return;
    }
    const id = editingId ?? 'admin-' + crypto.randomUUID();
    const saved = saveFoods((current) => {
      const previous = current.find((food) => food.id === id);
      const item: Food = {
        id, name: foodName.trim(), category, calories: calories.trim() || 'ثبت نشده',
        cookingTime: cookingTime.trim() || 'ثبت نشده', image: imageFile.trim() || '/food-placeholder.svg',
        baseServings: base, ingredients: enteredIngredients.map((ingredient) => ({ name: ingredient.name.trim(), quantity: parseQuantity(ingredient.quantity), unit: ingredient.unit.trim() })),
        instructions: instructions.split(/\r?\n/).map((step) => step.trim()).filter(Boolean),
        tags: previous?.tags ?? [], placements: previous?.placements ?? ['menu', 'personalized', 'random', 'search'],
      };
      return upsertFood(current, item, editingId !== null);
    });
    if (!saved) return;
    resetForm();
    setStatus(editingId ? 'تغییرات غذا ذخیره و در سایت اعمال شد.' : 'غذای جدید با موفقیت اضافه شد.');
  };

  const handleDeleteFood = (id: string) => {
    if (!saveFoods((current) => current.filter((food) => food.id !== id))) return;
    if (editingId === id) resetForm();
    setStatus('غذا از فهرست سایت حذف شد.');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    router.push('/login');
  };

  if (!authorized) return <div className="min-h-screen bg-slate-900 p-10 text-slate-300" dir="rtl" role="status">{storageError || 'در حال بررسی ورود…'}</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 sm:p-10" dir="rtl">
      
      {/* هدر پنل */}
      <div className="flex justify-between items-center max-w-5xl mx-auto mb-8 bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-bold text-lg">
            👨‍🍳
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">پنل مدیریت سرآشپز</h1>
            <p className="text-xs text-slate-400">مدیریت منوها، دسته‌بندی‌ها و مشخصات غذاها</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-xl transition">
            مشاهده سایت
          </Link>
          <button 
            onClick={handleLogout}
            className="text-xs bg-red-600/80 hover:bg-red-600 text-white px-3 py-2 rounded-xl transition font-medium"
          >
            خروج از حساب
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ستون راست: فرم افزودن غذا و آپلود عکس */}
        <div className="md:col-span-1 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl h-fit">
          <h2 className="text-base font-bold text-amber-400 mb-4 flex items-center gap-2">
            <span>{editingId ? '✎' : '➕'}</span> {editingId ? 'ویرایش غذا و دستور پخت' : 'افزودن غذای جدید'}
          </h2>

          <form ref={form} onSubmit={handleSaveFood} className="space-y-4 scroll-mt-6">
            {storageError && <p role="alert" className="text-xs leading-6 text-red-300">{storageError}</p>}
            <p role="status" className="text-xs leading-6 text-emerald-300">{status}</p>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">نام غذا / دسر</label>
              <input
                ref={nameInput}
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="مثلاً: جوجه کباب مخصوص"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">انتخاب دسته‌بندی</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
              >
                {foodCategories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">کالری و مواد مغذی</label>
              <input
                type="text"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="مثلاً: ۵۵۰ کیلوکالری (پروتئین بالا)"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label htmlFor="admin-cooking-time" className="mb-1 block text-xs text-slate-300">زمان پخت</label>
              <input id="admin-cooking-time" value={cookingTime} onChange={(event) => setCookingTime(event.target.value)} placeholder="مثلاً ۳۰ دقیقه"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none" />
            </div>

            <fieldset className="space-y-3 rounded-xl border border-emerald-800 bg-slate-900/50 p-3">
              <legend className="px-2 text-xs font-bold text-emerald-300">مواد اولیه و تعداد پایه دستور</legend>
              <label htmlFor="admin-base-servings" className="block text-xs text-slate-300">این مقدار مواد برای چند نفر است؟</label>
              <input id="admin-base-servings" type="number" min={minServings} max={maxServings} step={1} required value={baseServings}
                onChange={(event) => setBaseServings(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none" />
              <p className="text-[11px] leading-6 text-slate-400">مقدار مواد را برای همین تعداد وارد کنید؛ در جزئیات غذا برای تعداد دلخواه محاسبه می‌شود.</p>
              {ingredients.map((ingredient, index) => <div key={ingredient.id} className="grid grid-cols-2 gap-2 rounded-lg border border-slate-700 p-2">
                <div className="col-span-2">
                  <label htmlFor={`admin-ingredient-${ingredient.id}-name`} className="mb-1 block text-[11px] text-slate-300">نام ماده {index + 1}</label>
                  <input id={`admin-ingredient-${ingredient.id}-name`} value={ingredient.name} onChange={(event) => updateIngredient(ingredient.id, 'name', event.target.value)} placeholder="مثلاً برنج"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor={`admin-ingredient-${ingredient.id}-quantity`} className="mb-1 block text-[11px] text-slate-300">مقدار پایه</label>
                  <input id={`admin-ingredient-${ingredient.id}-quantity`} type="text" inputMode="decimal" value={ingredient.quantity} onChange={(event) => updateIngredient(ingredient.id, 'quantity', event.target.value)} placeholder="مثلاً ۲۰۰"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor={`admin-ingredient-${ingredient.id}-unit`} className="mb-1 block text-[11px] text-slate-300">واحد</label>
                  <input id={`admin-ingredient-${ingredient.id}-unit`} value={ingredient.unit} onChange={(event) => updateIngredient(ingredient.id, 'unit', event.target.value)} placeholder="مثلاً گرم"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none" />
                </div>
                <button type="button" aria-label={`حذف ماده ${index + 1}`} onClick={() => setIngredients((current) => current.filter((item) => item.id !== ingredient.id))}
                  className="col-span-2 rounded-lg py-1.5 text-xs text-red-300 hover:bg-red-950/50">حذف ماده</button>
              </div>)}
              <button type="button" onClick={() => { const id = nextIngredientId.current++; setIngredients((current) => [...current, { id, name: '', quantity: '', unit: '' }]); }}
                className="w-full rounded-lg border! border-emerald-700 bg-emerald-950 py-2 text-xs text-emerald-200 hover:bg-emerald-900">+ افزودن ماده اولیه</button>
              <p className="text-[11px] leading-6 text-slate-400">برای نمک و ادویه به میزان دلخواه، مقدار را خالی بگذارید و در واحد «به میزان لازم» بنویسید.</p>
            </fieldset>

            <div>
              <label htmlFor="admin-instructions" className="mb-1 block text-xs text-slate-300">مراحل و دستور پخت</label>
              <textarea id="admin-instructions" rows={6} value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="هر مرحله را در یک خط بنویسید…"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs leading-7 text-white focus:border-amber-400 focus:outline-none" />
            </div>

            <div>
              <label htmlFor="admin-image-url" className="mb-1 block text-xs text-slate-300">نشانی تصویر</label>
              <input id="admin-image-url" value={imageFile} disabled={imageLoading} onChange={(event) => setImageFile(event.target.value)} placeholder="https://… یا /images/…" dir="ltr"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none" />
              {imageFile && /^(\/(?!\/)|https?:\/\/|data:image\/|blob:)/i.test(imageFile) && <div className="relative mt-3 aspect-video overflow-hidden rounded-xl bg-slate-900"><FoodImage food={{ name: foodName || 'پیش‌نمایش تصویر', image: imageFile }} /></div>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">آپلود عکس غذا</label>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    imageReader.current?.abort();
                    const reader = new FileReader();
                    imageReader.current = reader;
                    setImageLoading(true);
                    reader.onload = () => {
                      if (imageReader.current !== reader) return;
                      if (typeof reader.result === 'string') setImageFile(reader.result);
                      setImageLoading(false);
                    };
                    reader.onerror = () => {
                      if (imageReader.current !== reader) return;
                      setImageLoading(false);
                      setStorageError('خواندن تصویر ممکن نشد. تصویر دیگری انتخاب کنید.');
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
                className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={imageLoading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow transition text-xs"
            >
              {imageLoading ? 'در حال آماده‌سازی تصویر…' : editingId ? 'ذخیره تغییرات' : 'ثبت و انتشار غذا'}
            </button>
            {editingId && <button type="button" onClick={() => { resetForm(); setStatus(''); }} className="w-full rounded-xl bg-slate-700 py-2.5 text-xs text-slate-200 hover:bg-slate-600">انصراف از ویرایش</button>}
          </form>
        </div>

        {/* ستون چپ: لیست غذاهای موجود در منو */}
        <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <h2 className="text-base font-bold text-white mb-4 flex items-center justify-between">
            <span>📋 لیست غذاهای منو ({foods.length})</span>
            <span className="text-xs text-amber-400 font-normal">قابلیت حذف یا ویرایش</span>
          </h2>

          <div className="space-y-3">
            {foods.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-8">هیچ غذایی در منو وجود ندارد.</p>
            ) : (
              foods.map((food) => (
                <div key={food.id} className={`flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 rounded-xl border ${editingId === food.id ? 'border-amber-400' : 'border-slate-700/60'}`}>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-700"><FoodImage food={food} /></div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{food.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                          {food.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{food.calories}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                  <button type="button" onClick={() => handleEditFood(food)} aria-label={`ویرایش ${food.name}`} aria-pressed={editingId === food.id}
                    className="rounded-lg border! border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20">ویرایش</button>
                  <button type="button"
                    onClick={() => handleDeleteFood(food.id)}
                    className="text-xs bg-red-900/40 text-red-400 hover:bg-red-900/70 px-3 py-1.5 rounded-lg border border-red-700/40 transition"
                  >
                    حذف
                  </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
