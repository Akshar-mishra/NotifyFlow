import nodemailer from 'nodemailer'   

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
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