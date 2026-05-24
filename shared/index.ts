import * as events from 'node:events';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import {zAsyncIterable} from "./zAsyncIterable.js";
import type {Context} from "./context.js";
import { serialize as serializeCookie } from "cookie";
import {sql} from "slonik";
import superjson from "superjson";

const t = initTRPC.context<Context>().create({
    transformer: superjson
});
const router = t.router;

type UserEmail = string;
export type Message = {
    recipient: UserEmail;
    author: UserEmail;
    content: string;
    sentAt: Date;
}
export type ChatState = {
    ownEmail: UserEmail,
    chats: Record<UserEmail, Message[]>,
}
const websocketMessageQueue = new events.EventEmitter()

export const appRouter = router({
    login: t.procedure
        .input(z.object({ email: z.string(), password: z.string() }))
        .mutation(async ( {input, ctx}) => {
            const user = await ctx.db.maybeOne(
                sql.unsafe`
                SELECT email FROM users
                WHERE email = ${input.email}
                AND password_hash = crypt(${input.password}, password_hash)
                `
            );
            if (!user) {
                return false;
            }

            // TODO generate a secure token, store it in database in [ $token => $email ] lookup table
            ctx.res.setHeader('Set-Cookie', serializeCookie("auth_token", input.email, {
                httpOnly: true
            }));
            return true;
        }),
    chatState: t.procedure
        .query(async ( {ctx}): Promise<ChatState | null> => {
            if (!ctx.userEmail) {
                return null;
            }
            const allUsers = await ctx.db.anyFirst(
                sql.unsafe`
                    SELECT email FROM users
                    WHERE email != ${ctx.userEmail}
                `
            ) as UserEmail[];
            const messages = await ctx.db.any(
                sql.unsafe`
                SELECT author, recipient, content, sent_at AS "sentAt" FROM messages
                WHERE author = ${ctx.userEmail} OR recipient = ${ctx.userEmail}
                ORDER BY sent_at;
                `
            ) as Message[];

            const chats = allUsers.reduce<Record<UserEmail, []>>((chats, email) => {
                chats[email] = [];
                return chats;
            }, {});
            return {
                ownEmail: ctx.userEmail,
                chats: messages.reduce<Record<UserEmail, Message[]>>((chats, msg) => {
                    const key = msg.author === ctx.userEmail ? msg.recipient : msg.author;
                    chats[key] = [...(chats[key] || []), msg];
                    return chats;
                }, chats),
            }
        }),
    sendMessage: t.procedure
        .input(z.object({ content: z.string(), recipient: z.string() }))
        .mutation(async ( {input, ctx}) => {
            const now = new Date();
            console.log(`[${ctx.userEmail} => ${input.recipient}] ${input.content} ${now}`)
            await ctx.db.query(
                sql.unsafe`
                INSERT INTO messages (author, recipient, content, sent_at)
                VALUES (${ctx.userEmail}, ${input.recipient}, ${input.content}, ${sql.timestamp(now)});
                `
            )
            websocketMessageQueue.emit("add", {
                recipient: input.recipient,
                author: ctx.userEmail,
                content: input.content,
                sentAt: now,
            })
        }),
    onMessage: t.procedure
        .output(zAsyncIterable({
            yield: z.object({
                recipient: z.string(),
                author: z.string(),
                content: z.string(),
                sentAt: z.date(),
            })
        }))
        .subscription(async function* ({signal, ctx}) {
            for await (const [data] of events.on(websocketMessageQueue, 'add', {
                signal
            })) {
                const message = data as Message;
                if (message.author === ctx.userEmail || message.recipient === ctx.userEmail) {
                    yield message;
                }
            }
        })
});

export type AppRouter = typeof appRouter;