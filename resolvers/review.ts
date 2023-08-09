export const Review = {
    book(parent, args, { db }, info) {
        return db.book.findUnique({
            where: {
                id: parent.bookId
            }
        });
    },
    author(parent, args, { db }, info) {
        return db.user.findUnique({
            where: {
                id: parent.authorId
            }
        });
    }   
}
