import { Post } from "../models/Post";
import { LikesDislikesDB, PostDB, PostWithCreatorDB, POST_LIKE_DISLIKE, ReplyDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"
    public static TABLE_REPLY_POSTS = "reply_posts"

    public getPostsWithCreators = async (): Promise<PostWithCreatorDB[]> => {
        const result: PostWithCreatorDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .select(
            "posts.id",
            "posts.creator_id",
            "posts.content",
            "posts.likes",
            "posts.dislikes",
            "posts.replies",
            "posts.created_at",
            "posts.updated_at",
            "users.name as creator_name"
        )
        .join("users", "posts.creator_id", "=", "users.id")

        return result
    }

    public insert = async (postDB: PostDB): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .insert(postDB)
    }

    public findById = async (id: string): Promise<PostDB | undefined> => {
        const result: PostDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .select()
        .where({id})

        return result[0]
    }

    public findPostWithCreatorById = async (postId: string): Promise<PostWithCreatorDB | undefined> => {
        const result: PostWithCreatorDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .select(
            "posts.id",
            "posts.creator_id",
            "posts.content",
            "posts.likes",
            "posts.dislikes",
            "posts.replies",
            "posts.created_at",
            "posts.updated_at",
            "users.name"
        )
        .join("users", "posts.creator_id", "=", "users.id")
        .where("posts.id", postId)

        return result[0]
    }

    public findLikeDislike = async (likeOrDislikeDBToFind: LikesDislikesDB
        ): Promise<POST_LIKE_DISLIKE | null> => {
            const [likeDislikeDB]: LikesDislikesDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
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
        await BaseDatabase
        .connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .delete()
        .where({
            user_id: likeOrDislikeDB.user_id,
            post_id: likeOrDislikeDB.post_id
        })
    }

    public updateLikeOrDislike = async (likeOrDislikeDB: LikesDislikesDB) => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .update(likeOrDislikeDB)
        .where({
            user_id: likeOrDislikeDB.user_id,
            post_id: likeOrDislikeDB.post_id
        })
    }
    
    public likeOrDislikePost = async (likeOrDislike: LikesDislikesDB): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .insert(likeOrDislike)
    }

    public update = async (idToEdit: string, postDB: PostDB): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .update(postDB)
        .where({ id: idToEdit})
    }

    public getPostsWithCreatorsById = async (postId: string): Promise<PostWithCreatorDB[]> => {
        const result: PostWithCreatorDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .select(
            "posts.id",
            "posts.creator_id",
            "posts.content",
            "posts.likes",
            "posts.dislikes",
            "posts.replies",
            "posts.created_at",
            "posts.updated_at",
            "users.name as creator_name"
        )
        .join("users", "posts.creator_id", "=", "users.id")
        .where("posts.id", postId)

        return result
    }
}