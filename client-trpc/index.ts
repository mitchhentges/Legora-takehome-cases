import {
    createTRPCClient,
    httpLink,
    httpSubscriptionLink,
    loggerLink,
    splitLink,
} from '@trpc/client';
import type { AppRouter } from '../server-trpc/';
import { EventSourcePolyfill } from 'event-source-polyfill';

const trpc = createTRPCClient<AppRouter>({
    links: [
        splitLink({
            condition: (op) => op.type === 'subscription',
            true: httpSubscriptionLink({
                url: 'http://localhost:3000',
                EventSource: EventSourcePolyfill,
            }),
            false: httpLink({
                url: 'http://localhost:3000',
            }),
        }),
    ],
});
async function main() {
    trpc.onUserCreate.subscribe(123, {
        onData: data => {
            console.log('Server says user created: ', data)
        },
        onError: console.error,
    });
    const user = await trpc.userById.query('123');
    console.log(user)
    console.log(await trpc.userCreate.mutate({ name: 'Homieee' }));
}
main().catch(console.error)