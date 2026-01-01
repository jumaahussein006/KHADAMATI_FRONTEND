// Problem examples by category (bilingual) - displayed as selectable list
export const PROBLEM_EXAMPLES = {
    1: { // Plumbing
        examples_en: [
            "Broken faucet",
            "Water leakage",
            "Bathroom pipe issue"
        ],
        examples_ar: [
            "حنفية مكسورة",
            "تسريب مياه",
            "مشكلة أنابيب الحمام"
        ]
    },
    2: { // Electrical
        examples_en: [
            "Power outage",
            "Socket replacement",
            "Lighting installation"
        ],
        examples_ar: [
            "انقطاع كهرباء",
            "تبديل مقبس",
            "تركيب إضاءة"
        ]
    },
    3: { // Cleaning
        examples_en: [
            "Apartment cleaning",
            "After construction cleaning",
            "Deep kitchen cleaning"
        ],
        examples_ar: [
            "تنظيف شقة",
            "تنظيف بعد البناء",
            "تنظيف عميق للمطبخ"
        ]
    },
    4: { // Painting
        examples_en: [
            "Room repaint",
            "Wall cracks repair",
            "Full apartment painting"
        ],
        examples_ar: [
            "إعادة دهان غرفة",
            "تصليح شقوق الجدران",
            "دهان شقة كاملة"
        ]
    },
    5: { // AC Repair
        examples_en: [
            "AC not cooling",
            "Gas refill",
            "AC maintenance"
        ],
        examples_ar: [
            "المكيف لا يبرد",
            "تعبئة غاز",
            "صيانة مكيف"
        ]
    },
    6: { // Carpentry
        examples_en: [
            "Door repair",
            "Furniture assembly",
            "Cabinet installation"
        ],
        examples_ar: [
            "تصليح باب",
            "تركيب أثاث",
            "تركيب خزانة"
        ]
    },
};

// Get problem examples for a category
export const getProblemExamples = (categoryId, language = 'en') => {
    // Handle both string and number IDs
    const numId = Number(categoryId);
    const strId = String(categoryId);

    // Try number first, then string
    const category = PROBLEM_EXAMPLES[numId] || PROBLEM_EXAMPLES[strId] || PROBLEM_EXAMPLES[categoryId];

    if (!category) {
        return [];
    }

    return language === 'ar' ? category.examples_ar : category.examples_en;
};
