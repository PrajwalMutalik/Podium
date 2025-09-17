const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  console.log('\n--- NEW CONTACT FORM SUBMISSION ---');
  console.log('Received data:', { name, email });

  if (!name || !email || !message) {
    return res.status(400).json({ msg: 'Please fill out all fields.' });
  }

  try {
    console.log('Step 1: Creating Nodemailer transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('Step 2: Transporter created successfully.');

    const mailOptions = {
      from: `Podium App <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>You have a new message from the Podium contact form:</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };
    console.log('Step 3: Mail options prepared. Attempting to send email...');

    await transporter.sendMail(mailOptions);
    console.log('✅ Step 4: Email sent successfully!');

    res.status(200).json({ msg: 'Message sent successfully!' });
  } catch (err) {
    console.error('❌ ERROR SENDING EMAIL:', err); // Make the error log very obvious
    res.status(500).send('Server Error: Could not send email.');
  }
});

module.exports = router;
