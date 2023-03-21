import initStripe from 'stripe'
import { buffer } from 'micro'
import { getServiceSupabase } from '@/utils/supabase'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  const reqBuffer = await buffer(req)
  const signature = req.headers['stripe-signature']
  const signingSecret = process.env.STRIPE_SIGNING_SECRET
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY)

  try {
    const event = stripe.webhooks.constructEvent(
      reqBuffer,
      signature,
      signingSecret
    )

    const supabase = getServiceSupabase()
    if (event.type === 'customer.subscription.updated') {
      await supabase
        .from('profile')
        .update({
          interval: event.data.object.plan.interval,
          is_subscribed: event.data.object.plan.active,
        })
        .eq('stripe_customer', event.data.object.customer)
    }

    return res.status(201).send(event)
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`)
  }
}
