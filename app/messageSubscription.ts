import { useQueryClient } from "@tanstack/react-query";
import { trpcReact } from "./trpc";

export function useMessageSubscription() {
    const queryClient = useQueryClient();

    trpcReact.onUserCreate.useSubscription(undefined, {
        onData: message => {
            queryClient.setQueryData(["messages"], (old = []) => [...old, message]); // TODO mutate?
        },
    });
}