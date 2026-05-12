import * as events from 'node:events';
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { z } from 'zod';
import {zAsyncIterable} from "./zAsyncIterable";

const t = initTRPC.create();
const router = t.router;

type User = { id: string; name: string };
const ee = new events.EventEmitter()

const appRouter = router({
    userList: t.procedure
        .query(async () => {
            const users: User[] = [{ id: '1', name: 'Katt' }];
            return users;
        }),
    userById: t.procedure
        .input(z.string())
        .query(async (opts) => {
            const { input } = opts;
            const user: User = { id: input, name: 'Katt' };
            return user;
        }),
    userCreate: t.procedure
        .input(z.object({ name: z.string() }))
        .mutation(async (opts) => {
            console.log('user created btw')
            const { input } = opts;
            const user: User = { id: '1', ...input };
            ee.emit('add', user);
            return user;
        }),
    onUserCreate: t.procedure
        .input(z.number())
        .output(zAsyncIterable({
            yield: z.object({
                a: z.string(),
                b: z.string(),
            })
        }))
        .subscription(async function* (opts) {
            for await (const [data] of events.on(ee, 'add', {
                signal: opts.signal
            })) {
                const user = data as User;
                yield {
                    a: user.name,
                    b: user.id
                };
            }
        })
});

export type AppRouter = typeof appRouter;
const server = createHTTPServer({
    router: appRouter,
});

console.log("Running on http://127.0.0.1:3000")
server.listen(3000);