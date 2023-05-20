import {PostBusiness} from '../../src/business/PostBusiness'
import { IdGeneratorMock } from '../Mocks/IdGeneratorMock'
import { PostDatabaseMock } from '../Mocks/PostDatabaseMock'
import { TokenManagerMock } from '../Mocks/TokenManagerMock'

describe("getPost", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )
})