import type { Food } from "./foodCatalog";

// Original menu, homepage suggestions, search examples, and calculator recipe.
export const defaultFoods: Food[] = [
  {
    "id": "mock-1",
    "name": "زرشک‌پلو با مرغ",
    "category": "غذای اصلی",
    "calories": "۵۲۰ کیلوکالری",
    "cookingTime": "۶۰ دقیقه",
    "image": "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop",
    "baseServings": 2,
    "ingredients": [
      {
        "name": "برنج",
        "quantity": 200,
        "unit": "گرم"
      },
      {
        "name": "مرغ",
        "quantity": 300,
        "unit": "گرم"
      },
      {
        "name": "زرشک",
        "quantity": 30,
        "unit": "گرم"
      },
      {
        "name": "زعفران",
        "quantity": 0.1,
        "unit": "گرم"
      },
      {
        "name": "پیاز",
        "quantity": 1,
        "unit": "عدد"
      }
    ],
    "instructions": [],
    "tags": [
      "غذای ایرانی",
      "سنتی"
    ],
    "placements": [
      "menu",
      "random",
      "search"
    ]
  },
  {
    "id": "mock-2",
    "name": "پاستا با سس گوجه",
    "category": "غذای اصلی",
    "calories": "۴۸۰ کیلوکالری",
    "cookingTime": "۳۰ دقیقه",
    "image": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "پاستا",
        "quantity": 400,
        "unit": "گرم"
      },
      {
        "name": "گوجه‌فرنگی",
        "quantity": 600,
        "unit": "گرم"
      },
      {
        "name": "سیر",
        "quantity": 4,
        "unit": "حبه"
      },
      {
        "name": "ریحان",
        "quantity": 20,
        "unit": "گرم"
      },
      {
        "name": "روغن زیتون",
        "quantity": 4,
        "unit": "قاشق غذاخوری"
      }
    ],
    "instructions": [],
    "tags": [
      "غذای ایرانی"
    ],
    "placements": [
      "menu"
    ]
  },
  {
    "id": "mock-3",
    "name": "سالاد رنگین سبزیجات",
    "category": "سالاد",
    "calories": "۱۸۰ کیلوکالری",
    "cookingTime": "۱۵ دقیقه",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
    "baseServings": 2,
    "ingredients": [
      {
        "name": "کاهو",
        "quantity": 200,
        "unit": "گرم"
      },
      {
        "name": "گوجه گیلاسی",
        "quantity": 150,
        "unit": "گرم"
      },
      {
        "name": "خیار",
        "quantity": 1,
        "unit": "عدد"
      },
      {
        "name": "ذرت",
        "quantity": 100,
        "unit": "گرم"
      },
      {
        "name": "آبلیمو",
        "quantity": 2,
        "unit": "قاشق غذاخوری"
      }
    ],
    "instructions": [],
    "tags": [
      "رژیمی",
      "گیاهی"
    ],
    "placements": [
      "menu"
    ]
  },
  {
    "id": "mock-4",
    "name": "سوپ گرم سبزیجات",
    "category": "پیش‌غذا",
    "calories": "۲۲۰ کیلوکالری",
    "cookingTime": "۴۰ دقیقه",
    "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "هویج",
        "quantity": 2,
        "unit": "عدد"
      },
      {
        "name": "سیب‌زمینی",
        "quantity": 2,
        "unit": "عدد"
      },
      {
        "name": "کرفس",
        "quantity": 100,
        "unit": "گرم"
      },
      {
        "name": "پیاز",
        "quantity": 1,
        "unit": "عدد"
      },
      {
        "name": "عصاره سبزیجات",
        "quantity": 1000,
        "unit": "میلی‌لیتر"
      }
    ],
    "instructions": [],
    "tags": [
      "غذای ایرانی"
    ],
    "placements": [
      "menu"
    ]
  },
  {
    "id": "mock-5",
    "name": "کیک شکلاتی",
    "category": "دسر",
    "calories": "۳۶۰ کیلوکالری",
    "cookingTime": "۴۵ دقیقه",
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop",
    "baseServings": 4,
    "ingredients": [
      {
        "name": "آرد",
        "quantity": 150,
        "unit": "گرم"
      },
      {
        "name": "پودر کاکائو",
        "quantity": 30,
        "unit": "گرم"
      },
      {
        "name": "تخم‌مرغ",
        "quantity": 2,
        "unit": "عدد"
      },
      {
        "name": "شیر",
        "quantity": 125,
        "unit": "میلی‌لیتر"
      },
      {
        "name": "شکر",
        "quantity": 100,
        "unit": "گرم"
      }
    ],
    "instructions": [],
    "tags": [
      "دسر",
      "دسر و شیرینی"
    ],
    "placements": [
      "menu",
      "random",
      "search"
    ]
  },
  {
    "id": "mock-6",
    "name": "لیموناد نعنا",
    "category": "نوشیدنی",
    "calories": "۹۰ کیلوکالری",
    "cookingTime": "۵ دقیقه",
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?w=800&auto=format&fit=crop",
    "baseServings": 2,
    "ingredients": [
      {
        "name": "لیموترش",
        "quantity": 2,
        "unit": "عدد"
      },
      {
        "name": "نعنا",
        "quantity": 10,
        "unit": "گرم"
      },
      {
        "name": "آب",
        "quantity": 400,
        "unit": "میلی‌لیتر"
      },
      {
        "name": "یخ",
        "quantity": 8,
        "unit": "قطعه"
      },
      {
        "name": "عسل",
        "quantity": 2,
        "unit": "قاشق غذاخوری"
      }
    ],
    "instructions": [],
    "tags": [],
    "placements": [
      "menu"
    ]
  },
  {
    "id": "personal-i1",
    "name": "سالاد مدیترانه‌ای",
    "category": "سالاد",
    "calories": "220 کیلوکالری",
    "cookingTime": "۱۵ دقیقه",
    "image": "/food-placeholder.svg",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "رژیمی"
    ],
    "placements": [
      "personalized"
    ]
  },
  {
    "id": "personal-i2",
    "name": "پاستا سبزیجات",
    "category": "غذای اصلی",
    "calories": "410 کیلوکالری",
    "cookingTime": "۲۰ دقیقه",
    "image": "/food-placeholder.svg",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "گیاهی"
    ],
    "placements": [
      "personalized"
    ]
  },
  {
    "id": "personal-i3",
    "name": "املت پنیر",
    "category": "غذای اصلی",
    "calories": "300 کیلوکالری",
    "cookingTime": "۱۰ دقیقه",
    "image": "/food-placeholder.svg",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "سریع و آسان"
    ],
    "placements": [
      "personalized"
    ]
  },
  {
    "id": "personal-i4",
    "name": "قورمه‌سبزی سبک",
    "category": "غذای اصلی",
    "calories": "520 کیلوکالری",
    "cookingTime": "۹۰ دقیقه",
    "image": "/food-placeholder.svg",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "سنتی"
    ],
    "placements": [
      "personalized"
    ]
  },
  {
    "id": "personal-i5",
    "name": "کیک لیوانی شکلاتی",
    "category": "دسر",
    "calories": "480 کیلوکالری",
    "cookingTime": "۲۵ دقیقه",
    "image": "/food-placeholder.svg",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "دسر"
    ],
    "placements": [
      "personalized"
    ]
  },
  {
    "id": "personal-i6",
    "name": "مرغ گریل",
    "category": "غذای اصلی",
    "calories": "430 کیلوکالری",
    "cookingTime": "۳۰ دقیقه",
    "image": "/food-placeholder.svg",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "پروتئینی"
    ],
    "placements": [
      "personalized"
    ]
  },
  {
    "id": "suggestion-salad",
    "name": "سالاد سزار",
    "category": "سالاد",
    "calories": "320 کیلوکالری",
    "cookingTime": "20 دقیقه",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "رژیمی",
      "سریع و آسان"
    ],
    "placements": [
      "random"
    ]
  },
  {
    "id": "suggestion-vegetables",
    "name": "بشقاب سبزیجات کبابی",
    "category": "غذای اصلی",
    "calories": "240 کیلوکالری",
    "cookingTime": "30 دقیقه",
    "image": "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&auto=format&fit=crop",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "گیاهی",
      "رژیمی"
    ],
    "placements": [
      "random"
    ]
  },
  {
    "id": "suggestion-pasta",
    "name": "پاستا آلفردو",
    "category": "غذای اصلی",
    "calories": "520 کیلوکالری",
    "cookingTime": "25 دقیقه",
    "image": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "سریع و آسان"
    ],
    "placements": [
      "random"
    ]
  },
  {
    "id": "suggestion-ghormeh",
    "name": "قورمه‌سبزی",
    "category": "غذای اصلی",
    "calories": "480 کیلوکالری",
    "cookingTime": "150 دقیقه",
    "image": "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "سنتی",
      "غذای ایرانی"
    ],
    "placements": [
      "random",
      "search"
    ]
  },
  {
    "id": "search-3",
    "name": "پاناکوتا",
    "category": "دسر",
    "calories": "ثبت نشده",
    "cookingTime": "ثبت نشده",
    "image": "/food-placeholder.svg",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "دسر و شیرینی"
    ],
    "placements": [
      "search"
    ]
  },
  {
    "id": "search-4",
    "name": "سالاد سبزیجات",
    "category": "سالاد",
    "calories": "ثبت نشده",
    "cookingTime": "ثبت نشده",
    "image": "/food-placeholder.svg",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "رژیمی"
    ],
    "placements": [
      "search"
    ]
  },
  {
    "id": "search-5",
    "name": "مرغ بخارپز",
    "category": "غذای اصلی",
    "calories": "ثبت نشده",
    "cookingTime": "ثبت نشده",
    "image": "/food-placeholder.svg",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "رژیمی"
    ],
    "placements": [
      "search"
    ]
  },
  {
    "id": "search-6",
    "name": "پاستا",
    "category": "غذای اصلی",
    "calories": "ثبت نشده",
    "cookingTime": "ثبت نشده",
    "image": "/food-placeholder.svg",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "فستفود"
    ],
    "placements": [
      "search"
    ]
  },
  {
    "id": "search-7",
    "name": "پیتزا سبزیجات",
    "category": "غذای اصلی",
    "calories": "ثبت نشده",
    "cookingTime": "ثبت نشده",
    "image": "/food-placeholder.svg",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "فستفود"
    ],
    "placements": [
      "search"
    ]
  },
  {
    "id": "calculator-pasta",
    "name": "پاستا با سس قارچ",
    "category": "غذای اصلی",
    "calories": "ثبت نشده",
    "cookingTime": "ثبت نشده",
    "image": "/food-placeholder.svg",
    "baseServings": 1,
    "ingredients": [
      {
        "name": "پاستای خشک",
        "quantity": 100,
        "unit": "گرم"
      },
      {
        "name": "قارچ",
        "quantity": 75,
        "unit": "گرم"
      },
      {
        "name": "شیر",
        "quantity": 0.5,
        "unit": "لیوان"
      },
      {
        "name": "خامه",
        "quantity": 1.5,
        "unit": "قاشق غذاخوری"
      },
      {
        "name": "روغن زیتون",
        "quantity": 0.5,
        "unit": "قاشق غذاخوری"
      },
      {
        "name": "پنیر پارمزان",
        "quantity": 15,
        "unit": "گرم"
      }
    ],
    "instructions": [],
    "tags": [
      "سریع و آسان"
    ],
    "placements": [
      "calculator"
    ]
  },
  {
    "id": "admin-default-ghormeh",
    "name": "قورمه سبزی سنتی",
    "category": "غذای اصلی",
    "calories": "۶۵۰ کیلوکالری",
    "cookingTime": "ثبت نشده",
    "image": "/food-placeholder.svg",
    "baseServings": 2,
    "ingredients": [],
    "instructions": [],
    "tags": [
      "سنتی"
    ],
    "placements": [
      "menu"
    ]
  }
];
