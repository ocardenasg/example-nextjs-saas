import { useUser } from '@/context/user'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  const { user, isLoading } = useUser()

  async function loadPortal() {
    const request = await fetch('/api/portal', {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    })
    const response = await request.json()

    router.push(response.url)
  }

  return (
    <main className="flex flex-col py-2 w-1/2 mx-auto">
      <h1 className="text-3xl mt-3">Dashboard</h1>
      {!isLoading && (
        <div className="text-1xl">
          <p>
            {(user?.is_subscribed && `Subscribed: ${user?.interval}`) ||
              'Not subscribed'}
          </p>
          <button onClick={loadPortal}>Manage susbscription</button>
        </div>
      )}
    </main>
  )
}
