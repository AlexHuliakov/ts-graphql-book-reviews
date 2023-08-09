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
    },
    books(parent, { query, skip = 0, take = 10 }, { db }, info) {
        if (!query) {
            return db.book.findMany();
        }

        return db.book.findMany({
           where: {
            title: {
                contains: query,
                mode: 'insensitive' 
            }
           },
           skip,
           take
        });
    }
}
