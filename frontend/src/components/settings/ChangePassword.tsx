import { useEffect, useState } from "react"
import PasswordInput from "../ui/PasswordInput"
import Button from "../ui/Button"
import { supabase } from "../../config"
import { toast } from "sonner";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("")
  const [disabled, setDisabled] = useState<boolean>(true)

  useEffect(() => {
    if (newPassword && confirmNewPassword && newPassword === confirmNewPassword) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [newPassword, confirmNewPassword])
  

  const handleSubmit = async () => {
    setDisabled(true)
    if (newPassword === confirmNewPassword) {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      setDisabled(false)
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password updated successfully');
      }
    } else {
      toast.error('Passwords do not match');
    }
  };
  

  return (
    <div className='bg-white rounded-2xl shadow-xl flex flex-col p-4 gap-4'>
      <div className="flex gap-4 items-center font-bold text-xl">
        <div className='w-[10px] h-[10px] bg-red-500 rounded-full'/>
        <h1>Change Password</h1>
      </div>

      <div className="flex flex-col items-center w-full gap-4">
        <div className="flex flex-col w-[300px] sm:w-[600px] gap-4">
          <PasswordInput password={newPassword} setPassword={setNewPassword} placeholder="Enter the new password"/>
          <PasswordInput password={confirmNewPassword} setPassword={setConfirmNewPassword} placeholder="Confirm the new password"/>
        </div>
        <Button onClick={handleSubmit} disabled={disabled}>Submit</Button>
      </div>
    </div>
  )
}

export default ChangePassword