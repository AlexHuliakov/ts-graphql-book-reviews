import { randomUUID } from 'node:crypto';

export const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some((user) => {
            return user.email === args.email;
        });

        if (emailTaken) {
            throw new Error('Email taken.');
        }

        const user = {
            id: randomUUID(),
            ...args.data
        }

        db.users.push(user);
        return user;
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) => {
            return user.id === args.id;
        });

        if (userIndex === -1) {
            throw new Error('User not found.');
        }

        const deletedUsers = db.users.splice(userIndex, 1);

        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id;

            if (match) {
                db.omments = db.comments.filter((comment) => {
                    return comment.post !== post.id;
                });
            }

            return !match;
        });

        db.comments = db.comments.filter((comment) => {
            return comment.author !== args.id;
        });

        return deletedUsers[0];
    },
    deletePost(parent, args, { db }, info) {
        const postIndex = db.posts.findIndex((post) => {
            return post.id === args.id;
        });

        if (postIndex === -1) {
            throw new Error('Post not found.');
        }

        const deletedPosts = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter((comment) => {
            return comment.post !== args.id;
        });

        return deletedPosts[0];
    },
    createPost(parent, args, { db }, info) {
        const userExists = db.users.some((user) => {
            return user.id === args.data.author;
        });

        if (!userExists) {
            throw new Error('User not found.');
        }

        const post = {
            id: randomUUID(),
            ...args.data
        }

        db.posts.push(post);
        return post;
    },
    createComment(parent, args, { db }, info) {
        const userExists = db.users.some((user) => {
            return user.id === args.data.author;
        });

        const postExists = db.posts.some((post) => {
            return post.id === args.data.post && post.published;
        });

        if (!userExists || !postExists) {
            throw new Error('Unable to find user and post.');
        }

        const comment = {
            id: randomUUID(),
            ...args.data
        }

        db.comments.push(comment);
        return comment;
    },
    updateUser(parent, args, { db }, info) {
        const { id, data } = args;
        const user = db.users.find((user) => {
            return user.id === id;
        });

        if (!user) {
            throw new Error('User not found.');
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => {
                return user.email === data.email;
            });

            if (emailTaken) {
                throw new Error('Email taken.');
            }

            user.email = data.email;
        }

        if (typeof data.name === 'string') {
            user.name = data.name;
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age;
        }

        return user;
    },
    updatePost(parent, args, { db }, info) {
        const { id, data } = args;
        const post = db.posts.find((post) => {
            return post.id === id;
        });

        if (!post) {
            throw new Error('Post not found.');
        }

        if (typeof data.title === 'string') {
            post.title = data.title;
        }

        if (typeof data.body === 'string') {
            post.body = data.body;
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published;
        }

        return post;
    }
}
