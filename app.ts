import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http'
import { createSchema, createYoga, createPubSub } from 'graphql-yoga'
import { PrismaClient } from '@prisma/client';

import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';

const db = new PrismaClient();  

const resolvers = {
    Query,
    Mutation,
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
