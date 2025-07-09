type Props = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  variant?: 'default' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  width?: string;
}

const InputText = ({
  placeholder,
  value,
  onChange,
  className = '',
  label,
  error,
  disabled = false,
  variant = 'default',
  size = 'md',
  icon,
  width = 'w-full'
}: Props) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const variantClasses = {
    default: `
      bg-white/80 backdrop-blur-sm
      border-2 border-slate-200/60
      hover:border-slate-300/80
      focus:border-emerald-500/80
      focus:bg-white
      shadow-sm hover:shadow-md
      transition-all duration-300 ease-out
    `,
    filled: `
      bg-slate-100/80 backdrop-blur-sm
      border-2 border-transparent
      hover:bg-slate-200/60
      focus:bg-white
      focus:border-emerald-500/80
      shadow-sm hover:shadow-md
      transition-all duration-300 ease-out
    `,
    underlined: `
      bg-transparent
      border-0 border-b-2 border-slate-200/60
      hover:border-slate-300/80
      focus:border-emerald-500/80
      rounded-none
      px-0 py-3
      transition-all duration-300 ease-out
    `
  };

  const baseClasses = `
    ${width}
    rounded-xl
    outline-none
    text-slate-700
    placeholder:text-slate-400
    transition-all duration-300 ease-out
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${error ? 'border-red-400/80 focus:border-red-500/80' : ''}
  `;

  return (
    <div className={`space-y-2 ${width}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300">
            {icon}
          </div>
        )}
        
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`
            ${baseClasses}
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${icon ? 'pl-10' : ''}
            ${className}
          `}
        />
        
        {/* Focus ring effect */}
        <div className="absolute inset-0 rounded-xl ring-2 ring-emerald-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1 animate-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputText;