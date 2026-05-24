import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from '../shared/index.js';
import { parse as parseCookie } from "cookie";
import {createPool} from "slonik";

const db = await createPool('postgresql://postgres:postgres@localhost:5432/app', {
    typeParsers: [
        {
            name: "timestamp",
            parse: value => new Date(value),
        }
    ]
});
const trpc = createHTTPServer({
    router: appRouter,
    createContext: ({ req, res }) => {
        const cookies = parseCookie(req.headers.cookie ?? "");
        const authToken = cookies.auth_token ?? "";
        return { req, res, userEmail: authToken, db };
    },
    onError: console.error,
});

console.log("Running on http://127.0.0.1:6789")
trpc.listen(6789);