import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * AreaSelector – multi‑checkbox component for selecting service areas.
 * Props:
 *   - locations: array of location objects { id, name, nameAr }
 *   - selected: array of selected location ids
 *   - onChange: function(newSelectedArray)
 */
// AreaSelector.jsx
const AreaSelector = ({ locations = [], selected = [], onChange }) => {
    const { t, i18n } = useTranslation();

    const toggle = (id) => {
        const newSelected = selected.includes(id)
            ? selected.filter(s => s !== id)
            : [...selected, id];
        onChange(newSelected);
    };

    const isAllSelected = locations.length && selected.length === locations.length;
    const toggleAll = () => {
        if (isAllSelected) onChange([]);
        else onChange(locations.map(l => l.id));
    };

    return (
        <div className="mb-4">
            <h3 className="mb-2 font-medium dark:text-white">{t('common.areaSelector')}</h3>
            <div className="flex flex-wrap gap-2">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleAll}
                        className="form-checkbox h-4 w-4 text-[#0BA5EC] border-gray-300 rounded"
                    />
                    <span className="text-sm dark:text-gray-300">{t('search.all')}</span>
                </label>
                {locations.map(loc => (
                    <label key={loc.id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selected.includes(loc.id)}
                            onChange={() => toggle(loc.id)}
                            className="form-checkbox h-4 w-4 text-[#0BA5EC] border-gray-300 rounded"
                        />
                        <span className="text-sm dark:text-gray-300">
                            {i18n.language === 'ar' ? loc.nameAr : loc.name}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default AreaSelector;
