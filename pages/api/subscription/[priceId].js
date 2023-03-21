import initStripe from 'stripe'
import { getServiceSupabase } from '@/utils/supabase'

export default async function handler(req, res) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized')
  }

  const { authorization } = req.headers
  const supabase = getServiceSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser(authorization.replace('Bearer ', ''))

  if (!user) {
    return res.status(401).send('Unauthorized')
  }

  const {
    data: { stripe_customer },
  } = await supabase
    .from('profile')
    .select('stripe_customer')
    .eq('id', user.id)
    .single()

  const stripe = initStripe(process.env.STRIPE_SECRET_KEY)
  const { priceId } = req.query

  const lineItems = [
    {
      price: priceId,
      quantity: 1,
    },
  ]

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: lineItems,
    customer: stripe_customer,
    payment_method_types: ['card'],
    success_url: `${process.env.CLIENT_URL}/payment/success`,
    cancel_url: `${process.env.CLIENT_URL}/payment/cancelled`,
  })

  return res.status(201).send({ id: session.id })
}
