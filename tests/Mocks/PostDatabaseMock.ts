import { BaseDatabase } from "../../src/database/BaseDatabase"
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

const postWithCreatorMock: PostWithCreatorDB []= [
    {
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
]

const likeDislikeMock: LikesDislikesDB[] = [
    {
    user_id: "user-id-mock",
    post_id: "post-id-mock",
    like: 0
    }
]

export class PostDatabaseMock extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"
    public static TABLE_REPLY_POSTS = "reply_posts"

    public getPostsWithCreators = async (): Promise<PostWithCreatorDB[]> => {
        return postWithCreatorMock
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
            return postWithCreatorMock.filter(post => post.id === postId)[0]
        }
    }

    public findLikeDislike = async (likeOrDislikeDBToFind: LikesDislikesDB
        ): Promise<POST_LIKE_DISLIKE | null> => {
            const [likeDislikeDB]: LikesDislikesDB[] = await BaseDatabase
            .connection(PostDatabaseMock.TABLE_LIKES_DISLIKES)
            .select()
            .where({
                user_id: likeOrDislikeDBToFind.user_id,
                post_id: likeOrDislikeDBToFind.post_id
            })

            if(likeDislikeDB) {
                return likeDislikeDB.like === 1
                ? POST_LIKE_DISLIKE.ALREAD_LIKED
                : POST_LIKE_DISLIKE.ALREAD_DISLIKED
            } else {
                return null
            }
    }

    public removeLikeOrDislike = async (likeOrDislikeDB: LikesDislikesDB): Promise<void> => {
       
    }

    public updateLikeOrDislike = async (likeOrDislikeDB: LikesDislikesDB) => {
        return likeDislikeMock
    }
    
    public likeOrDislikePost = async (likeOrDislike: LikesDislikesDB): Promise<void> => {
        
    }

    public update = async (idToEdit: string, postDB: PostDB): Promise<void> => {
        
    }

    public getPostsWithCreatorsById = async (postId: string): Promise<PostWithCreatorDB[] | undefined> => {
        if(postId) {
            return postWithCreatorMock.filter(post => post.id === postId)
        }
    }
}