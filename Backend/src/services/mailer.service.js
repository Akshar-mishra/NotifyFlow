import nodemailer from 'nodemailer'   

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})
transporter.verify((err, success) => {
  if (err) console.error("SMTP verify failed:", err)
  else console.log("SMTP server ready")
})

export const sendEmail = async (to, subject, body) => {
    try {
        const info = await transporter.sendMail({
            from: `"NotifyFlow" <${process.env.SMTP_USER}>`, // Sender address
            to: to,                                          // Receiver address
            subject: subject,                                // Subject line
            text: body                                       // Plain text body
        })   
        
        return info   
    } 
    catch (error) {
        console.error("Nodemailer Error:", error)   
        throw error  
    }
}   