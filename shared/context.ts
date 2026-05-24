import http from "http";

export const createTrpcContext = ({ req, res }: {
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
}) => {
    return { req, res };
};
export type Context = Awaited<ReturnType<typeof createTrpcContext>>;