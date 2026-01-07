/**
 * Service Issues Mapping
 * Maps service category IDs to their available issues in both languages
 */

export const serviceIssuesMap = {
  // Plumbing (category_id: 1)
  1: {
    en: [
      'Faucet water leak',
      'Bathroom water leak',
      'Pipe blockage',
      'Water heater issue',
      'Toilet malfunction'
    ],
    ar: [
      'تسرب مياه الصنبور',
      'تسرب مياه الحمام',
      'انسداد الأنابيب',
      'مشكلة سخان المياه',
      'خلل في المرحاض'
    ]
  },
  // Electricity (category_id: 2)
  2: {
    en: [
      'Power outage',
      'Broken switch',
      'Lighting issue',
      'Electrical short circuit',
      'AC power issue'
    ],
    ar: [
      'انقطاع التيار الكهربائي',
      'مفتاح معطل',
      'مشكلة في الإضاءة',
      'قصر كهربائي',
      'مشكلة في كهرباء التكييف'
    ]
  },
  // Carpentry (category_id: 3)
  3: {
    en: [
      'Broken door',
      'Furniture repair',
      'Cabinet fixing',
      'Window repair'
    ],
    ar: [
      'باب مكسور',
      'تصليح الأثاث',
      'إصلاح الخزائن',
      'تصليح النوافذ'
    ]
  },
  // Painting (category_id: 4)
  4: {
    en: [
      'Wall repainting',
      'Ceiling paint',
      'Crack repair before painting'
    ],
    ar: [
      'إعادة طلاء الجدران',
      'طلاء السقف',
      'إصلاح الشقوق قبل الطلاء'
    ]
  },
  // Cleaning (category_id: 5)
  5: {
    en: [
      'House cleaning',
      'Deep cleaning',
      'Post-renovation cleaning'
    ],
    ar: [
      'تنظيف المنزل',
      'تنظيف عميق',
      'تنظيف ما بعد التجديد'
    ]
  },
  // Gardening (category_id: 6)
  6: {
    en: [
      'Tree trimming',
      'Lawn maintenance',
      'Garden cleaning'
    ],
    ar: [
      'تقليم الأشجار',
      'صيانة العشب',
      'تنظيف الحديقة'
    ]
  },
  // Air Conditioning (category_id: 7)
  7: {
    en: [
      'AC not cooling',
      'Gas refill',
      'AC cleaning',
      'AC installation'
    ],
    ar: [
      'التكييف لا يبرد',
      'إعادة تعبئة الغاز',
      'تنظيف التكييف',
      'تركيب التكييف'
    ]
  },
  // Moving (category_id: 8)
  8: {
    en: [
      'Home moving',
      'Furniture moving',
      'Packing service'
    ],
    ar: [
      'نقل المنزل',
      'نقل الأثاث',
      'خدمة التعبئة'
    ]
  }
};

/**
 * Get issues for a service category
 * @param {number} categoryId - The category ID
 * @param {string} lang - Language code ('en' or 'ar')
 * @returns {Array<string>} Array of issue strings
 */
export const getServiceIssues = (categoryId, lang = 'en') => {
  const category = serviceIssuesMap[categoryId];
  if (!category) return [];
  return category[lang] || category.en || [];
};

