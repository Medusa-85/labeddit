import { LikesDislikesDB, PostWithCreatorDB, ReplyDB, ReplyLikesDislikesDB, ReplyWithCreatorDB, REPLY_LIKE_DISLIKE } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class ReplyDatabase extends BaseDatabase {
    public static TABLE_REPLY_POST = "reply_posts"
    public static TABLE_REPLY_LIKES_DISLIKES = "reply_likes_dislikes"

    public insertReply = async (replyDB: ReplyDB): Promise<void> => {
        await BaseDatabase
        .connection(ReplyDatabase.TABLE_REPLY_POST)
        .insert(replyDB)
    }
    public getRepliesWithCreatorsById = async (postId: string): Promise<ReplyWithCreatorDB[]> => {
        const result: ReplyWithCreatorDB[] = await BaseDatabase
        .connection(ReplyDatabase.TABLE_REPLY_POST)
        .select(
            "reply_posts.id",
            "reply_posts.creator_id",
            "reply_posts.post_id",
            "reply_posts.likes",
            "reply_posts.dislikes",
            "reply_posts.created_at",
            "reply_posts.reply",
            "users.name as creator_name"
        )
        .join("users", "reply_posts.creator_id", "=", "users.id")
        .where("reply_posts.post_id", postId)

        return result
    } 
    public findReplyWhitCreatorDB = async (postId: string): Promise<ReplyWithCreatorDB | undefined> => {
        const result: ReplyWithCreatorDB[] = await BaseDatabase
        .connection(ReplyDatabase.TABLE_REPLY_POST)
        .select(
            "reply_posts.id",
            "reply_posts.creator_id",
            "reply_posts.post_id",
            "reply_posts.likes",
            "reply_posts.dislikes",
            "reply_posts.created_at",
            "reply_posts.reply",
            "users.name"
        )
        .join("users", "reply_posts.creator_id", "users.id")
        .where("reply_posts.id", postId)

        return result[0]
    }
    public findLikeDislike = async (likeOrDislikeDBToFind: ReplyLikesDislikesDB): Promise<REPLY_LIKE_DISLIKE | null> => {
        const [likeDislikeDB]: LikesDislikesDB[] = await BaseDatabase
        .connection(ReplyDatabase.TABLE_REPLY_LIKES_DISLIKES)
        .select()
        .where({
            user_id: likeOrDislikeDBToFind.user_id,
            reply_id: likeOrDislikeDBToFind.reply_id
        })

        if(likeDislikeDB) {
            return  likeDislikeDB.like === 1 
            ? REPLY_LIKE_DISLIKE.ALREADY_LIKED
            : REPLY_LIKE_DISLIKE.ALREADY_DISLIKED
        } else {
            return null
        }
    }
    public updateLikeOrDislike = async (replyLikeOrDislikeDB: ReplyLikesDislikesDB) => {
        await BaseDatabase
        .connection(ReplyDatabase.TABLE_REPLY_LIKES_DISLIKES)
        .update(replyLikeOrDislikeDB)
        .where({
            user_id: replyLikeOrDislikeDB.user_id,
            reply_id: replyLikeOrDislikeDB.reply_id
        })
    }
    public removeLikeOrDislike = async (replyLikeOrDislikeDB: ReplyLikesDislikesDB): Promise<void> => {
        await BaseDatabase
        .connection(ReplyDatabase.TABLE_REPLY_LIKES_DISLIKES)
        .delete()
        .where({
            user_id: replyLikeOrDislikeDB.user_id,
            reply_id: replyLikeOrDislikeDB.reply_id
        })
    }
    public likeOrDislikeReply =async (replyLikeOrDislikeDB: ReplyLikesDislikesDB): Promise<void> => {
        await BaseDatabase
        .connection(ReplyDatabase.TABLE_REPLY_LIKES_DISLIKES)
        .insert(replyLikeOrDislikeDB)
    }
    public update = async (idToUpdate: string, replyDB: ReplyDB): Promise<void> => {
        await BaseDatabase
        .connection(ReplyDatabase.TABLE_REPLY_POST)
        .update(replyDB)
        .where({
            id: idToUpdate
        })
    }
}