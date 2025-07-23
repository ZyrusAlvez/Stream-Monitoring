import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';

interface TutorialButtonProps {
  path: string;
  className?: string;
}

const TutorialButton: React.FC<TutorialButtonProps> = ({ 
  path,
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleTutorial = () => {
    navigate(path);
  };

  return (
    <button
      onClick={handleTutorial}
      className={`
        h-[50px] inline-flex items-center gap-2 px-4 py-2 
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
      <HiOutlineQuestionMarkCircle className="w-4 h-4" />
      How to use?
    </button>
  );
};

export default TutorialButton;