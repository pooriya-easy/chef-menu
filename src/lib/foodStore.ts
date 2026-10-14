"use client";

import { useMemo, useSyncExternalStore } from "react";
import { readFoodCatalog, serializeFoodCatalog, defaultFoods } from "./foodCatalog";
import type { Food } from "./foodCatalog";

export const foodStorageKey = "admin_foods";
export const foodUpdateEvent = "admin-foods-updated";

export function getFoodSnapshot(): string {
  try {
    const stored = window.localStorage.getItem(foodStorageKey);
    
    // اگر اصلاً چیزی ذخیره نشده بود یا مقدار خالی ذخیره شده بود
    if (!stored) {
      const initialSerialized = serializeFoodCatalog(defaultFoods);
      window.localStorage.setItem(foodStorageKey, initialSerialized);
      return initialSerialized;
    }

    // بررسی اینکه آیا آرایه ذخیره‌شده خالی است یا نه
    const parsed = readFoodCatalog(stored);
    if (!parsed || parsed.length === 0) {
      const initialSerialized = serializeFoodCatalog(defaultFoods);
      window.localStorage.setItem(foodStorageKey, initialSerialized);
      return initialSerialized;
    }

    return stored;
  } catch {
    return serializeFoodCatalog(defaultFoods);
  }
}

function getServerSnapshot(): string {
  return serializeFoodCatalog(defaultFoods);
}

export function subscribeToFoods(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === foodStorageKey || event.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(foodUpdateEvent, onChange);
  window.addEventListener("focus", onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(foodUpdateEvent, onChange);
    window.removeEventListener("focus", onChange);
  };
}

export function useFoods() {
  const snapshot = useSyncExternalStore(subscribeToFoods, getFoodSnapshot, getServerSnapshot);
  return useMemo(() => readFoodCatalog(snapshot), [snapshot]);
}

export function updateFoodCatalog(update: (foods: Food[]) => Food[]) {
  const current = readFoodCatalog(window.localStorage.getItem(foodStorageKey));
  const safeCurrent = (!current || current.length === 0) ? defaultFoods : current;
  const next = update(safeCurrent);
  window.localStorage.setItem(foodStorageKey, serializeFoodCatalog(next));
  window.dispatchEvent(new Event(foodUpdateEvent));
}
