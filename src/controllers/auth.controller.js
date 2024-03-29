import User from '../models/user.model.js'

export const register = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).json({ message: 'The email is already in use' })

    const newUser = new User({ username, email, password })
    const savedUser = await newUser.save()

    res.status(201).json(savedUser)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}