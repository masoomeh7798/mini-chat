import express from 'express'
import catchError from "./Utils/catchError.js"
import handleError from './Utils/handleError.js'
import cors from 'cors'
import {fileURLToPath} from 'url'
import path from 'path'
import uploadRouter from './Routes/Upload.js'
import authRouter from './Routes/Auth.js'


const __filename=fileURLToPath(import.meta.url)
export const __dirname=path.dirname(__filename)

const app=express()
app.use(cors())
app.use(express.static('Public'))
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/auth',authRouter) 
app.use((req,res)=>{
    try {
        const {id:userId} = jwt.verify(req?.headers?.authorization?.split(' ')[1], process.env.JWT_SECRET)
        req.userId=userId
        return next()
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'You dont have permission'
        })
    }
})
app.use('/api/upload',uploadRouter)


app.use('*',(req,res,next)=>{
    return next(new handleError('Route not found',401))
})
app.use(catchError)
export default app