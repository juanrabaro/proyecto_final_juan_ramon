import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export function createAccessToken(user) {
  return new Promise((resolve, reject) => {
    jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          reject(error)
        };
        resolve(token);
      })
  })
}