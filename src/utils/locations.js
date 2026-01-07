// Static location data for Lebanon - Baalbek-Hermel region
export const LOCATIONS = [
    { id: 1, name_en: 'Baalbek', name_ar: 'بعلبك' },
    { id: 2, name_en: 'Hermel', name_ar: 'الهرمل' },
    { id: 3, name_en: 'Arsal', name_ar: 'عرسال' },
    { id: 4, name_en: 'Ras Baalbek', name_ar: 'رأس بعلبك' },
    { id: 5, name_en: 'Brital', name_ar: 'بريتال' },
    { id: 6, name_en: 'Deir El Ahmar', name_ar: 'دير الأحمر' },
    { id: 7, name_en: 'Labweh', name_ar: 'اللبوة' },
    { id: 8, name_en: 'Nabi Sheet', name_ar: 'النبي شيت' }
];

export const getLocationsForSearch = (query = '', language = 'en') => {
    if (!query) return LOCATIONS;
    const lowerQuery = query.toLowerCase();
    return LOCATIONS.filter(loc =>
        loc.name_en.toLowerCase().includes(lowerQuery) ||
        loc.name_ar.toLowerCase().includes(lowerQuery)
    );
};
