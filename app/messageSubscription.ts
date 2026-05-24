import {useQueryClient} from "@tanstack/react-query";
import {useRef} from "react";
import {trpcReact, trpcTanstack} from "./trpc.ts";
import type {Message} from "../shared";

export function useMessageSubscription() {
    const queryClient = useQueryClient();

    const bufferRef = useRef<Message[]>([]);

    trpcReact.onMessage.useSubscription(undefined, {
        onData: message => {
            console.log("Received a message!")
            queryClient.setQueryData(
                trpcTanstack.chatState.queryKey(),
                (old) => {
                    const buffer = bufferRef.current;
                    buffer.push(message);
                    if (!old) {
                        return;
                    }

                    const chats = { ...old.chats };
                    buffer.forEach(message => {
                        // TODO: don't include this message if its ID matches an existing message
                        const key = message.author === old.ownEmail ? message.recipient : message.author;
                        chats[key] = [...chats[key], message];
                    });
                    buffer.length = 0;

                    return {
                        ...old,
                        chats: chats,
                    }
                }
            );
        },
    });
}