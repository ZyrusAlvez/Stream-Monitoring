import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';

interface BackButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  className = '', 
  children = 'Back' 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className={`
        inline-flex items-center gap-2 px-4 py-2 
        bg-gradient-to-r from-slate-100 to-green-100 
        hover:from-slate-200 hover:to-green-200 
        text-slate-700 hover:text-slate-800
        border border-slate-200 hover:border-slate-300
        rounded-lg font-medium 
        transition-all duration-200 
        shadow-sm hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2
        ${className}
      `}
    >
      <HiOutlineArrowLeft className="w-4 h-4" />
      {children}
    </button>
  );
};

export default BackButton;