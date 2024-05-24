import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import { createAccessToken } from '../jwt/jwt.js'
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).json({ message: 'The email is already in use' })

    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' })

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


export const verifyToken = async (req, res) => {

  let tokenUser = null
  const { token } = req.body
  /* console.log("REQ.BODY", req.body);
  console.log("REQ.BODY.TOKEN", req.body.token); */

  try {
    if (!token) return res.status(401).json({ message: 'No token, access denied' })

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        res.status(401).json({ message: 'Token is not valid' })
      } else {
        tokenUser = user
      }
    })

    const userFound = await User.findOne({ _id: tokenUser.id })
    // console.log("USERFOUND", userFound);
    res.status(200).json({
      id: userFound._id,
      userName: userFound.username,
      email: userFound.email
    })
  } catch (error) {
    console.log(error);
  }

}


// Solo para pruebas en el servidor, desde el cliente borrar las cookies del navegador
export const logout = async (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'Logout' })
}





export const profile = async (req, res) => {
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

