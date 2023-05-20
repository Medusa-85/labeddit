import { UserBusiness } from "../../src/business/UserBusiness"
import { LoginInputDTO } from "../../src/dtos/userDTO"
import { HashManagerMock } from "../Mocks/HashManagerMock"
import { IdGeneratorMock } from "../Mocks/IdGeneratorMock"
import { TokenManagerMock } from "../Mocks/TokenManagerMock"
import { UserDatabaseMock } from "../Mocks/UserDatabaseMock"


describe("Login", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("Retorna token ao realizar login com sucesso em conta 'normal'", async () => {
        const input: LoginInputDTO = {
            email: "normal@email.com",
            password: "password"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("Retorna token ao realizar login com sucesso em conta 'admin'", async () => {
        const input: LoginInputDTO = {
            email: "admin@email.com",
            password: "password"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-admin")
    })
    

})