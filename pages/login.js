import { useEffect } from 'react'
import { useUser } from '@/context/user'

export default function Login() {
  const { login } = useUser()

  useEffect(() => {
    login()
  }, [login])

  return <div>logging in</div>
}
