export default `
    type Query {
        me: User!
        posts(quert: String): [Post!]!
        users(query: String): [User!]!
        comments: [Comment!]!
    }
    
    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }
    
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }
    
    input CreateCommentInput {
        text: String!
        post: ID!
        author: ID!
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
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
        deletePost(id: ID!): Post!
        createPost(data: CreatePostInput): Post!
        createComment(data: CreateCommentInput): Comment!
    }
`
