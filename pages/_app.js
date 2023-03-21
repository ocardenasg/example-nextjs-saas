import { UserProvider } from '@/context/user'
import Nav from '@/components/nav'

import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Nav />
      <Component {...pageProps} />
    </UserProvider>
  )
}
