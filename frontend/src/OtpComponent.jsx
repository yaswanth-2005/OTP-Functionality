import React, { useState } from 'react'
import { ToastContainer, Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const OtpComponent = () => {

    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [message, setMessage] = useState('')
    const [isOtpSent, setIsOtpSent] = useState(false)

    const handleSendOtp = async () => {
        try {
            if (!email) {
                toast.error("Email is required..")
            }
            const response = await axios.post('http://localhost:3000/sendOtp', { email })
            setMessage(response.data.message)
            toast.success("OTP Sent Successfully..")
            setIsOtpSent(true)

        } catch (error) {
            console.error(error)
            setMessage(error.response?.data?.message || "Error sending the OTP")
            // toast.error("Error sending the OTP")
        }
    }

    const handleverifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:3000/verifyOtp', { email, otp })
            toast.success("OTP Verified Successfully..")
            setMessage(response.data.message)
        } catch (error) {
            setMessage(error.response?.data?.message || "Error verifying the OTP")
            toast.error("Error verifying the OTP")
        }
    }

    return (
        <>
            <h1>OTP Verfication</h1>
            {!isOtpSent ?
                <>
                    <input style={{ padding: "20px", borderRadius: "10px" }} type="text" value={email} placeholder='Enter Email ID..' onChange={(e) => setEmail(e.target.value)} /> <br /><br />
                    <button onClick={handleSendOtp}>Send OTP</button>
                </>
                :
                <>
                    <input style={{ padding: "20px", borderRadius: "10px" }} type="text" value={otp} placeholder='Enter OTP' onChange={(e) => setOtp(e.target.value)} /> <br /> <br />
                    <button onClick={handleverifyOtp}>Verify OTP</button>
                </>}


            <ToastContainer position='top-center' transition={Zoom} style={{ width: "250px" }} />
            {message ?
                <h4>Message:{message}</h4>
                : ""
            }
        </>
    )
}

export default OtpComponent
