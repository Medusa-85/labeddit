export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export interface TokenPayload {
    id: string,
	name: string,
    role: USER_ROLES
}

export interface UserDB{
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string
}

export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    replies: number,
    created_at: string,
    updated_at: string
}

export interface ReplyDB {
    id: string,
    post_id: string,
    creator_id: string,
    likes: number,
    dislikes: number,
    created_at: string,
    reply: string
}

export interface ReplyModel {
    id: string,
    reply: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    creator: {
        id: string,
        name: string
    }
}

export interface PostModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    replies: number,
    createdAt: string,
    updatedAt: string, 
    creator: {
        id: string,
        name: string
    }
}

export interface PostWithCreatorDB extends PostDB {
    creator_name: string
}

export interface ReplyWithCreatorDB extends ReplyDB {
    creator_name: string
}

export interface LikesDislikesDB {
    user_id: string,
    post_id: string,
    like: number
}

export interface ReplyLikesDislikesDB {
    user_id: string,
    reply_id: string,
    like: number
}

export enum POST_LIKE_DISLIKE {
    ALREAD_LIKED = "ALREAD LIKED",
    ALREAD_DISLIKED = "ALREAD DISLIKED"
}

export enum REPLY_LIKE_DISLIKE {
    ALREAD_LIKED = "ALREAD LIKED",
    ALREAD_DISLIKED = "ALREAD DISLIKED"
}

