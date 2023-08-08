export const Query = {
    me: (parent, args, { db }) => {
        return db.users[0];
    },
    posts(parent, args, { db }, info) {
        const { query } = args;

        if (!query) {
            return db.posts;
        }

        return db.posts.filter((post) => {
            const isTitleMatch = post.title.toLowerCase().includes(query.toLowerCase());
            const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase());

            return isTitleMatch || isBodyMatch;
        });
    },
    users(parent, args, { db }, info) {
        const { query } = args;

        if (!query) {
            return db.users;
        }

        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(query.toLowerCase());
        });
    },
    comments(parent, args, { db }, info) {
        return db.comments;
    }
}
