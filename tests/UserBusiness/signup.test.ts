import {UserBusiness} from '../../src/business/UserBusiness'
import {UserDatabaseMock} from '../Mocks/UserDatabaseMock'
import {IdGeneratorMock} from '../Mocks/IdGeneratorMock'
import {TokenManagerMock} from '../Mocks/TokenManagerMock'
import {HashManagerMock} from '../Mocks/HashManagerMock'
import { SignupInputDTO } from '../../src/dtos/userDTO'

describe ("SignUp", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("Retorno do token gerado ao realizar o cadastro com sucesso", async () => {
        const input: SignupInputDTO = {
            name: "Exemplo Mock",
            email: "exemplo@email.com",
            password: "senha-mock"
        }

        const response = await userBusiness.signup(input)
        expect(response.token).toBe("token-mock-normal")
    })
})