import { Request, Response } from "express";
import { ReplyBusiness } from "../business/ReplyBusiness";
import { LikeOrDislikeInputDTO } from "../dtos/likeDislikeDTO";
import { GetRepliesInputDTO } from "../dtos/replyPostDTO";

export class ReplyController {
    constructor(
        private replyBusiness: ReplyBusiness
    ){}
    public createReply = async (req: Request, res: Response) => {
        try{
            const input = {
                idToReply: req.params.id,
                token: req.headers.authorization,
                reply: req.body.reply
            }
            const output = await this.replyBusiness.createReply(input)
            res.status(201).send(output)

        } catch (error) {
            console.log(error)
    
            if(error instanceof Error) {
                res.status(500).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
    public getReplies = async (req: Request, res: Response) => {
        try{
            const input: GetRepliesInputDTO = {
                postId: req.params.id,
                token: req.headers.authorization
            }
            const output = await this.replyBusiness.getReplies(input)
            res.status(200).send(output)

        } catch (error) {
            console.log(error)
    
            if(error instanceof Error) {
                res.status(500).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
    public likeOrDislikeReply = async (req: Request, res: Response) => {
        try{
            const input: LikeOrDislikeInputDTO = {
                idToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }

            await this.replyBusiness.likeOrDislikePost(input)

            res.status(200).end()

        } catch(error) {
            console.log(error)
    
            if(error instanceof Error) {
                res.status(500).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            } 
        }

    }
}