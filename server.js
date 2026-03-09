import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes    from './routes/auth.routes.js'
import projectRoutes from './routes/project.routes.js'
import contactRoutes from './routes/contact.routes.js'
import statsRoutes   from './routes/stats.routes.js'

connectDB()

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth',     authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/contact',  contactRoutes)
app.use('/api/stats',    statsRoutes)

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

// 404
app.use((_, res) => res.status(404).json({ message: 'Route not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})


app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large! Max 20MB per image.' })
  }
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
