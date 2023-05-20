import { GetPostInputDTO } from '../../src/dtos/postDTO'
import { IdGeneratorMock } from '../Mocks/IdGeneratorMock'
import {PostBusiness} from '../../src/business/PostBusiness'
import { PostDatabaseMock } from '../Mocks/PostDatabaseMock'
import { TokenManagerMock } from '../Mocks/TokenManagerMock'

describe("getPost", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("Retorna a lista dos posts caso usuário esteja logado", async () => {
        const input: GetPostInputDTO = {
            token: "token-mock-normal"
        }

        const response = await postBusiness.getPost(input)
        expect(response.length).toBeGreaterThan(0)
    })
})