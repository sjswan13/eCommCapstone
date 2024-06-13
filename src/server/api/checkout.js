
// This is your test secret API key.
require('dotenv').config()
const router = require("express").Router();
const stripe = require("stripe")(process.env.TEST_KEY);
apiUrl = 'localhost:3000/api/checkout'


router.post('/create-checkout-session', async (req, res) => {
  const {products} = req.body;
  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
        image: product.imageUrl
      },
      unit_amount:product.price*100
    },
    quantity:product.quantity
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${apiUrl}?success=true`,
    cancel_url: `${apiUrl}?canceled=true`,
  });

  res.redirect(303, session.url);
});

// router.listen(3000, () => console.log('Running on port 3000'));
// require('dotenv').config();
const router = require("express").Router();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'))

const stripe = require('stripe')(process.env.TEST_KEY)

router.post('/create-checkout-session', async (req, res) => {
  try {
    console.log(req.body);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.cartProducts.map(cartProduct => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: cartProduct.product.name
            },
            unit_amount: cartProduct.product.price*100
          },
          quantity: cartProduct.quantity
        }
      }),
      success_url: `${process.env.LOCAL_SERVER_URL}order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.LOCAL_SERVER_URL}cart?message=Your order was cancelled. Please try again.`
      // success_url: `${process.env.REACT_APP_SERVER_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url: `${process.env.REACT_APP_SERVER_URL}/cart?message=Your order was cancelled. Please try again.`
    });

    return res.json({ url: session.url })

  } catch (e) {
    if (!res.headersSent)
    res.status(500).json({ error: e.message })
  }
});


module.exports = router
