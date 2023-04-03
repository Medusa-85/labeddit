import { GetRepliesInputDTO, GetRepliesOutputDTO, ReplyPostInputDTO } from "../dtos/replyPostDTO";
import { PostDatabase } from "../database/PostDatabase";
import { BadRequestError } from "../errors/BadRequestError";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { NotFoundError } from "../errors/NotFoundError";
import { Reply } from "../models/Reply";
import { ReplyDatabase } from "../database/ReplyDatabase";
import { ReplyWithCreatorDB } from "../types";

export class ReplyBusiness {
    constructor (
        private postDatabase: PostDatabase,
        private replyDatabase: ReplyDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}
    public createReply = async (input: ReplyPostInputDTO) => {
        const { idToReply, token, reply } = input

        if(!token) {
            throw new BadRequestError("'token' precisa existir")
        }
        const payload = this.tokenManager.getPayload(token)
        if(payload === null) {
            throw new BadRequestError("'token' inválido")
        }
        if(typeof reply !== "string"){
            throw new BadRequestError("'reply' deve ser string")
        }

        const postWithCreatorDB = await this.postDatabase.findPostWithCreatorById(idToReply)
        if(!postWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const id = this.idGenerator.generate()
        const postId = postWithCreatorDB.id
        const creatorId = payload.id
        const createdAt = new Date().toISOString()
        const creatorName = payload.name

        const newReply = new Reply (
            id,
            postId,
            creatorId,
            0,
            0,
            createdAt,
            reply,
            creatorName
        )
        const newReplyDB = newReply.ReplyToDBModel()
        await this.replyDatabase.insertReply(newReplyDB)
    }
    public getReplies = async (input: GetRepliesInputDTO): Promise<GetRepliesOutputDTO> => {
        const { postId, token } = input
        
        if(!token) {
            throw new BadRequestError("'token' precisa existir")
        }
        const payload = this.tokenManager.getPayload(token)
        if(payload === null) {
            throw new BadRequestError("'token' inválido")
        }
        const repliesWithCreatorsDB: ReplyWithCreatorDB[] = await this.replyDatabase.getRepliesWithCreatorsById(postId) 
        
        const replies = repliesWithCreatorsDB.map(
            (replyWithCreatorDB) => {
                const reply = new Reply (
                    replyWithCreatorDB.id,
                    replyWithCreatorDB.post_id,
                    replyWithCreatorDB.creator_id,
                    replyWithCreatorDB.likes,
                    replyWithCreatorDB.dislikes,
                    replyWithCreatorDB.created_at,
                    replyWithCreatorDB.reply,
                    replyWithCreatorDB.creator_name
                )
                return reply.ReplyToBusinessModel()
        })
        const output: GetRepliesOutputDTO = replies
        return output
     }
}