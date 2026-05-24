import * as events from 'node:events';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import {zAsyncIterable} from "./zAsyncIterable.js";
import type {Context} from "./context.js";
import { serialize as serializeCookie } from "cookie";

const t = initTRPC.context<Context>().create();
const router = t.router;

type UserEmail = string;
export type Message = {
    to: UserEmail;
    from: UserEmail;
    content: string;
    sentAt: Date;
}
const websocketMessageQueue = new events.EventEmitter()

setInterval(() => {
    const timestamp = new Date();
    const message = {
        to: "a@a",
        from: "b@b",
        content: timestamp.toString(),
        sentAt: timestamp,
    };
    console.log("adding message", message)
    websocketMessageQueue.emit("add", message)
}, 1000);

export const appRouter = router({
    login: t.procedure
        .input(z.object({ email: z.string(), password: z.string() }))
        .mutation(async ( {input, ctx}) => {
            console.log('cookie', ctx.req.headers['cookie'])
            ctx.res.setHeader('Set-Cookie', serializeCookie("auth_token", input.email, {
                httpOnly: true
            }));
            return true;
        }),
    currentUserEmail: t.procedure
        .query(async ( {ctx}) => {
            if (!ctx.userEmail) {
                return null;
            }
            return ctx.userEmail;
        }),
    onMessage: t.procedure
        .output(zAsyncIterable({
            yield: z.object({
                to: z.string(),
                from: z.string(),
                content: z.string(),
                sentAt: z.date(),
            })
        }))
        .subscription(async function* (opts) {
            for await (const [data] of events.on(websocketMessageQueue, 'add', {
                signal: opts.signal
            })) {
                yield data as Message;
            }
        })
});

export type AppRouter = typeof appRouter;