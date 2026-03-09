import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.js'

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL })
  if (existing) {
    console.log('Admin already exists:', existing.email)
    process.exit(0)
  }

  const admin = await User.create({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  })

  console.log('✅ Admin created:', admin.email)
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
