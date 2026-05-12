import { WebSocketServer } from 'ws'
import { RPCHandler } from '@orpc/server/ws'
import { onError } from '@orpc/server'
import {router} from "./router";

const handler = new RPCHandler(router, {
    interceptors: [
        onError((error) => {
            console.error(error)
        }),
    ],
})

const wss = new WebSocketServer({ port: 3001 })
console.log('websocket server ready on ws://127.0.0.1:3001')
wss.on('connection', (ws) => {
    handler.upgrade(ws, {context: {headers: {}}})
})