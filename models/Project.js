import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  category:    { type: String, required: true },
  techStack:   [{ type: String }],
  images:      [{ url: String, publicId: String }],
  liveUrl:     { type: String, default: '' },
  githubUrl:   { type: String, default: '' },
  featured:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Project', projectSchema)
