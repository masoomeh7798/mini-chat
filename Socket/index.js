import { Server } from "socket.io";
import {createServer} from 'http'
import express from 'express'
import User from "../Models/UserMd.js";
import app from '../app.js'

const server=createServer(app)
const io=new Server(server,{
    cors:'*'
})

const onlineUsers={}

export const getSocketIds=(receiverIds)=>{
    const socketIds=[]
    for(let userId of receiverIds){
        if(onlineUsers[userId]){
            socketIds.push(onlineUsers[userId])
        }
    }
    return socketIds
}

io.on('connection',async(socket)=>{
    const userId=socket.handshake.query.userId
    if(userId!==undefined){
        onlineUsers[userId]=socket.id
    }
    const user=await User.findById(userId)
    if(!user)return
    const onlineMembers=user?.members?.map(e=>String(e)).filter(e=>onlineUsers[e] ? e :false)
    for(let member of onlineMembers){
        io.to(onlineUsers[member]).emit('newOnlineUser',userId)
    }
    io.to(socket.id).emit('myOnlineUsers',onlineMembers)


    socket.on('disconnect',()=>{
        delete onlineUsers[userId]
        const newOnlineMembers=user?.members?.map(e=>String(e))?.filter(e=>onlineUsers[e] ? e : false)
        for(let member of newOnlineMembers){
            
            io.to(onlineUsers[member]).emit('OfflineUser',userId)

        }
    })
})

export {io,server,app}