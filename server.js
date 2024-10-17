import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { server } from './Socket/index.js'
dotenv.config({path:'./config.env'})
const PORT=process.env.PORT || 5001

mongoose.connect(process.env.DATA_BASE_URL).then(()=>{
        console.log('db is connected');
}
).catch(()=>{
    console.log('db is not connected');
}
)

server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})