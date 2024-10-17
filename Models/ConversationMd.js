import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    file:String,
    content:String,
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
})

const conversationSchema=new mongoose.Schema({
    members:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    messages:{
        type:[messageSchema],
        default:[]
    },
},{timestamps:true})

const Conversation=mongoose.model('Conversation',conversationSchema)
export default Conversation