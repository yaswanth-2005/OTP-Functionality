const express = require('express')
const bp = require('body-parser')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const cors = require('cors')

const app = express()
app.use(bp.json())
dotenv.config();
app.use(cors())

const otps = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASSWORD,
    }
})

console.log('Email', process.env.EMAIL_USER)

app.post('/sendOtp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required.." })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = Date.now + 5 * 60 * 1000;

    otps[email] = { otp, expiryTime }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Email',
        text: `Your OTP is ${otp}`
    }

    try {
        await transporter.sendMail(mailOptions)
        res.json({ message: "OTP Sent Successfully.." })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error Sending the OTP', error })
    }

})

app.post('/verifyOtp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" })
    }

    const storedOtpDetails = otps[email]

    if (!storedOtpDetails) {
        return res.status(400).json({ message: "Invalid OTP or OTP Expired.." })
    }

    const { otp: storedOtp, expiryTime } = storedOtpDetails

    if (Date.now() > expiryTime) {
        delete otps[email]
        return res.status(400).json({ message: "OTP expired.." })
    }

    if (otp !== storedOtp) {
        return res.status(400).json({ message: "Invalid OTP" })
    }

    delete otps[email]
    res.json({ message: "OTP Verified Successfully.." })

})

app.listen(3000, () => console.log("Server Started at port 3000"))