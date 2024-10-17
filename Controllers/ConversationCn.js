import catchAsync from "../Utils/catchAsync.js";
import handleError from "../Utils/handleError.js"
import Conversation from "../Models/ConversationMd.js"
import User from "../Models/UserMd.js";
import {io,getSocketIds} from "../Socket/index.js"


export const create=catchAsync(async(req,res,next)=>{
    const id=req?.userId
    const {targetId=null,message=null}=req?.body
    await User.findByIdAndUpdate(id,{$push:{members:targetId}})
    await User.findByIdAndUpdate(targetId,{$push:{members:id}})
    if(!targetId || !message){
        return next(new handleError('Bad request',404))
    }
    const conversation=await Conversation.create({members:[id,targetId],messages:[message]})
    const socketId=getSocketIds([targetId]).length > 0 ?getSocketIds([targetId])[0] : null
    if(socketId){
        io.to(socketId).emit('newConversation',JSON.stringify(conversation))
    }
    return res.status(201).json({
        success:true,
        data:conversation,
        message:'Conversation successfully created'
    })
})


export const remove=catchAsync(async(req,res,next)=>{
    const id=req.userId
    const {conversationId=null}=req?.body
    if(!conversationId){
        return next(new handleError('bad request',400))
    }
    const conversation=await Conversation.findById(conversationId)
    if(!conversation?.members?.includes(id)){
        return next(new handleError('You do not have permission',401))
    }
    const targetId=conversation?.members?.filter(e=>e!=id)[0]
    await Conversation.findByIdAndDelete(conversationId)
    await User.findByIdAndUpdate(id,{$pull:{members:String(targetId)}})
    await User.findByIdAndUpdate(targetId,{$pull:{members:id}})
    const socketId=getSocketIds([targetId]).length>0 ? getSocketIds([targetId])[0]:null
    if(!socketId){
        io.to(socketId).emit('removeConversation',conversation._id)
    }
    return res.status(201).json({
        success:true
    })
})