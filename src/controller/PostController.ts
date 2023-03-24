import { Request, Response } from "express";
import { knex } from 'knex'
import { PostBusiness } from "../business/PostBusiness";
import { LikeOrDislikeInputDTO } from "../dtos/likeDislikeDTO";
import { CreatePostInputDTO, GetPostInputDTO } from "../dtos/postDTO";
import { ReplyPostInputDTO } from "../dtos/replyPostDTO";


export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ){}
    public getPost = async (req: Request, res: Response) => {
        try{
            const input: GetPostInputDTO = {
                token: req.headers.authorization
            }
            const output = await this.postBusiness.getPost(input)

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
    public createPost = async (req: Request, res: Response) => {
        try{
            const input: CreatePostInputDTO = {
                token: req.headers.authorization,
                content: req.body.content
            }
            const output = await this.postBusiness.createPost(input)
            console.log(input)

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
    public likeOrDislikePost = async (req: Request, res: Response) => {
        console.log(`likeOrDislikePost: Request ${req.params}, Response ${res}`)
        console.dir(req.params)
        try{
            const input: LikeOrDislikeInputDTO = {
                idToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }

            await this.postBusiness.likeOrDislikePost(input)

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
    public replyPost = async (req: Request, res: Response) => {

        try{
            const input: ReplyPostInputDTO = {
                idToReply: req.params.id,
                token: req.headers.authorization,
                reply: req.body.reply
            }
            const output = await this.postBusiness.replyPost(input)
            
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

}