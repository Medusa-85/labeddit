import { PostDatabase } from "../database/PostDatabase";
import { LikeOrDislikeInputDTO } from "../dtos/likeDislikeDTO";
import { CreatePostInputDTO, GetPostByIdInputDTO, GetPostInputDTO, GetPostOutputDTO } from "../dtos/postDTO";
import { ReplyPostInputDTO } from "../dtos/replyPostDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post } from "../models/Post";
import { Reply } from "../models/Reply";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { LikesDislikesDB, PostDB, PostWithCreatorDB, POST_LIKE_DISLIKE } from "../types";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}
    public getPost = async (input: GetPostInputDTO): Promise<GetPostOutputDTO> => {
        const { token } = input

        if(!token) {
            throw new BadRequestError("'token' precisa existir")
        }
        const payload = this.tokenManager.getPayload(token)
        if(payload === null){
            throw new BadRequestError("Token inválido")
        }
        const postsWithCreatorsDB: PostWithCreatorDB[] = await this.postDatabase.getPostsWithCreators()

        const posts = postsWithCreatorsDB.map(
            (postWithCreatorDB) => {
                const post = new Post(
                    postWithCreatorDB.id,
                    postWithCreatorDB.creator_id,
                    postWithCreatorDB.content,
                    postWithCreatorDB.likes,
                    postWithCreatorDB.dislikes,
                    postWithCreatorDB.created_at,
                    postWithCreatorDB.updated_at,
                    postWithCreatorDB.creator_name
                )

                return post.toBusinessModel()
            }
        )
        const output: GetPostOutputDTO = posts
        return output
    }

    public getPostById = async (input: GetPostByIdInputDTO): Promise<GetPostOutputDTO> => {
        const { postId, token } = input

        if(!token) {
            throw new BadRequestError("'token' precisa existir")
        }
        const payload = this.tokenManager.getPayload(token)
        if(payload === null){
            throw new BadRequestError("Token inválido")
        }
        const postsWithCreatorsDB: PostWithCreatorDB[] = await this.postDatabase.getPostsWithCreatorsById(postId)

        const posts = postsWithCreatorsDB.map(
            (postWithCreatorDB) => {
                const post = new Post(
                    postWithCreatorDB.id,
                    postWithCreatorDB.creator_id,
                    postWithCreatorDB.content,
                    postWithCreatorDB.likes,
                    postWithCreatorDB.dislikes,
                    postWithCreatorDB.created_at,
                    postWithCreatorDB.updated_at,
                    postWithCreatorDB.creator_name
                )

                return post.toBusinessModel()
            }
        )
        const output: GetPostOutputDTO = posts
        return output
    }

    // public getPostById = async (input: GetPostByIdInputDTO): Promise<void> => {
    //     const {postId, token} = input

    //     if(!token) {
    //         throw new BadRequestError("'token' precisa existir")
    //     }
    //     const payload = this.tokenManager.getPayload(token)
    //     if(payload === null){
    //         throw new BadRequestError("'token' inválido")
    //     }
    //     if(typeof postId !== "string"){
    //         throw new BadRequestError("'postId' precisa ser string")
    //     }

    //     const findPostById = await this.postDatabase.findPostWithCreatorById(postId)

    //     if(!findPostById) {
    //         throw new NotFoundError("'id' não encontrado")
    //     }
    //     console.log(`postId: ${postId}`)
    //     console.log(`findPostById: ${findPostById.content}`)

    //     const postById = new Post (
    //         findPostById.id,
    //         findPostById.creator_id,
    //         findPostById.content,
    //         findPostById.likes,
    //         findPostById.dislikes,
    //         findPostById.created_at,
    //         findPostById.updated_at,
    //         findPostById.creator_name
    //     )
    //     return postById
    // }

    public createPost = async (input: CreatePostInputDTO) => {
        const {token, content} = input

        if(!token) {
            throw new BadRequestError("'token' precisa existir")
        }   
        const payload = this.tokenManager.getPayload(token)
        if(payload === null) {
            throw new BadRequestError("Token inválido")
        }

        if(typeof content !== "string") {
            throw new BadRequestError("'content' precisa ser string")
        }

        const id = this.idGenerator.generate()
        const creatorId = payload.id
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()
        const creatorName = payload.name


        const post = new Post(
            id,
            creatorId,
            content,
            0,
            0,
            createdAt,
            updatedAt,
            creatorName
        )

        const postDB = post.toDBModel()

        await this.postDatabase.insert(postDB)
    }

    public likeOrDislikePost = async (input: LikeOrDislikeInputDTO): Promise<void> => {
        const {idToLikeOrDislike, token, like} = input

        if(!token) {
            throw new BadRequestError("'token' precisa existir")
        }
        const payload = this.tokenManager.getPayload(token)
        if(payload === null){
            throw new BadRequestError("'token' inválido")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' precisa ser booleano")
        }

        const postWithCreatorDB = await this.postDatabase.findPostWithCreatorById(idToLikeOrDislike)

        if(!postWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const userId = payload.id
        const likeConvertor = like ? 1 : 0

        const likeOrDislikeDB: LikesDislikesDB = {
            user_id: userId,
            post_id: postWithCreatorDB.id,
            like: likeConvertor
        }

        const verifyLikeDislike = await this.postDatabase.findLikeDislike(likeOrDislikeDB)

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.creator_name,
        )

        if(verifyLikeDislike === POST_LIKE_DISLIKE.ALREAD_LIKED) {
            if(like) {
                await this.postDatabase.removeLikeOrDislike(likeOrDislikeDB)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeOrDislike(likeOrDislikeDB)
                post.removeLike()
                post.addDislike()
            }
        } else if(verifyLikeDislike === POST_LIKE_DISLIKE.ALREAD_DISLIKED) {
            if(like) {
                await this.postDatabase.updateLikeOrDislike(likeOrDislikeDB)
                post.removeDislike()
                post.addLike()
            } else {
                await this.postDatabase.removeLikeOrDislike(likeOrDislikeDB)
                post.removeDislike()
            }
        } else {
            await this.postDatabase.likeOrDislikePost(likeOrDislikeDB)
            like ? post.addLike() : post.addDislike()
        }

        const updatedPost = post.toDBModel()

        await this.postDatabase.update(idToLikeOrDislike, updatedPost)

    }
    // public replyPost = async (input: ReplyPostInputDTO) => {
    //     const { idToReply, token, reply } = input

    //     if(!token) {
    //         throw new BadRequestError("'token' precisa existir")
    //     }
    //     const payload = this.tokenManager.getPayload(token)
    //     if(payload === null) {
    //         throw new BadRequestError("'token' inválido")
    //     }
    //     if(typeof reply !== "string") {
    //         throw new BadRequestError("'reply' precisa ser string")
    //     }
    //     const postWithCreatorDB = await this.postDatabase.findPostWithCreatorById(idToReply)
    //     if(!postWithCreatorDB) {
    //         throw new NotFoundError("'id' não encontrado")
    //     }

    //     const id = this.idGenerator.generate()
    //     const postId = postWithCreatorDB.id
    //     const creatorId = payload.id
    //     const creatorName = payload.name
    //     const createdAt = new Date().toISOString()

    //     const newReply = new Reply (
    //         id,
    //         postId,
    //         creatorId,
    //         0,
    //         0,
    //         createdAt,
    //         reply,
    //         creatorName
    //     )
    //     const replyDB = newReply.ReplyToDBModel()

    //     await this.postDatabase.insertReply(replyDB)

    // }
    

}