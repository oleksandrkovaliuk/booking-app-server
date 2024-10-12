const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getClientSecret = async (req, res) => {
  const params = req.query;
  const { total } = params;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      capture_method: "manual",
    });

    console.log(paymentIntent, "paymentIntent");
    return res.status(200).json(paymentIntent.client_secret);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getClientSecret;
