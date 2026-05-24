import http from "http";

export type Context = {
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
    userEmail: string,
};