export class UsersDTO {
    public insertUser(
        id: unknown,
        name: unknown,
        email: unknown,
        password: unknown,
        role: unknown,
        created_at: unknown
    ){}
}

export interface SignupInputDTO {
    name: unknown,
    email: unknown,
    password: unknown
}

export interface SignupOutputDTO {
    token: string
}

export interface LoginInputDTO {
    email: unknown,
    password: unknown
}

export interface LoginOutputDTO {
    token: string

}