
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(__dirname)); // Serve frontend files

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-email', async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ success: false, message: 'Email and message required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
    subject: 'New Contact Submission',
    html: `<p><strong>From:</strong> ${email}</p><p>${message}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent.' });
  } catch (err) {
    console.error('Backend error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server live on http://localhost:${PORT}`);
});
