import express from "express"
import { create, remove } from "../Controllers/ConversationCn.js"

const conversationRouter=express.Router()
conversationRouter.route('/').post(create).delete(remove)

export default conversationRouter