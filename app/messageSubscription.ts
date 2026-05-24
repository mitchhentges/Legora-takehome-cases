import {useQueryClient} from "@tanstack/react-query";
import {useRef} from "react";
import {trpcReact, trpcTanstack} from "./trpc.ts";

export function useMessageSubscription() {
    const queryClient = useQueryClient();

    const bufferRef = useRef<
        { to: string; from: string; content: string; sentAt: string }[]
    >([]);

    trpcReact.onMessage.useSubscription(undefined, {
        onData: message => {
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
                        chats[message.from] = [...chats[message.from], message];
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