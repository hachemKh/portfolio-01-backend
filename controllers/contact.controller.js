import nodemailer from 'nodemailer'
import Contact from '../models/Contact.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// POST /api/contact — public
export const sendMessage = async (req, res) => {
  try {
      const { name, email, subject, message } = req.body
      if (!name || !email || !subject || !message)
        return res.status(400).json({ message: 'All fields are required' })

      const contact = await Contact.create({ name, email, subject, message })

      const info = await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.MY_EMAIL,
        subject: `[Portfolio] ${subject}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px">
            <h2 style="color:#7c6aff">New Portfolio Message</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr/>
            <p>${message.replace(/\n/g, '<br/>')}</p>
          </div>
        `,
      })

      console.log('✅ Email sent:', info.response)
      res.status(201).json({ message: 'Message sent successfully', id: contact._id })
    } catch (err) {
      console.log('❌ Email error:', err.message)
      res.status(500).json({ message: err.message })
    }
}

// GET /api/contact — admin only
export const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PATCH /api/contact/:id/read — admin only
export const markRead = async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    )
    if (!msg) return res.status(404).json({ message: 'Message not found' })
    res.json(msg)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/contact/:id — admin only
export const deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id)
    res.json({ message: 'Message deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
