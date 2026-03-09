import Project from '../models/Project.js'
import { cloudinary } from '../middleware/upload.middleware.js'

// GET /api/projects — public
export const getProjects = async (req, res) => {
  try {
    const { category } = req.query
    const filter = category && category !== 'All' ? { category } : {}
    const projects = await Project.find(filter).sort({ featured: -1, order: 1, createdAt: -1 })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/projects/categories — public
export const getCategories = async (req, res) => {
  try {
    const categories = await Project.distinct('category')
    res.json(['All', ...categories])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/projects/:id — public
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json(project)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/projects — admin only
export const createProject = async (req, res) => {
  try {
    const { title, description, longDescription, category, techStack, liveUrl, githubUrl, featured, order } = req.body

    const images = req.files?.map(file => ({
      url: file.path,
      publicId: file.filename,
    })) || []

    const project = await Project.create({
      title,
      description,
      longDescription,
      category,
      techStack: typeof techStack === 'string'
        ? techStack.split(',').map(t => t.trim()).filter(Boolean)
        : techStack,
      images,
      liveUrl,
      githubUrl,
      featured: featured === 'true' || featured === true,
      order: Number(order) || 0,
    })

    res.status(201).json(project)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/projects/:id — admin only
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })

    const { title, description, longDescription, category, techStack, liveUrl, githubUrl, featured, order, removeImages } = req.body

    // Handle image removals
    if (removeImages) {
      const toRemove = typeof removeImages === 'string' ? JSON.parse(removeImages) : removeImages
      for (const publicId of toRemove) {
        await cloudinary.uploader.destroy(publicId)
      }
      project.images = project.images.filter(img => !toRemove.includes(img.publicId))
    }

    // Add new images
    if (req.files?.length) {
      const newImages = req.files.map(file => ({ url: file.path, publicId: file.filename }))
      project.images.push(...newImages)
    }

    project.title           = title ?? project.title
    project.description     = description ?? project.description
    project.longDescription = longDescription ?? project.longDescription
    project.category        = category ?? project.category
    project.techStack       = techStack
      ? techStack.split(',').map(t => t.trim()).filter(Boolean)
      : project.techStack
    project.liveUrl         = liveUrl ?? project.liveUrl
    project.githubUrl       = githubUrl ?? project.githubUrl
    project.featured        = featured !== undefined ? (featured === 'true' || featured === true) : project.featured
    project.order           = order !== undefined ? Number(order) : project.order

    await project.save()
    res.json(project)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/projects/:id — admin only
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })

    // Delete all images from Cloudinary
    for (const img of project.images) {
      if (img.publicId) await cloudinary.uploader.destroy(img.publicId)
    }

    await project.deleteOne()
    res.json({ message: 'Project deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
