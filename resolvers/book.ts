export const Book = {
    reviews(parent, args, { db }, info) {
        return db.review.findMany({
            where: {
                bookId: parent.id
            }
        });
    }
}
