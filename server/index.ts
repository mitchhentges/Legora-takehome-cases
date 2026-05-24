import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from '../shared/index.js';
import { createTrpcContext } from '../shared/context.js';
import http from 'http';

const trpc = createHTTPServer({
    router: appRouter,
    createContext: createTrpcContext,
});
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    trpc.emit('request', req, res);
});

console.log("Running on http://127.0.0.1:6789")
server.listen(6789);