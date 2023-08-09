export const Query = {
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
