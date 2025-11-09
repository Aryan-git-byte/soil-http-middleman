import express from "express";
import bodyParser from "body-parser";

const app = express();

// Twilio sends x-www-form-urlencoded by default
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // also accept JSON just in case

// --- Endpoint to receive POSTs ---
app.post("/api/twilio-sms", (req, res) => {
  console.log("📩 New POST received!");

  // Print full request body
  console.log("Raw body:", req.body);

  // For Twilio, it’ll contain these keys:
  // { From, To, Body, SmsSid, SmsStatus, ... }
  console.log("From:", req.body.From);
  console.log("To:", req.body.To);
  console.log("Body:", req.body.Body);
  console.log("---------------------------------------");

  // Twilio expects a quick XML Response
  res.type("text/xml");
  res.send("<Response></Response>");
});

// --- Optional: simple GET for testing ---
app.get("/", (req, res) => {
  res.send("Twilio webhook running!");
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
