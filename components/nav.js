import Link from 'next/link'

import { useUser } from '@/context/user'

export default function Nav() {
  const { user } = useUser()
  return (
    <nav className="flex py-4 px-2 border-b boder-gray-200">
      <Link href="/">Home</Link>
      <Link href="/pricing" className="ml-2">
        Pricing
      </Link>
      <Link href={(user && '/logout') || '/login'} className="ml-auto">
        {(user && 'Logout') || 'Login'}
      </Link>
    </nav>
  )
}
