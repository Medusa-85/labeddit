import { ReplyDB, ReplyWithCreatorDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class ReplyDatabase extends BaseDatabase {
    public static TABLE_REPLY_POST = "reply_posts"

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
}