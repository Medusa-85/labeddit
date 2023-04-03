import { ReplyModel } from "../types"

export interface ReplyPostInputDTO {
    idToReply: string
    token: string | undefined
    reply: unknown
}

export interface GetRepliesInputDTO {
    postId: string, 
    token: string | undefined
}

export type GetRepliesOutputDTO = ReplyModel[]