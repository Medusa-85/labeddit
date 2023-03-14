import { PostModel } from "../types"

export class PostDTO {
    public insertNewPost (
        content: unknown
    ){}
}

export interface GetPostInputDTO {
    token: string | undefined
}

export type GetPostOutputDTO = PostModel[]

export interface CreatePostInputDTO {
    token: string | undefined
    content: unknown
}
