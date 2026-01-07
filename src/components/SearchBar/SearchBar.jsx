import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiMapPin, FiChevronDown, FiX } from 'react-icons/fi';
import { categoriesAPI, servicesAPI, providersAPI } from '../../services/apiService';
import { getServiceName, getCategoryName, getServiceIssues } from '../../utils/langHelper';
import { motion, AnimatePresence } from 'framer-motion';
import { LOCATIONS } from '../../utils/locations';

// Helper component for highlighting text
const HighlightText = ({ text = '', highlight = '' }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ?
          <span key={i} className="text-[#0BA5EC] font-black">{part}</span> :
          <span key={i}>{part}</span>
      )}
    </span>
  );
};



const SearchBar = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [categories, setCategories] = useState([]);

  const locationRef = useRef(null);
  const serviceRef = useRef(null);
  const navigate = useNavigate();

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes] = await Promise.all([
          categoriesAPI.getAll()
        ]);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(event.target)) {
        setShowServiceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    setShowLocationDropdown(true);

    const filtered = LOCATIONS.filter(loc =>
      loc.name_en.toLowerCase().includes(value.toLowerCase()) ||
      loc.name_ar.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  const handleServiceChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 0) {
      setShowServiceDropdown(true);
      try {
        // Real API call for search
        const servicesRes = await servicesAPI.getAll({ search: value });
        setFilteredServices(servicesRes.data || []);

        const filteredCats = categories.filter(cat =>
        (cat.name_ar?.toLowerCase().includes(value.toLowerCase()) ||
          cat.name_en?.toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredCategories(filteredCats);

        const providersRes = await providersAPI.getAll({ search: value });
        setFilteredProviders(providersRes.data || []);
      } catch (err) {
        console.error('Search error:', err);
      }
    } else {
      // setShowServiceDropdown(true); // Keep it open for default suggestions
      setFilteredServices([]);
      setFilteredCategories(categories.slice(0, 6)); // Show top 6 categories by default
      setFilteredProviders([]);
    }
  };

  const handleServiceFocus = () => {
    setShowServiceDropdown(true);
    if (!searchQuery) {
      setFilteredCategories(categories.slice(0, 6));
    }
  };

  const selectLocation = (loc) => {
    setLocation(isRTL ? loc.name_ar : loc.name_en);
    setShowLocationDropdown(false);
  };

  const selectCategory = (category) => {
    setSearchQuery(getCategoryName(category, i18n.language));
    setShowServiceDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery && !location) {
      navigate('/services');
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    if (query) {
      // 1. Check for exact category match
      const categoryMatch = categories.find(c =>
      (c.name_ar?.toLowerCase() === query ||
        c.name_en?.toLowerCase() === query ||
        getCategoryName(c, i18n.language).toLowerCase() === query)
      );
      if (categoryMatch) {
        navigate(`/services?category=${categoryMatch.category_id || categoryMatch.id}`);
        return;
      }

      // 2. Check for exact provider match
      const providerMatch = filteredProviders.find(p => {
        const u = p.user;
        if (!u) return false;
        const fullName = (u.first_name + ' ' + u.last_name).toLowerCase();
        return fullName === query;
      });
      if (providerMatch) {
        navigate(`/provider-details/${providerMatch.provider_id}`);
        return;
      }

      // 3. Check for exact service match
      const serviceMatch = filteredServices.find(s =>
        getServiceName(s, i18n.language).toLowerCase() === query
      );
      if (serviceMatch) {
        navigate(`/services/${serviceMatch.service_id}`);
        return;
      }
    }

    // 4. No direct specific match found, perform general search
    let url = `/services?`;
    if (searchQuery) url += `search=${encodeURIComponent(searchQuery.trim())}`;
    if (location) url += `${searchQuery ? '&' : ''}location=${encodeURIComponent(location.trim())}`;

    navigate(url);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-[1.5rem] md:rounded-full p-2 shadow-2xl border border-gray-100 dark:border-gray-700 transition-all focus-within:ring-4 focus-within:ring-[#0BA5EC]/20">

        {/* Service Input */}
        <div className="relative flex-[1.5] flex items-center" ref={serviceRef}>
          <div className={`pl-4 flex items-center justify-center text-gray-400 ${isRTL ? 'order-last pr-4 pl-0' : ''}`}>
            <FiSearch className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder={t('search.servicePlaceholder')}
            value={searchQuery}
            onChange={handleServiceChange}
            onFocus={handleServiceFocus}
            className="w-full py-4 px-3 bg-transparent text-gray-900 dark:text-white outline-none font-bold placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setFilteredCategories(categories.slice(0, 6)); }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX />
            </button>
          )}

          <AnimatePresence>
            {showServiceDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 py-2"
              >
                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {/* Categories Section */}
                  {filteredCategories.length > 0 && (
                    <>
                      <div className="px-6 py-2 bg-gray-50 dark:bg-gray-700/30">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0BA5EC]">{t('home.topCategories')}</span>
                      </div>
                      {filteredCategories.map((cat) => (
                        <button
                          key={cat.category_id || cat.id}
                          type="button"
                          onClick={() => selectCategory(cat)}
                          className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left font-bold"
                        >
                          <div className="h-8 w-8 bg-[#0BA5EC]/10 text-[#0BA5EC] rounded-xl flex items-center justify-center flex-shrink-0">
                            <FiSearch size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-900 dark:text-white uppercase text-xs tracking-tighter">
                              <HighlightText text={getCategoryName(cat, i18n.language)} highlight={searchQuery} />
                            </span>
                            <span className="text-[10px] text-gray-400">{t('service.featured')}</span>
                          </div>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Services Section */}
                  {filteredServices.length > 0 && (
                    <>
                      <div className="px-6 py-2 bg-gray-50 dark:bg-gray-700/30">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0BA5EC]">{t('common.services')}</span>
                      </div>
                      {filteredServices.map((ser) => (
                        <button
                          key={ser.service_id}
                          type="button"
                          onClick={() => {
                            setSearchQuery(getServiceName(ser, i18n.language));
                            setShowServiceDropdown(false);
                          }}
                          className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left font-bold"
                        >
                          <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FiChevronDown size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-900 dark:text-white text-sm">
                              <HighlightText text={getServiceName(ser, i18n.language)} highlight={searchQuery} />
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {getServiceIssues(ser, i18n.language) || t('service.viewDetails')}
                            </span>
                          </div>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Providers Section */}
                  {filteredProviders.length > 0 && (
                    <>
                      <div className="px-6 py-2 bg-gray-50 dark:bg-gray-700/30">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0BA5EC]">{t('home.topProviders')}</span>
                      </div>
                      {filteredProviders.map((prov) => (
                        <button
                          key={prov.provider_id}
                          type="button"
                          onClick={() => {
                            setSearchQuery(`${prov.user?.first_name} ${prov.user?.last_name}`);
                            setShowServiceDropdown(false);
                          }}
                          className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left font-bold"
                        >
                          <div className="h-8 w-8 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0">
                            {prov.user?.first_name[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-900 dark:text-white text-sm">
                              <HighlightText text={`${prov.user?.first_name} ${prov.user?.last_name}`} highlight={searchQuery} />
                            </span>
                            <span className="text-[10px] text-gray-400">{prov.specialization || t('provider.serviceProvider')}</span>
                          </div>
                        </button>
                      ))}
                    </>
                  )}

                  {filteredCategories.length === 0 && filteredServices.length === 0 && filteredProviders.length === 0 && (
                    <div className="px-6 py-8 text-center">
                      <div className="text-gray-400 mb-2">
                        <FiSearch size={24} className="mx-auto" />
                      </div>
                      <p className="text-gray-500 font-bold">{t('search.noResults')}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden md:block w-px bg-gray-100 dark:bg-gray-700 my-2"></div>

        {/* Location Input */}
        <div className="relative flex-1 flex items-center" ref={locationRef}>
          <div className={`pl-4 flex items-center justify-center text-gray-400 ${isRTL ? 'order-last pr-4 pl-0' : ''}`}>
            <FiMapPin className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder={t('search.locationPlaceholder')}
            value={location}
            onChange={handleLocationChange}
            onFocus={() => setShowLocationDropdown(true)}
            className="w-full py-4 px-3 bg-transparent text-gray-900 dark:text-white outline-none font-bold placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {location && (
            <button
              type="button"
              onClick={() => { setLocation(''); setShowLocationDropdown(false); }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors absolute right-2"
            >
              <FiX />
            </button>
          )}

          <AnimatePresence>
            {showLocationDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 py-2"
              >
                <div className="px-6 py-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0BA5EC]">{t('location.baalbekHermel')}</span>
                </div>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => selectLocation(loc)}
                      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left font-bold"
                    >
                      <FiMapPin size={14} className="text-gray-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white">
                        <HighlightText text={isRTL ? loc.name_ar : loc.name_en} highlight={location} />
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-6 py-4 text-gray-400 text-sm italic text-center">{t('search.noResults')}</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white px-10 py-4 rounded-[1.2rem] md:rounded-full font-black text-lg transition-all hover:shadow-[0_10px_30px_-5px_rgba(11,165,236,0.5)] active:scale-95 flex items-center justify-center gap-2"
        >
          <FiSearch className="stroke-[3px]" />
          <span className="md:inline">{t('common.search')}</span>
        </button>
      </form>

      {/* Search Suggestion Pills */}
      {!searchQuery && !location && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {categories.slice(0, 4).map(cat => (
            <button
              key={cat.category_id}
              onClick={() => selectCategory(cat)}
              className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-black text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-[#0BA5EC] transition-all shadow-sm"
            >
              {getCategoryName(cat, i18n.language)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
