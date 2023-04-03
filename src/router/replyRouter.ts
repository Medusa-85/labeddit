import express from 'express'
import { ReplyBusiness } from '../business/ReplyBusiness'
import { ReplyController } from '../controller/ReplyController'
import { PostDatabase } from '../database/PostDatabase'
import { ReplyDatabase } from '../database/ReplyDatabase'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'


export const replyRouter = express.Router()

const replyController = new ReplyController (
    new ReplyBusiness (
        new PostDatabase(),
        new ReplyDatabase(),
        new IdGenerator(),
        new TokenManager
    )
)

replyRouter.post("/:id", replyController.createReply)
replyRouter.get("/:id", replyController.getReplies)