import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public singUp = async (newUserDB: UserDB): Promise<void> => {
        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .insert(newUserDB)
    }

    public findByEmail = async (email: string): Promise<UserDB | undefined> => {
        const result: UserDB[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .select()
        .where({ email })

        return result[0]
    }

}