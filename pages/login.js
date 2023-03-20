import { useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function Login() {
  useEffect(() => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
    })
  }, [])

  return <div>logging in</div>
}
