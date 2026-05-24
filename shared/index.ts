import * as events from 'node:events';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import {zAsyncIterable} from "./zAsyncIterable.js";
import type {Context} from "./context";

const t = initTRPC.context<Context>().create();
const router = t.router;

type User = { id: string; name: string };
const ee = new events.EventEmitter()

export const appRouter = router({
    login: t.procedure
        .input(z.object({ email: z.string(), password: z.string() }))
        .mutation(async ( {input, ctx}) => {
            console.log('cookie', ctx.req.headers['cookie'])
            ctx.res.setHeader('Set-Cookie', 'legora_token=foo; HttpOnly')
            return true;
        }),
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