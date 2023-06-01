import { PostBusiness } from "../../src/business/PostBusiness"
import { CreatePostInputDTO } from "../../src/dtos/postDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { IdGeneratorMock } from "../Mocks/IdGeneratorMock"
import { PostDatabaseMock } from "../Mocks/PostDatabaseMock"
import { TokenManagerMock } from "../Mocks/TokenManagerMock"

describe("createPost", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("Cria um post e insere no banco de dados", async () => {
        const input: CreatePostInputDTO = {
            token: "token-mock-normal",
            content: "post-mock"
        }

        const response = await postBusiness.createPost(input)
        console.log(response)
        expect(response).toBeUndefined()
    })
    test("Acusa um erro no token", () => {
               
        expect(async () => {
            const input: CreatePostInputDTO = {
                token: "token-mock",
                content: "post-mock"
            }
            await postBusiness.createPost(input)
        }).rejects.toThrow(new BadRequestError("Token inválido"))
    })
})