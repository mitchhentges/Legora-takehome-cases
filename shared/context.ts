import http from "http";
import type {DatabasePool} from "slonik";

export type Context = {
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
    userEmail: string,
    db: DatabasePool,
};