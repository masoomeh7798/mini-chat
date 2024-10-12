import { Server } from "socket.io";
import {createServer} from 'http'
import express from 'express'

const app=express()
const server=createServer(app)
const io=new Server(server,{
    cors:'*'
})

const onlineUsers