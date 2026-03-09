import Project from '../models/Project.js'
import Contact from '../models/Contact.js'

// GET /api/stats — admin only
export const getStats = async (req, res) => {
  try {
    const [totalProjects, totalMessages, unreadMessages, categories, featured] = await Promise.all([
      Project.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ read: false }),
      Project.distinct('category'),
      Project.countDocuments({ featured: true }),
    ])

    // Recent messages
    const recentMessages = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject read createdAt')

    // Recent projects
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title category createdAt images')

    res.json({
      totalProjects,
      totalMessages,
      unreadMessages,
      totalCategories: categories.length,
      featuredProjects: featured,
      recentMessages,
      recentProjects,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
