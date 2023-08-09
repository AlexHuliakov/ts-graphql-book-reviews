import { filter, pipe } from 'graphql-yoga'

export const Subscription = {
    count: {
        subscribe: async function* (_, { from }) {
            for (let i = from; i >= 0; i--) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                yield { count: i }
            }
        }
    },
    comment: {
        subscribe: async function* (_, { postId }, { db, pubSub }) {
            const post = db.posts.find((post) => {
                return post.id === postId && post.published;
            });

            if (!post) {
                throw new Error('Post not found.');
            }

            return pipe(
                filter((payload: any) => {
                    return payload.comment.post === postId;
                })
            )(pubSub.publish('comment'));
        }
    },
    post: {
        subscribe: async function* (_, args, { db, pubSub }) {
            return pipe(
                filter((payload: any) => {
                    return payload.post.published;
                })
            )(pubSub.publish('post'));
        }
    }
}
