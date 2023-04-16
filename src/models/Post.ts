import { PostDB, PostModel } from "../types";

export class Post {
      
    constructor(
        private id: string,
        private creatorId: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private replies: number,
        private createdAt: string,
        private updatedAt: string,
        private creatorName: string 
    ){}
    public getId(): string {
        return this.id;
    }
    public setId(value: string) {
        this.id = value;
    }
    public getCreatorId(): string {
        return this.creatorId;
    }
    public setCreatorId(value: string) {
        this.creatorId = value;
    }
    public getContent(): string {
        return this.content;
    }
    public setContent(value: string) {
        this.content = value;
    }
    public getLikes(): number {
        return this.likes;
    }
    public setLikes(value: number) {
        this.likes = value;
    }
    public addLike() {
        this.likes += 1
    }
    public removeLike() {
        this.likes -= 1
    }
    public getDislikes(): number {
        return this.dislikes;
    }
    public setDislikes(value: number) {
        this.dislikes = value;
    }
    public addDislike() {
        this.dislikes += 1
    }
    public removeDislike() {
        this.dislikes -= 1
    }
    public getCreatedAt(): string {
        return this.createdAt;
    }
    public getReplies(): number {
        return this.replies;
    }
    public setReplies(value: number) {
        this.replies = value;
    }
    public addReplies() {
        this.replies += 1
    }  
    public setCreatedAt(value: string) {
        this.createdAt = value;
    }
    public getUpdatedAt(): string {
        return this.updatedAt;
    }
    public setUpdatedAt(value: string) {
        this.updatedAt = value;
    }
    public getCreatorName(): string {
        return this.creatorName;
    }
    public setCreatorName(value: string) {
        this.creatorName = value;
    }

    public toBusinessModel(): PostModel {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            replies: this.replies,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            creator: {
                id: this.creatorId,
                name: this.creatorName
            }
        }
    }

    public toDBModel(): PostDB{
        return {
            id: this.id,
            content: this.content,
            creator_id: this.creatorId,
            likes: this.likes,
            dislikes: this.dislikes,
            replies: this.replies,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        }
    }
}