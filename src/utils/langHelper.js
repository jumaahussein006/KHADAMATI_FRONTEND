/**
 * Safely retrieves the service name based on the current language.
 * Handles undefined objects, missing keys, and fallbacks.
 * 
 * @param {Object} service - The service object (db row or mock data)
 * @param {string} lang - The current language code ('ar' or 'en')
 * @returns {string} The localized name or an empty string
 */
export const getServiceName = (service, lang) => {
    if (!service) return '';

    // Support both camelCase (from Sequelize) and snake_case
    const nameAr = service.nameAr || service.name_ar || service.title || '';
    const nameEn = service.nameEn || service.name_en || service.title || '';

    if (lang === 'ar') {
        return nameAr || nameEn;
    }
    return nameEn || nameAr;
};

/**
 * Safely retrieves the service description based on the current language.
 * 
 * @param {Object} service - The service object
 * @param {string} lang - The current language code
 * @returns {string} The localized description
 */
export const getServiceDescription = (service, lang) => {
    if (!service) return '';
    // Support both camelCase and snake_case
    const descAr = service.descriptionAr || service.description_ar || service.description || '';
    const descEn = service.descriptionEn || service.description_en || service.description || '';
    return lang === 'ar' ? (descAr || descEn) : (descEn || descAr);
};

/**
 * Safely retrieves the category name based on the current language.
 * 
 * @param {Object} category - The category object
 * @param {string} lang - The current language code
 * @returns {string} The localized name
 */
export const getCategoryName = (category, lang) => {
    if (!category) return '';
    // Handle both camelCase and snake_case field names
    const nameAr = category.nameAr || category.name_ar || category.name || '';
    const nameEn = category.nameEn || category.name_en || category.name || '';
    return lang === 'ar' ? (nameAr || nameEn) : (nameEn || nameAr);
};

/**
 * Safely retrieves example issues/tasks for a service based on the current language.
 * Maps services by category_id or service names to their example issues.
 * 
 * @param {Object} service - The service object
 * @param {string} lang - The current language code ('ar' or 'en')
 * @param {Object} category - Optional category object for better matching
 * @returns {string} The localized example issues or empty string
 */
