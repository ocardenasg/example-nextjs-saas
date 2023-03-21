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

  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer,
    return_url: `${process.env.CLIENT_URL}/dashboard`,
  })

  return res.status(200).send({ url: session.url })
}
