import {
    createTRPCClient,
    httpLink,
    httpSubscriptionLink,
    splitLink,
} from '@trpc/client';
import type { AppRouter } from '../shared';
import {createTRPCOptionsProxy} from "@trpc/tanstack-react-query";
import {QueryClient} from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCClient<AppRouter>({
    links: [
        splitLink({
            condition: (op) => op.type === 'subscription',
            true: httpSubscriptionLink({
                url: 'http://localhost:3000/backend',
            }),
            false: httpLink({
                url: 'http://localhost:3000/backend',
            }),
        }),
    ],
});
export const queryClient = new QueryClient();
createTRPCReact
export const trpcTanstack = createTRPCOptionsProxy<AppRouter>({
    client: trpc,
    queryClient,
});
export const trpcReact = createTRPCReact<AppRouter>();
