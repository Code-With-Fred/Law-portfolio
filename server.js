// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// Setup the Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address from .env
    pass: process.env.EMAIL_PASS, // Your email password from .env
  },
});

// Route to handle form submission and send email
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  // Setup email options
  const mailOptions = {
    from:"ezefavourchimereze@gmail.com", // The user's email address
    to: process.env.EMAIL_USER, // Your email address to receive the message
    subject: `Contact form submission from ${name}`,
    text: `You have a new message from ${name} (${email}):\n\n${message}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Failed to send email', error });
    }
    return res.status(200).json({ message: 'Email sent successfully', info });
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
