import { createSchema, createYoga } from 'graphql-yoga'
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http'
import typeDefs from './type-def';

let users = [{
    id: '1',
    name: 'Mike',
    email: 'test',
    age: 28
}, {
    id: '2',
    name: 'Sarah',
    email: 'test',
    age: 28
}, {
    id: '3',
    name: 'Andrew',
    email: 'test',
    age: 28
}];

let posts = [{
    id: '1',
    title: 'title1',
    body: 'body1',
    published: true,
    author: '1'
}, {
    id: '2',
    title: 'title2',
    body: 'body2',
    published: false,
    author: '1'
}, {
    id: '3',
    title: 'title3',
    body: 'body3',
    published: true,
    author: '3'
}];

let comments = [{
    id: '1',
    text: 'comment1',
    post: '1',
    author: '1'
}, {
    id: '2',
    text: 'comment2',
    post: '1',
    author: '2'
}, {
    id: '3',
    text: 'comment3',
    post: '2',
    author: '1'
},
{
    id: '3',
    text: 'comment3',
    post: '3',
    author: '1'
}
];

const resolvers = {
    Query: {
        me: () => {
            return users[0];
        },
        posts(parent, args, ctx, info) {
            const { query } = args;
            
            if (!query) {
                return posts;
            }
            
            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase());
                
                return isTitleMatch || isBodyMatch;
            });
        },
        users(parent, args, ctx, info) {
            const { query } = args;
            
            if (!query) {
                return users;
            }
            
            return users.filter((user) => {
                return user.name.toLowerCase().includes(query.toLowerCase());
            });
        },
        comments(parent, args, ctx, info) {
            return comments;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id;
            });
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id;
            });
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post;
            });
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => {
                return user.email === args.email;
            });
            
            if (emailTaken) {
                throw new Error('Email taken.');
            }
            
            const user = {
                id: randomUUID(),
                ...args.data
            }
            
            users.push(user);
            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => {
                return user.id === args.id;
            });
            
            if (userIndex === -1) {
                throw new Error('User not found.');
            }
            
            const deletedUsers = users.splice(userIndex, 1);
            
            posts = posts.filter((post) => {
                const match = post.author === args.id;
                
                if (match) {
                    comments = comments.filter((comment) => {
                        return comment.post !== post.id;
                    });
                }
                
                return !match;
            });
            
            comments = comments.filter((comment) => {
                return comment.author !== args.id;
            });
            
            return deletedUsers[0];  
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => {
                return post.id === args.id;
            });
            
            if (postIndex === -1) {
                throw new Error('Post not found.');
            }
            
            const deletedPosts = posts.splice(postIndex, 1);
            
            comments = comments.filter((comment) => {
                return comment.post !== args.id;
            });
            
            return deletedPosts[0];  
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => {
                return user.id === args.data.author;
            });
            
            if (!userExists) {
                throw new Error('User not found.');
            }
            
            const post = {
                id: randomUUID(),
                ...args.data
            }
            
            posts.push(post);
            return post;
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => {
                return user.id === args.data.author;
            });
            
            const postExists = posts.some((post) => {
                return post.id === args.data.post && post.published;
            });
            
            if (!userExists || !postExists) {
                throw new Error('Unable to find user and post.');
            }
            
            const comment = {
                id: randomUUID(),
                ...args.data
            }
            
            comments.push(comment);
            return comment;
        }
    }
}

const yoga = createYoga({
    schema: createSchema({ typeDefs, resolvers })
})

const server = createServer(yoga);

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000')
});
