import type { RouterClient } from '@orpc/server'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/websocket'
import {router} from "./router";

const websocket = new WebSocket('ws://localhost:3001')
const link = new RPCLink({
    websocket
})

export const orpc: RouterClient<typeof router> = createORPCClient(link)

async function main() {
    console.log(await orpc.listPlanet({}));
}
main().catch(console.error)