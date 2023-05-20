import { BaseDatabase } from "../../src/database/BaseDatabase"
import { GetPostOutputDTO } from "../../src/dtos/postDTO"
import { LikesDislikesDB, PostDB, PostWithCreatorDB, POST_LIKE_DISLIKE } from "../../src/types"

const postsMock: PostDB[] = [
    {
        id: "post-id-mock",
        creator_id: "creator-id-mock",
        content: "content-mock",
        likes: 0,
        dislikes: 0,
        replies: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
]

const postWithCreatorMock: PostWithCreatorDB = {
    id: "post-id-mock",
    creator_id: "creator-id-mock",
    content: "content-mock",
    likes: 0,
    dislikes: 0,
    replies: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_name: "creator-name-mock"
}

export const getPostOutputMock: GetPostOutputDTO = [
    {
        id: "post-id-mock",
        content: "content-mock",
        likes: 0,
        dislikes: 0,
        replies: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creator: {
            id: "creator-id-mock",
            name: "creator-name-mock"}
    }
]

const postsWithCreatorMock: PostWithCreatorDB []= [postWithCreatorMock]

const likeMock: LikesDislikesDB = {
    user_id: "user-id-mock",
    post_id: "post-id-like-mock",
    like: 1
    }

const dislikeMock: LikesDislikesDB = {
    user_id: "user-id-mock",
    post_id: "post-id-dislike-mock",
    like: 0
    }


export class PostDatabaseMock extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"
    public static TABLE_REPLY_POSTS = "reply_posts"

    public getPostsWithCreators = async (): Promise<PostWithCreatorDB[]> => {
        return postsWithCreatorMock
    }

    public insert = async (postDB: PostDB): Promise<void> => {
       
    }

    public findById = async (id: string): Promise<PostDB | undefined> => {
        if(id) {
            return postsMock.filter(post => post.id === id)[0]
        } 
    }

    public findPostWithCreatorById = async (postId: string): Promise<PostWithCreatorDB | undefined> => {
        if(postId) {
            return postsWithCreatorMock.filter(post => post.id === postId)[0]
        }
    }

    public findLikeDislike = async (likeOrDislikeDBToFind: LikesDislikesDB
        ): Promise<POST_LIKE_DISLIKE | null> => {
            if(likeOrDislikeDBToFind == likeMock) {
                return POST_LIKE_DISLIKE.ALREADY_LIKED
            } else if(likeOrDislikeDBToFind == dislikeMock) {
                return POST_LIKE_DISLIKE.ALREADY_DISLIKED
            } else {
                return null
            }
    }

    public removeLikeOrDislike = async (likeOrDislikeDB: LikesDislikesDB): Promise<void> => {
       
    }

    public updateLikeOrDislike = async (likeOrDislikeDB: LikesDislikesDB): Promise<void> => {
     
    }
    
    public likeOrDislikePost = async (likeOrDislike: LikesDislikesDB): Promise<void> => {
        
    }

    public update = async (idToEdit: string, postDB: PostDB): Promise<void> => {
        
    }

    public getPostsWithCreatorsById = async (postId: string): Promise<PostWithCreatorDB[]> => {
        return postsWithCreatorMock.filter(post => post.id === postId)
    }
}