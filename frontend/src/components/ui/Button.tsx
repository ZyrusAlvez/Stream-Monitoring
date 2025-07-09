type Props = {
  children: React.ReactNode,
  className?: string,
  onClick?: () => void,
}

const Button = ({children, onClick, className}: Props) => {
  return (
    <button onClick={onClick} className={`w-[150px] px-2 py-1 rounded-lg bg-[#008037] text-white text-lg font-bold ${className}`}>{children}</button>
  )
}

export default Button