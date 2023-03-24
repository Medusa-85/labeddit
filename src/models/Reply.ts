import { ReplyDB, ReplyModel } from "../types";

export class Reply {
    constructor(
        private id: string,
        private postId: string,
        private creatorId: string,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
        private reply: string,
        private creatorName: string
    ) {}
    public getId(): string {
        return this.id;
    }
    public setId(value: string) {
        this.id = value;
    }
    public getPostId(): string {
        return this.postId;
    }
    public setPostId(value: string) {
        this.postId = value;
    }
    public getCreatorId(): string {
        return this.creatorId;
    }
    public setCreatorId(value: string) {
        this.creatorId = value;
    }
    public getLikes(): number {
        return this.likes;
    }
    public setLikes(value: number) {
        this.likes = value;
    }
    public getDislikes(): number {
        return this.dislikes;
    }
    public setDislikes(value: number) {
        this.dislikes = value;
    }
    public getCreated_at(): string {
        return this.createdAt;
    }
    public setCreated_at(value: string) {
        this.createdAt = value;
    }
    public getReply(): string {
        return this.reply;
    }
    public setReply(value: string) {
        this.reply = value;
    }
    public getCreatorName(): string {
        return this.creatorName;
    }
    public setCreatorName(value: string) {
        this.creatorName = value;
    }

    public ReplyToBusinessModel (): ReplyModel {
        return {
            id: this.id,
            reply: this.reply,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
            creator: {
                id: this.creatorId,
                name: this.creatorName
            }
        }
    }
    public ReplyToDBModel (): ReplyDB {
        return {
            id: this.id,
            post_id: this.postId,
            creator_id: this.creatorId,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt,
            reply: this.reply
        }
    }
}