export const getServiceIssues = (service, lang, category = null) => {
    if (!service) return '';

    // If service has issues_en or issues_ar fields, use them directly
    if (lang === 'ar' && service.issues_ar) {
        return service.issues_ar;
    }
    if (lang !== 'ar' && service.issues_en) {
        return service.issues_en;
    }

    // Mapping by category_id (most reliable)
    // Category IDs: 1=Plumbing, 2=Electricity, 3=Carpentry, 4=Painting, 5=Cleaning, 6=Gardening, 7=AC, 8=Moving
    const issuesByCategoryId = {
        // English issues
        en: {
            1: 'Fix leaking pipes, Install faucets, Unclog drains', // Plumbing
            2: 'Replace switches, Fix wiring, Install lights', // Electricity
            3: 'Repair doors, Build cabinets, Fix furniture', // Carpentry
            4: 'Wall painting, Touch-ups, Exterior painting', // Painting
            5: 'Deep cleaning, Carpet cleaning, Window cleaning', // Cleaning
            6: 'Lawn mowing, Planting, Tree trimming', // Gardening
            7: 'Repair AC, Install AC, Clean filters', // Air Conditioning
            8: 'Furniture moving, Packing, Loading/unloading' // Moving
        },
        // Arabic issues
        ar: {
            1: 'تصليح تسربات المياه، تركيب صنابير، فتح المجاري', // Plumbing
            2: 'استبدال المفاتيح، تصليح الأسلاك، تركيب الإنارة', // Electricity
            3: 'تصليح الأبواب، بناء خزائن، تصليح الأثاث', // Carpentry
            4: 'طلاء الجدران، لمسات نهائية، طلاء خارجي', // Painting
            5: 'تنظيف عميق، تنظيف السجاد، تنظيف النوافذ', // Cleaning
            6: 'جز العشب، الزراعة، تقليم الأشجار', // Gardening
            7: 'تصليح التكييف، تركيب التكييف، تنظيف الفلاتر', // Air Conditioning
            8: 'نقل الأثاث، التعبئة، التحميل والتفريغ' // Moving
        }
    };

    // Try to match by category_id first (most reliable)
    if (service.category_id && issuesByCategoryId[lang] && issuesByCategoryId[lang][service.category_id]) {
        return issuesByCategoryId[lang][service.category_id];
    }

    // Fallback: match by category name if category object is provided
    if (category) {
        const categoryName = getCategoryName(category, lang).toLowerCase();
        const categoryNameAr = (category.name_ar || '').toLowerCase();
        const categoryNameEn = (category.name_en || '').toLowerCase();

        // Mapping by category name
        const issuesByCategoryName = {
            en: {
                'plumbing': 'Fix leaking pipes, Install faucets, Unclog drains',
                'سباكة': 'Fix leaking pipes, Install faucets, Unclog drains',
                'electricity': 'Replace switches, Fix wiring, Install lights',
                'كهرباء': 'Replace switches, Fix wiring, Install lights',
                'carpentry': 'Repair doors, Build cabinets, Fix furniture',
                'نجارة': 'Repair doors, Build cabinets, Fix furniture',
                'painting': 'Wall painting, Touch-ups, Exterior painting',
                'دهان': 'Wall painting, Touch-ups, Exterior painting',
                'cleaning': 'Deep cleaning, Carpet cleaning, Window cleaning',
                'نظافة': 'Deep cleaning, Carpet cleaning, Window cleaning',
                'gardening': 'Lawn mowing, Planting, Tree trimming',
                'بستنة': 'Lawn mowing, Planting, Tree trimming',
                'air conditioning': 'Repair AC, Install AC, Clean filters',
                'تكييف': 'Repair AC, Install AC, Clean filters',
                'moving': 'Furniture moving, Packing, Loading/unloading',
                'نقل': 'Furniture moving, Packing, Loading/unloading'
            },
            ar: {
                'plumbing': 'تصليح تسربات المياه، تركيب صنابير، فتح المجاري',
                'سباكة': 'تصليح تسربات المياه، تركيب صنابير، فتح المجاري',
                'electricity': 'استبدال المفاتيح، تصليح الأسلاك، تركيب الإنارة',
                'كهرباء': 'استبدال المفاتيح، تصليح الأسلاك، تركيب الإنارة',
                'carpentry': 'تصليح الأبواب، بناء خزائن، تصليح الأثاث',
                'نجارة': 'تصليح الأبواب، بناء خزائن، تصليح الأثاث',
                'painting': 'طلاء الجدران، لمسات نهائية، طلاء خارجي',
                'دهان': 'طلاء الجدران، لمسات نهائية، طلاء خارجي',
                'cleaning': 'تنظيف عميق، تنظيف السجاد، تنظيف النوافذ',
                'نظافة': 'تنظيف عميق، تنظيف السجاد، تنظيف النوافذ',
                'gardening': 'جز العشب، الزراعة، تقليم الأشجار',
                'بستنة': 'جز العشب، الزراعة، تقليم الأشجار',
                'air conditioning': 'تصليح التكييف، تركيب التكييف، تنظيف الفلاتر',
                'تكييف': 'تصليح التكييف، تركيب التكييف، تنظيف الفلاتر',
                'moving': 'نقل الأثاث، التعبئة، التحميل والتفريغ',
                'نقل': 'نقل الأثاث، التعبئة، التحميل والتفريغ'
            }
        };

        const langKey = lang === 'ar' ? 'ar' : 'en';
        const issues = issuesByCategoryName[langKey];

        if (categoryName && issues[categoryName]) {
            return issues[categoryName];
        }
        if (categoryNameAr && issues[categoryNameAr]) {
            return issues[categoryNameAr];
        }
        if (categoryNameEn && issues[categoryNameEn]) {
            return issues[categoryNameEn];
        }
    }

    // Final fallback: try to match by service name
    const serviceName = getServiceName(service, lang).toLowerCase();
    const nameAr = (service.name_ar || '').toLowerCase();
    const nameEn = (service.name_en || '').toLowerCase();

    const issuesByServiceName = {
        en: {
            'plumbing': 'Fix leaking pipes, Install faucets, Unclog drains',
            'سباكة': 'Fix leaking pipes, Install faucets, Unclog drains',
            'electricity': 'Replace switches, Fix wiring, Install lights',
            'كهرباء': 'Replace switches, Fix wiring, Install lights',
            'carpentry': 'Repair doors, Build cabinets, Fix furniture',
            'نجارة': 'Repair doors, Build cabinets, Fix furniture',
            'painting': 'Wall painting, Touch-ups, Exterior painting',
            'دهان': 'Wall painting, Touch-ups, Exterior painting',
            'cleaning': 'Deep cleaning, Carpet cleaning, Window cleaning',
            'نظافة': 'Deep cleaning, Carpet cleaning, Window cleaning',
            'gardening': 'Lawn mowing, Planting, Tree trimming',
            'بستنة': 'Lawn mowing, Planting, Tree trimming',
            'air conditioning': 'Repair AC, Install AC, Clean filters',
            'تكييف': 'Repair AC, Install AC, Clean filters',
            'moving': 'Furniture moving, Packing, Loading/unloading',
            'نقل': 'Furniture moving, Packing, Loading/unloading'
        },
        ar: {
            'plumbing': 'تصليح تسربات المياه، تركيب صنابير، فتح المجاري',
            'سباكة': 'تصليح تسربات المياه، تركيب صنابير، فتح المجاري',
            'electricity': 'استبدال المفاتيح، تصليح الأسلاك، تركيب الإنارة',
            'كهرباء': 'استبدال المفاتيح، تصليح الأسلاك، تركيب الإنارة',
            'carpentry': 'تصليح الأبواب، بناء خزائن، تصليح الأثاث',
            'نجارة': 'تصليح الأبواب، بناء خزائن، تصليح الأثاث',
            'painting': 'طلاء الجدران، لمسات نهائية، طلاء خارجي',
            'دهان': 'طلاء الجدران، لمسات نهائية، طلاء خارجي',
            'cleaning': 'تنظيف عميق، تنظيف السجاد، تنظيف النوافذ',
            'نظافة': 'تنظيف عميق، تنظيف السجاد، تنظيف النوافذ',
            'gardening': 'جز العشب، الزراعة، تقليم الأشجار',
            'بستنة': 'جز العشب، الزراعة، تقليم الأشجار',
            'air conditioning': 'تصليح التكييف، تركيب التكييف، تنظيف الفلاتر',
            'تكييف': 'تصليح التكييف، تركيب التكييف، تنظيف الفلاتر',
            'moving': 'نقل الأثاث، التعبئة، التحميل والتفريغ',
            'نقل': 'نقل الأثاث، التعبئة، التحميل والتفريغ'
        }
    };

    const langKey = lang === 'ar' ? 'ar' : 'en';
    const issues = issuesByServiceName[langKey];

    if (serviceName && issues[serviceName]) {
        return issues[serviceName];
    }
    if (nameAr && issues[nameAr]) {
        return issues[nameAr];
    }
    if (nameEn && issues[nameEn]) {
        return issues[nameEn];
    }

    return '';
};