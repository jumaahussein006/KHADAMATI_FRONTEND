import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext({
  currency: 'LBP',
  setCurrency: () => {},
  toggleCurrency: () => {},
  formatPrice: () => '',
  convertToUSD: () => 0,
  convertToLBP: () => 0,
  exchangeRate: 15000
});

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  return context;
};

// Exchange rate: 1 USD = 15000 LBP (approximate, should be fetched from API in production)
const EXCHANGE_RATE = 15000;

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('khadamati_currency');
      return saved || 'LBP';
    }
    return 'LBP';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('khadamati_currency', currency);
    }
  }, [currency]);

  const toggleCurrency = React.useCallback(() => {
    setCurrency(prev => prev === 'LBP' ? 'USD' : 'LBP');
  }, []);

  const formatPrice = React.useCallback((price) => {
    const numPrice = parseFloat(price) || 0;
    if (currency === 'USD') {
      const usdPrice = numPrice / EXCHANGE_RATE;
      return `$${usdPrice.toFixed(2)}`;
    }
    return `${numPrice.toLocaleString('ar-LB')} ل.ل`;
  }, [currency]);

  const convertToUSD = React.useCallback((lbpPrice) => {
    return (parseFloat(lbpPrice) || 0) / EXCHANGE_RATE;
  }, []);

  const convertToLBP = React.useCallback((usdPrice) => {
    return (parseFloat(usdPrice) || 0) * EXCHANGE_RATE;
  }, []);

  const value = React.useMemo(() => ({
    currency: currency || 'LBP',
    setCurrency,
    toggleCurrency,
    formatPrice,
    convertToUSD,
    convertToLBP,
    exchangeRate: EXCHANGE_RATE
  }), [currency, setCurrency, toggleCurrency, formatPrice, convertToUSD, convertToLBP]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

