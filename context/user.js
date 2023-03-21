import { createContext, useEffect, useState, useContext } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/router'

const Context = createContext()

export function UserProvider(props) {
  const [user, setUser] = useState(null)

  const router = useRouter()

  useEffect(() => {
    async function getUserProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setUser(null)
        return
      }

      const { data: profile } = await supabase
        .from('profile')
        .select('*')
        .eq('id', user.id)
        .single()

      setUser({ ...user, ...profile })
    }

    getUserProfile()

    supabase.auth.onAuthStateChange(() => {
      getUserProfile()
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const login = async () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
    })
  }

  return <Context.Provider value={{ user, login, logout }} {...props} />
}

export function useUser() {
  return useContext(Context)
}
