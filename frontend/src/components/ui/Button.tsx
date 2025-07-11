type Props = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

const Button = ({ children, onClick, className, disabled }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-[150px] px-2 py-1 rounded-lg bg-[#008037] text-white text-lg font-bold ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}

export default Button