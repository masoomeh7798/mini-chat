import express from 'express'
import { auth, checkCode, sendCode } from '../Controllers/AuthCn.js'

const authRouter=express.Router()

authRouter.route('/').post(auth)
authRouter.route('/send-code').post(sendCode)
authRouter.route('/check-code').post(checkCode)

export default authRouter