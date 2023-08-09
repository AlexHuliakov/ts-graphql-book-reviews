import getUserId from "../util/get-user-id";

export const User = {
    email(parent, args, { req }, info) {
        try {
            const userId = getUserId({ req });
        
            if (userId === parent.id) {
                return parent.email;
            }
        } catch (e) {
            return null;
        }
        
        return null;
    },
    reviews(parent, args, { db }, info) {
        return db.review.findMany({
            where: {
                author: parent
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
}
