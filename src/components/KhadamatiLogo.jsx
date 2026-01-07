import React from 'react';
import logo from '../assets/logo';

export const KhadamatiLogo = ({ className = "h-10 w-10", alt = "Khadamati Logo" }) => {
  return (
    <img
      src={logo}
      alt={alt}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default KhadamatiLogo;
