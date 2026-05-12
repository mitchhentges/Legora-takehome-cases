import { createTRPCClient, createWSClient, wsLink } from '@trpc/client';
import type { AppRouter } from '../server-trpc/ws.ts';

const wsClient = createWSClient({
    url: `ws://127.0.0.1:3001`,
});

const client = createTRPCClient<AppRouter>({
    links: [
        wsLink({
            client: wsClient,
        }),
    ],
});

async function main() {
    console.log(await client.userById.query('123'));
    console.log(await client.userCreate.mutate({ name: 'Homie' }));
}
main().catch(console.error)