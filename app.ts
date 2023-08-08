import { createSchema, createYoga } from 'graphql-yoga'
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http'

const typeDefs = `
    type Query {
        me: User!
        posts(quert: String): [Post!]!
        users(query: String): [User!]!
        comments: [Comment!]!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]! 
    }
    
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    
    type Comment {
        id: ID!
        text: String!
        post: Post!
        author: User!
    }
    
    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
    }
`

const users = [{
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

const posts = [{
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

const comments = [{
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
            return {
                id: '111',
                name: 'Mike',
                email: 'test',
                age: 28
            }
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
                ...args
            }
            
            users.push(user);
            return user;
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
