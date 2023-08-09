import { User } from "@prisma/client";
import getUserId from "../util/get-user-id";

export const Query = {
    profile(parent, args, { db, req }, info): User {
        const userId = getUserId({ req });
        
        return db.user.findUnique({
            where: {
                id: userId
            }
        });
    },
    users(parent, { query }, { db }, info) {
        if (!query) {
            return db.user.findMany();
        }

        return db.user.findMany({
           where: {
            name: {
                contains: query,
                mode: 'insensitive' 
            }
           }
        });
    }
}
