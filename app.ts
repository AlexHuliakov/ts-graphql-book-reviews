import * as dotenv from 'dotenv';
dotenv.config();

import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http'
import { createSchema, createYoga, createPubSub } from 'graphql-yoga'
import { PrismaClient } from '@prisma/client';

import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';
import { User } from './resolvers/user';
import { Book } from './resolvers/book';
import { Review } from './resolvers/review';

const db = new PrismaClient();  

const resolvers = {
    Query,
    Mutation,
    User,
    Book,
    Review
}

const pubSub = createPubSub();
  
const yoga = createYoga({
    schema: createSchema({ typeDefs: readFileSync(join(__dirname, 'schema.graphql'), 'utf-8'), resolvers }),
    context(req) {
        return { db, pubSub, req } as any;
    }
})

const server = createServer(yoga);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
});
