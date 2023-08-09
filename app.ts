import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http'
import { createSchema, createYoga, createPubSub } from 'graphql-yoga'

import db from './db';
import { User } from './resolvers/user';
import { Post } from './resolvers/post';
import { Query } from './resolvers/query';
import { Comment } from './resolvers/comment';
import { Mutation } from './resolvers/mutation';
import { Subscription } from './resolvers/subscription';

const resolvers = {
    Query,
    Mutation,
    User,
    Post,
    Comment,
    Subscription
}

const pubSub = createPubSub();
  
const yoga = createYoga({
    schema: createSchema({ typeDefs: readFileSync(join(__dirname, 'schema.graphql'), 'utf-8'), resolvers }),
    context() {
        return { db, pubSub } as any;
    }
})

const server = createServer(yoga);

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000')
});
