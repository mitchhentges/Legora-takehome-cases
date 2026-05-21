import * as events from 'node:events';
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { z } from 'zod';
import {zAsyncIterable} from "./zAsyncIterable.js";
import http from 'http';

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
const trpc = createHTTPServer({
    router: appRouter,
    responseMeta() {
        return {
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Credentials': 'true',
            },
        };
    },
});
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    trpc.emit('request', req, res);
});

console.log("Running on http://127.0.0.1:6789")
server.listen(6789);