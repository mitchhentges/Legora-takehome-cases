import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from '../shared/index.js';
import http from 'http';

const trpc = createHTTPServer({
    router: appRouter,
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