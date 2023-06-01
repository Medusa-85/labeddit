import { GetPostByIdInputDTO } from '../../src/dtos/postDTO'
import { IdGeneratorMock } from '../Mocks/IdGeneratorMock'
import { PostBusiness } from '../../src/business/PostBusiness'
import { getPostOutputMock, PostDatabaseMock } from '../Mocks/PostDatabaseMock'
import { TokenManagerMock } from '../Mocks/TokenManagerMock'

describe("getPostById", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("Retorna um único post referente ao id informado, caso usuário esteja logado", async () => {
        const input: GetPostByIdInputDTO = {
            postId: "post-id-mock",
            token: "token-mock-normal"
        }
        
        const response = await postBusiness.getPostById(input)
        expect(response).toEqual(getPostOutputMock)
    })

    test("Retorna 'Token inválido' caso o usuário não esteja logado", async () => {
        const input: GetPostByIdInputDTO = {
            postId: "post-id-mock",
            token: "token-mock-inválido"
        }

        const response = await postBusiness.getPostById(input)
        expect(response).toThrow("Token inválido")
    })
})