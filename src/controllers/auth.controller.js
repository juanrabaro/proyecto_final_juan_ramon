import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import { createAccessToken } from '../libs/jwt.js'
import { TOKEN_SECRET } from '../config.js'

export const register = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).json({ message: 'The email is already in use' })

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = new User({ username, email, password: passwordHash })
    const savedUser = await newUser.save()

    const accessToken = await createAccessToken({ id: savedUser._id })

    res.cookie('token', accessToken)
    res.status(200).json({
      id: savedUser._id,
      userName: savedUser.username,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const userFound = await User.findOne({ email })
    if (!userFound) return res.status(400).json({ message: 'The user not exist' })
    
    const isMatch = await bcrypt.compare(password, userFound.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' })
    }

    const accessToken = await createAccessToken({ id: userFound._id })

    res.cookie('token', accessToken)
    res.status(200).json({
      id: userFound._id,
      userName: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const profile = async (req, res) => {
  const { email, password } = req.body

  try {
    const userFound = await User.findOne({ email })
    
    if (!userFound) return res.status(400).json({ message: 'The user not exist' })
    if (userFound.password !== password) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    res.status(200).json(userFound)
    
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}