const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (user, token) => {
    const url = `http://localhost:4000/api/auth/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verify Your Email',
        html: `<p>Please click the link below to verify your email:</p><p><a href="${url}">${url}</a></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent');
    } catch (error) {
        console.error('Failed to send verification email:', error);
    }
};


const generateEmailToken = (user) => {
    const payload = { user: { id: user.id } };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};


module.exports = { sendVerificationEmail, generateEmailToken };
