import { useQueryClient } from "@tanstack/react-query";
import { trpcReact } from "./trpc";
import type { Message } from "../shared";

export function useMessageSubscription() {
    const queryClient = useQueryClient();

    trpcReact.onMessage.useSubscription(undefined, {
        onData: message => {
            queryClient.setQueryData<Message[]>(["messages"], (old = []) => [...old, {
                ...message,
                sentAt: new Date(message.sentAt),
            }]);
        },
    });
}