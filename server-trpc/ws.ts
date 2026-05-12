import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';
import { initTRPC } from "@trpc/server";
import { z } from 'zod';


const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

type User = { id: string; name: string };
const appRouter = router({
    userList: publicProcedure
        .query(async () => {
            const users: User[] = [{ id: '1', name: 'Katt' }];
            return users;
        }),
    userById: publicProcedure
        .input(z.string())
        .query(async (opts) => {
            const { input } = opts;
            const user: User = { id: input, name: 'Katt' };
            return user;
        }),
    userCreate: publicProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async (opts) => {
            const { input } = opts;
            const user: User = { id: '1', ...input };
            return user;
        }),
});

export type AppRouter = typeof appRouter;
const wss = new WebSocketServer({
    port: 3001,
});
const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext: async () => {},
});

wss.on('connection', (ws) => {
    console.log(`++ Connection (${wss.clients.size})`);
    ws.once('close', () => {
        console.log(`-- Connection (${wss.clients.size})`);
    });
});
console.log('WebSocket Server listening on ws://127.0.0.1:3001');
