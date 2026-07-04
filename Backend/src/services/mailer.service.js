import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (to, subject, body) => {
  try {
    const info = await resend.emails.send({
      from: 'NotifyFlow <onboarding@resend.dev>',
      to,
      subject,
      text: body
    })
    return info
  } 
  catch (error) {
    console.error("Resend Error:", error)
    throw error
  }
}