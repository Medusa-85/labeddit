import { GetRepliesInputDTO, GetRepliesOutputDTO, ReplyPostInputDTO } from "../dtos/replyPostDTO";
import { PostDatabase } from "../database/PostDatabase";
import { BadRequestError } from "../errors/BadRequestError";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { NotFoundError } from "../errors/NotFoundError";
import { Reply } from "../models/Reply";
import { ReplyDatabase } from "../database/ReplyDatabase";
import { ReplyLikesDislikesDB, ReplyWithCreatorDB, REPLY_LIKE_DISLIKE } from "../types";
import { LikeOrDislikeInputDTO } from "../dtos/likeDislikeDTO";
import { replyRouter } from "../router/replyRouter";
import { Post } from "../models/Post";

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

        const updatedPost = new Post (
            postWithCreatorDB.id,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.replies,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.creator_name
        )

        updatedPost.addReplies()
        const updatedPostDB = updatedPost.toDBModel()
        await this.postDatabase.update(idToReply, updatedPostDB)
        

        console.log(updatedPost)


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
    public likeOrDislikePost = async (input: LikeOrDislikeInputDTO): Promise<void> => {
        const { idToLikeOrDislike, token, like } = input
        
        if(!token) {
            throw new BadRequestError("'token' precisa existir")
        }
        const payload = this.tokenManager.getPayload(token)
        if(payload === null) {
            throw new BadRequestError("'token' inválido")
        }
        if(typeof like !== "boolean") {
            throw new BadRequestError("'like' precisa ser booleano")
        }
        const replyWithCreatorDB = await this.replyDatabase.findReplyWhitCreatorDB(idToLikeOrDislike)
        if (!replyWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const userId = payload.id
        const likeConvertor = like ? 1 : 0

        const replyLikeOrDislikeDB: ReplyLikesDislikesDB = {
            user_id: userId,
            reply_id: replyWithCreatorDB.id,
            like: likeConvertor
        }

        const verifyLikeDislike = await this.replyDatabase.findLikeDislike(replyLikeOrDislikeDB)

        const reply = new Reply (
            replyWithCreatorDB.id,
            replyWithCreatorDB.post_id,
            replyWithCreatorDB.creator_id,
            replyWithCreatorDB.likes,
            replyWithCreatorDB.dislikes,
            replyWithCreatorDB.created_at,
            replyWithCreatorDB.reply,
            replyWithCreatorDB.creator_name,
        )
        if(verifyLikeDislike === REPLY_LIKE_DISLIKE.ALREADY_LIKED) {
            if(like) {
                await this.replyDatabase.removeLikeOrDislike(replyLikeOrDislikeDB)
                reply.removeLike()
            } else {
                await this.replyDatabase.updateLikeOrDislike(replyLikeOrDislikeDB)
                reply.removeLike()
                reply.addDislike()
            }
        } else if(verifyLikeDislike === REPLY_LIKE_DISLIKE.ALREADY_DISLIKED) {
            if(like) {
                await this.replyDatabase.updateLikeOrDislike(replyLikeOrDislikeDB)
                reply.removeDislike()
                reply.addLike()
            } else {
                await this.replyDatabase.removeLikeOrDislike(replyLikeOrDislikeDB)
                reply.removeDislike()
            }
        } else {
            await this.replyDatabase.likeOrDislikeReply(replyLikeOrDislikeDB)
            like ? reply.addLike() : reply.addDislike()
        }

        const updateReply = reply.ReplyToDBModel()

        await this.replyDatabase.update(idToLikeOrDislike, updateReply)
    }
}