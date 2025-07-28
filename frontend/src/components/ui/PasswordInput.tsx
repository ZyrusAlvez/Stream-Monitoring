import {useState} from 'react'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

type Props = {
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  password: string
  setPassword: React.Dispatch<React.SetStateAction<string>>
}

const PasswordInput = ({onKeyDown, password, setPassword}: Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter the password"
          onKeyDown={onKeyDown}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          {showPassword ? (
            <HiOutlineEyeOff className="w-5 h-5" />
          ) : (
            <HiOutlineEye className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
    )
}

export default PasswordInput