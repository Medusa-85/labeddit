import { PostBusiness } from "../business/PostBusiness";
import { UserBusiness } from "../business/UserBusiness";

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ){}
}