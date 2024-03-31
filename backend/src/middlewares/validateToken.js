import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

export const validateToken = async (req, res, next) => {

  //console.log(req.headers.authorization);
  //console.log(req.cookies.token);
  const { token } = req.cookies

  if (!token) return res.status(401).json({ message: 'No token, access denied' })

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    (err) ? res.status(401).json({ message: 'Token is not valid' }) : req.user = user
  })

  next()
}