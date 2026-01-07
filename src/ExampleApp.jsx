import React, { useState } from 'react';
import About from './pages/About';

/**
 * Example App showing how to pass the 'language' prop 
 * to the About component for manual overrides.
 */
const ExampleApp = () => {
    const [lang, setLang] = useState('ar');

    return (
        <div className="min-h-screen">
            <div className="fixed top-20 right-4 z-[60] flex gap-2 bg-white p-2 rounded-xl shadow-2xl border border-gray-100">
                <button
                    onClick={() => setLang('en')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${lang === 'en' ? 'bg-[#0BA5EC] text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    English
                </button>
                <button
                    onClick={() => setLang('ar')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${lang === 'ar' ? 'bg-[#0BA5EC] text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    العربية
                </button>
            </div>

            {/* Passing the language prop as requested */}
            <About language={lang} />
        </div>
    );
};

export default ExampleApp;
