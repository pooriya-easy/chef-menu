"use client";

import { useMemo, useSyncExternalStore } from "react";
import { readFoodCatalog, serializeFoodCatalog, defaultFoods } from "./foodCatalog";
import type { Food } from "./foodCatalog";

export const foodStorageKey = "admin_foods";
export const foodUpdateEvent = "admin-foods-updated";

export function getFoodSnapshot() {
  try { 
    const stored = window.localStorage.getItem(foodStorageKey);
    // اگر لوکال‌استوریج خالی بود، به طور خودکار پیش‌فرض‌ها را ذخیره و برمی‌گردانیم
    if (!stored) {
      const initialSerialized = serializeFoodCatalog(defaultFoods);
      window.localStorage.setItem(foodStorageKey, initialSerialized);
      return initialSerialized;
    }
    return stored;
  } catch { 
    return serializeFoodCatalog(defaultFoods); 
  }
}
function getServerSnapshot() { return serializeFoodCatalog(defaultFoods); }

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
  // Always read the latest snapshot, including edits made in another tab.
  const current = readFoodCatalog(window.localStorage.getItem(foodStorageKey));
  const next = update(current);
  window.localStorage.setItem(foodStorageKey, serializeFoodCatalog(next));
  window.dispatchEvent(new Event(foodUpdateEvent));
}
