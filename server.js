const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post("/send-sos", async (req, res) => {
  const { message, location, contacts } = req.body;

  if (!contacts || contacts.length === 0) {
    return res.status(400).json({ success: false, error: "No contacts provided" });
  }

  const fullMessage = `${message}\nMy Location: ${location}`;

  try {
    for (const number of contacts) {
      await client.messages.create({
        body: fullMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: number
      });
    }
    res.status(200).json({ success: true, message: "SOS sent to all contacts" });
  } catch (error) {
    console.error("Twilio error:", error);
    res.status(500).json({ success: false, error: "Failed to send SMS" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
