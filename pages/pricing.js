import initStripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

import { useUser } from '@/context/user'

export default function Pricing({ plans = [] }) {
  const { user, login, isLoading } = useUser()

  const showCreateAccountButton = !user
  const showSubscriptionButton = !!user && !user?.is_subscribed
  const showManageSubscriptionButton = !!user && user?.is_subscribed

  const processSubscription = planId => {
    return async () => {
      const request = await fetch(`/api/subscription/${planId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      })
      const response = await request.json()

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
      await stripe.redirectToCheckout({ sessionId: response.id })

      return response
    }
  }

  return (
    <main className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {plans.map(plan => {
        return (
          <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-4">
            <h2 className="text-xl">{plan.name}</h2>
            <p className="text-gray-500">
              {plan.price / 100} / {plan.interval}
            </p>
            {!isLoading && (
              <div>
                {showCreateAccountButton && (
                  <button onClick={login}>Create account</button>
                )}
                {showManageSubscriptionButton && (
                  <button>Manage subscription</button>
                )}
                {showSubscriptionButton && (
                  <button onClick={processSubscription(plan.id)}>
                    Subscribe
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </main>
  )
}

export async function getStaticProps() {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY)

  const { data: prices } = await stripe.prices.list()

  const plans = await Promise.all(
    prices.map(async price => {
      const product = await stripe.products.retrieve(price.product)
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        currency: price.currency,
        interval: price.recurring.interval,
      }
    })
  )

  const sortedPlans = plans.sort((a, b) => a.price - b.price)

  return {
    props: {
      plans: sortedPlans,
    },
  }
}
