import React, { useState } from 'react';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ElementType;
  description?: string;
};

const MenuButton = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false, 
  icon: Icon, 
  description 
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative group h-[200px]">
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative overflow-hidden rounded-xl bg-white border-2 border-green-100 hover:border-[#008037] text-gray-800 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#008037]/5 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex flex-col items-center p-6 h-[160px]">
          {Icon && (
            <div className="mb-3 p-3 rounded-full bg-[#008037]/10 group-hover:bg-[#008037]/20 text-[#008037] transition-colors duration-300">
              <Icon className="w-6 h-6" />
            </div>
          )}

          <h3 className="text-lg font-semibold mb-2 text-center">
            {children}
          </h3>

          {description && (
            <p className="text-sm opacity-80 text-center leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#008037] to-green-400 transform ${isHovered ? 'scale-x-100' : 'scale-x-0'} transition-transform duration-300 origin-left`} />
      </button>
    </div>
  );
};

export default MenuButton;