'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { defaultServings, maxServings, minServings, parseQuantity, parseServings } from '../../lib/recipeIngredients';
import { foodCategories, upsertFood, saveFoodToSupabase, deleteFoodFromSupabase } from '../../lib/foodCatalog';
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
  const [category, setCategory] = useState<FoodCategory>('غذای سنتی');
  const [calories, setCalories] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageFile, setImageFile] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    setCategory('غذای سنتی');
    setCalories('');
    setCookingTime('');
    setInstructions('');
    setImageFile('');
    setImageLoading(false);
    setIsSaving(false);
    setBaseServings(String(defaultServings));
    setIngredients([{ id: nextIngredientId.current++, name: '', quantity: '', unit: '' }]);
    setStorageError('');
  };

  const handleEditFood = (food: Food) => {
    imageReader.current?.abort();
    imageReader.current = null;
    if (fileInput.current) fileInput.current.value = '';
    setImageLoading(false);
    setEditingId(food.id);
    setFoodName(food.name || '');
    setCategory(food.category || 'غذای سنتی');
    setCalories(food.calories ? String(food.calories) : '');
    setCookingTime(food.cookingTime || '');
    setImageFile(food.image || '');
    setInstructions(food.instructions?.join('\n') || '');
    setBaseServings(String(food.baseServings || defaultServings));
    setIngredients(food.ingredients && food.ingredients.length > 0 ? food.ingredients.map((ingredient) => ({ 
      id: nextIngredientId.current++, 
      name: ingredient.name,
      quantity: ingredient.quantity === null || ingredient.quantity === undefined ? '' : String(ingredient.quantity), 
      unit: ingredient.unit || '' 
    })) : [{ id: nextIngredientId.current++, name: '', quantity: '', unit: '' }]);
    setStorageError('');
    setStatus('');
    form.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    nameInput.current?.focus({ preventScroll: true });
  };

  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || imageLoading || isSaving) return;

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

    setIsSaving(true);
    setStorageError('');

    try {
      const id = editingId ?? 'admin-' + crypto.randomUUID();
      const previous = foods.find((f) => f.id === id);
      
      const item: Food = {
        id,
        name: foodName.trim(),
        category,
        calories: calories.trim() || 'ثبت نشده',
        cookingTime: cookingTime.trim() || 'ثبت نشده',
        image: imageFile.trim() || '/food-placeholder.svg',
        baseServings: base,
        ingredients: enteredIngredients.map((ingredient) => ({
          name: ingredient.name.trim(),
          quantity: parseQuantity(ingredient.quantity),
          unit: ingredient.unit.trim()
        })),
        instructions: instructions.split(/\r?\n/).map((step) => step.trim()).filter(Boolean),
        tags: previous?.tags ?? [],
        placements: previous?.placements ?? ['menu', 'personalized', 'random', 'search'],
      };

      // 1. ذخیره در Supabase
      const dbSuccess = await saveFoodToSupabase(item);
      if (!dbSuccess) {
        setStorageError('ذخیره در دیتابیس با مشکل مواجه شد. لطفاً اتصال اینترنت خود را بررسی کنید.');
        setIsSaving(false);
        return;
      }

      // 2. به‌روزرسانی استور داخلی برنامه
      updateFoodCatalog((current) => upsertFood(current, item, editingId !== null));

      resetForm();
      setStatus(editingId ? 'تغییرات با موفقیت در دیتابیس ثبت و اعمال شد.' : 'غذای جدید در دیتابیس ذخیره و منتشر شد.');
    } catch (err) {
      setStorageError('خطایی رخ داد: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFood = async (id: string) => {
    if (!confirm('آیا از حذف این غذا مطمئن هستید؟')) return;

    try {
      await deleteFoodFromSupabase(id);
      updateFoodCatalog((current) => current.filter((food) => food.id !== id));
      if (editingId === id) resetForm();
      setStatus('غذا با موفقیت از دیتابیس و فهرست سایت حذف شد.');
    } catch {
      setStorageError('حذف غذا با خطا مواجه شد.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    router.push('/login');
  };

  if (!authorized) return <div className="min-h-screen bg-[#0a0a0a] p-4 text-zinc-400" dir="rtl" role="status">{storageError || 'در حال بررسی ورود…'}</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-3 sm:p-5" dir="rtl">
      
      {/* ردیف اول: هدر پنل مدیریت */}
      <div className="flex justify-between items-center max-w-3xl mx-auto mb-4 bg-[#111111] px-3.5 py-2.5 rounded-xl border border-zinc-800 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-black font-bold text-xs">
            👨‍🍳
          </div>
          <div>
            <h1 className="text-xs font-bold text-white">پنل مدیریت سرآشپز</h1>
            <p className="text-[10px] text-zinc-400">اتصال آنلاین به Supabase Cloud</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-lg transition">
            مشاهده سایت
          </Link>
          <button 
            onClick={handleLogout}
            className="text-[11px] bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 px-2.5 py-1 rounded-lg transition font-medium"
          >
            خروج
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        
        {/* ردیف دوم: فرم افزودن یا ویرایش غذا */}
        <div className="w-full bg-[#111111] border border-zinc-800 rounded-xl p-3.5 sm:p-4 shadow-md">
          <h2 className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-1.5">
            <span>{editingId ? '✎' : '➕'}</span> {editingId ? 'ویرایش غذا و دستور پخت' : 'افزودن غذای جدید'}
          </h2>

          <form ref={form} onSubmit={handleSaveFood} className="space-y-3 scroll-mt-6">
            {storageError && <p role="alert" className="text-[11px] leading-4 text-red-400">{storageError}</p>}
            {status && <p role="status" className="text-[11px] leading-4 text-emerald-400">{status}</p>}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-0.5">نام غذا / دسر</label>
                <input
                  ref={nameInput}
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="مثلاً: جوجه کباب مخصوص"
                  className="w-full px-2 py-1.5 bg-[#0a0a0a] border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-0.5">انتخاب دسته‌بندی</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FoodCategory)}
                  className="w-full px-2 py-1.5 bg-[#0a0a0a] border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="غذای سنتی">غذای سنتی</option>
                  <option value="فست فود">فست فود</option>
                  <option value="غذای دریایی">غذای دریایی</option>
                  <option value="پیش غذا">پیش غذا</option>
                  <option value="سالاد">سالاد</option>
                  <option value="دسر">دسر</option>
                  <option value="نوشیدنی سرد">نوشیدنی سرد</option>
                  <option value="نوشیدنی گرم">نوشیدنی گرم</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-0.5">کالری و مواد مغذی</label>
                <input
                  type="text"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="مثلاً: ۵۵۰ کیلوکالری"
                  className="w-full px-2 py-1.5 bg-[#0a0a0a] border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="admin-cooking-time" className="mb-0.5 block text-[10px] font-medium text-zinc-400">زمان پخت</label>
                <input id="admin-cooking-time" value={cookingTime} onChange={(event) => setCookingTime(event.target.value)} placeholder="مثلاً ۳۰ دقیقه"
                  className="w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-2 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors" />
              </div>
            </div>

            <fieldset className="space-y-2 rounded-lg border border-zinc-800 bg-[#0a0a0a]/40 p-2.5">
              <legend className="px-1 text-[10px] font-bold text-amber-400">مواد اولیه و تعداد پایه دستور</legend>
              <div className="flex items-center gap-2">
                <label htmlFor="admin-base-servings" className="text-[10px] text-zinc-400 whitespace-nowrap">این مواد برای چند نفر:</label>
                <input id="admin-base-servings" type="number" min={minServings} max={maxServings} step={1} required value={baseServings}
                  onChange={(event) => setBaseServings(event.target.value)}
                  className="w-20 rounded-md border border-zinc-800 bg-[#0a0a0a] px-2 py-1 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors" />
              </div>
              
              <div className="space-y-1.5">
                {ingredients.map((ingredient, index) => (
                  <div key={ingredient.id} className="grid grid-cols-1 sm:grid-cols-4 gap-1.5 rounded-md border border-zinc-800/80 bg-[#111111] p-2 items-center">
                    <div className="sm:col-span-2">
                      <input id={`admin-ingredient-${ingredient.id}-name`} value={ingredient.name} onChange={(event) => updateIngredient(ingredient.id, 'name', event.target.value)} placeholder={`نام ماده ${index + 1} (مثلاً برنج)`}
                        className="w-full rounded border border-zinc-800 bg-[#0a0a0a] px-2 py-1 text-[11px] text-white focus:border-amber-500 focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <input id={`admin-ingredient-${ingredient.id}-quantity`} type="text" inputMode="decimal" value={ingredient.quantity} onChange={(event) => updateIngredient(ingredient.id, 'quantity', event.target.value)} placeholder="مقدار (مثلاً ۲۰۰)"
                        className="w-full rounded border border-zinc-800 bg-[#0a0a0a] px-2 py-1 text-[11px] text-white focus:border-amber-500 focus:outline-none transition-colors" />
                    </div>
                    <div className="flex gap-1 items-center">
                      <input id={`admin-ingredient-${ingredient.id}-unit`} value={ingredient.unit} onChange={(event) => updateIngredient(ingredient.id, 'unit', event.target.value)} placeholder="واحد"
                        className="w-full rounded border border-zinc-800 bg-[#0a0a0a] px-2 py-1 text-[11px] text-white focus:border-amber-500 focus:outline-none transition-colors" />
                      <button type="button" aria-label={`حذف ماده ${index + 1}`} onClick={() => setIngredients((current) => current.filter((item) => item.id !== ingredient.id))}
                        className="p-1 text-xs text-red-400 hover:bg-red-950/40 rounded transition-colors" title="حذف">✕</button>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => { const id = nextIngredientId.current++; setIngredients((current) => [...current, { id, name: '', quantity: '', unit: '' }]); }}
                className="w-full rounded-md border border-amber-500/30 bg-amber-500/10 py-1.5 text-[11px] text-amber-300 hover:bg-amber-500/20 transition-colors">+ افزودن ماده اولیه</button>
            </fieldset>

            <div>
              <label htmlFor="admin-instructions" className="mb-0.5 block text-[10px] font-medium text-zinc-400">مراحل و دستور پخت (هر مرحله در یک خط)</label>
              <textarea id="admin-instructions" rows={2} value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="مراحل پخت..."
                className="w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-2 py-1.5 text-xs leading-5 text-white focus:border-amber-500 focus:outline-none transition-colors" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-start">
              <div>
                <label htmlFor="admin-image-url" className="mb-0.5 block text-[10px] font-medium text-zinc-400">نشانی تصویر</label>
                <input id="admin-image-url" value={imageFile} disabled={imageLoading} onChange={(event) => setImageFile(event.target.value)} placeholder="https://… یا /images/…" dir="ltr"
                  className="w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-2 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none transition-colors" />
                {imageFile && /^(\/(?!\/)|https?:\/\/|data:image\/|blob:)/i.test(imageFile) && (
                  <div className="relative mt-1.5 aspect-video max-w-[200px] overflow-hidden rounded-lg bg-[#0a0a0a] border border-zinc-800">
                    <FoodImage food={{ name: foodName || 'پیش‌نمایش تصویر', image: imageFile }} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-0.5">آپلود عکس غذا</label>
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
                        setStorageError('خواندن تصویر ممکن نشد.');
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  className="w-full text-[11px] text-zinc-400 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={imageLoading || isSaving}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg shadow transition text-xs active:scale-95 disabled:opacity-50"
              >
                {isSaving ? 'در حال ذخیره در دیتابیس…' : imageLoading ? 'در حال آماده‌سازی تصویر…' : editingId ? 'ذخیره تغییرات' : 'ثبت و انتشار غذا'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { resetForm(); setStatus(''); }} className="px-4 rounded-lg bg-zinc-800 py-2 text-xs text-zinc-300 hover:bg-zinc-700 transition">
                  انصراف
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ردیف سوم: لیست غذاهای موجود در منو */}
        <div className="w-full bg-[#111111] border border-zinc-800 rounded-xl p-3.5 sm:p-4 shadow-md">
          <h2 className="text-xs font-bold text-white mb-3 flex items-center justify-between">
            <span>📋 لیست غذاهای منو ({foods.length})</span>
            <span className="text-[10px] text-amber-400 font-normal">ذخیره خودکار در Supabase</span>
          </h2>

          <div className="space-y-2">
            {foods.length === 0 ? (
              <p className="text-zinc-500 text-xs text-center py-4">هیچ غذایی در منو وجود ندارد.</p>
            ) : (
              foods.map((food) => (
                <div key={food.id} className={`flex flex-wrap items-center justify-between gap-2.5 p-2.5 bg-[#0a0a0a] rounded-lg border ${editingId === food.id ? 'border-amber-400' : 'border-zinc-800'}`}>
                  <div className="flex items-center gap-2">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-zinc-800"><FoodImage food={food} /></div>
                    <div>
                      <h3 className="text-xs font-bold text-white">{food.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {food.category}
                        </span>
                        <span className="text-[9px] text-zinc-400">{food.calories}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <button type="button" onClick={() => handleEditFood(food)} aria-label={`ویرایش ${food.name}`} aria-pressed={editingId === food.id}
                      className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-300 hover:bg-amber-500/20 transition">ویرایش</button>
                    <button type="button"
                      onClick={() => handleDeleteFood(food.id)}
                      className="text-[11px] bg-red-950/40 text-red-400 hover:bg-red-900/60 px-2 py-1 rounded border border-red-800/40 transition"
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
