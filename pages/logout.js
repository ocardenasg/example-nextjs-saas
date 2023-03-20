import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabase'

export default function Login() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut()
      router.push('/')
    }

    logout()
  }, [router])

  return <div>logging out</div>
}
