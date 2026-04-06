import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: "Personalized Party Quiz", description: "15 custom questions + answer key, print-ready PDF" },
        unit_amount: 500,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `${req.headers.origin}/?success=true`,
    cancel_url: `${req.headers.origin}/?cancelled=true`,
  });
  res.status(200).json({ url: session.url });
}
