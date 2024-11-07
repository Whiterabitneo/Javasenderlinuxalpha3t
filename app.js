// app.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, client-side JS)
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submission
app.post('/send-email', async (req, res) => {
    const { senderName, fromEmail, toEmail, subject, message } = req.body;

    // Nodemailer configuration
    let transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 587,
        secure: false, // TLS requires secure:false
        auth: {
            user: 'your-email@your-domain.com', // Your email address
            pass: 'your-email-password' // Your email password
        },
        debug: true, // Enable verbose logging
        logger: true // Log output, default is console
    });

    // Email options
    let mailOptions = {
        from: `${senderName} <${fromEmail}>`,
        bcc: toEmail.split(',').map(email => email.trim()), // Use bcc to hide recipients
        subject: subject,
        text: message // Plain text message
    };

    try {
        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response); // Log success message
        res.send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error); // Log error message
        res.status(500).send('Failed to send email. Error: ' + error.message);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
