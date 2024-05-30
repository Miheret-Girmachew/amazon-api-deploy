// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const app = express();

// const { setGlobalOptions } = require("firebase-functions/v2");


// setGlobalOptions({ maxInstances: 10 });
app.use(cors({origin : true}));
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success!",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total);
  if (total <= 0) {
    return res.status(403).json({
      message: "total must be greater than 0",
    });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
  });

  console.log(paymentIntent);

  res.status(200).json({
    message: "Payment intent created successfully",
    clientSecret: paymentIntent.client_secret,
    paymentIntent,
  });
});

app.listen(5000, (err)=>{
  if(err) throw err
  console.log("Amazon Server Runnig on PORT: 5000,http://localhost:5000")
})
