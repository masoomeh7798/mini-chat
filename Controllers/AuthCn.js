import User from '../Models/UserMd.js'
import catchAsync from '../Utils/catchAsync.js'
import handleError from '../Utils/handleError.js'
import { sendAuthCode, verifyCode } from '../Utils/smsHandler.js'
import jwt from 'jsonwebtoken'


export const auth = catchAsync(async (req, res, next) => {
    const { phone = null } = req?.body
    if (!phone) {
        return next(new handleError('email or phone is required', 400))
    }
    const otp = sendAuthCode(phone)
    if (otp.success) {
        return res.status(200).json({
            success: true,
            data: { phone },
            message: 'code sent'
        })
    } else {
        return res.status(400).json({
            success: false,
            data: { phone },
            message: 'sth went wrong. Try again'
        })
    }


})




export const checkCode = catchAsync(async (req, res, next) => {
    const { phone = null, code = null } = req?.body
    if (!code || !phone) {
        return next(new handleError('code is required', 400))
    }
    const otp = verifyCode(phone, code)
    if (!otp.success) {
        return next(new handleError('code is incorrect', 400))
    }
    const user = await User.findOne({ phone })
    if (user) {
        const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET)
        return res.status(200).json({
            success: true,
            data: {
                token,
                user: {
                    fullName: user?.fullName,
                    id: user._id,
                }
            }
        })
    } else {
        const newUser = await User.create({ phone })
        const token = jwt.sign({ id: newUser?._id }, process.env.JWT_SECRET)
        return res.status(200).json({
            success: true,
            data: {
                token,
                user: {
                    fullName: newUser?.fullName,
                    id: newUser._id,
                }
            }
        })
    }

})

export const sendCode = catchAsync(async (req, res, next) => {
    const { phone = null } = req?.body
    if (!phone) {
        return next(new handleError('phone is required', 400))
    }
    const otp = sendAuthCode(phone)
    if (!otp.success) {
        return next(new handleError('sth went wrong', 400))
    }
    return res.status(200).json({
        success: true,
        message: 'message sent'
    })

})