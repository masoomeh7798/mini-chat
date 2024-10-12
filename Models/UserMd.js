import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    phone:{
        type:Number,
        match:[
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g,
            "phone number incorrect",
          ],
        required:[true,'Phone number is required'],
        unique:[true,'Phone should be unique']
    },
    fullName:{
        type:String,
    },
    username:{
        type:String,
        unique:[true,'Username should be unique']
    },
    bio:{
        type:String
    },
    members:{
        type:Array,
        default:[]
    },
    avatar:{
        type:String
    }

},{timestamps:true})

const User=mongoose.model('User',userSchema)
export default User