import { Navigate } from "react-router-dom";
import {trpcTanstack} from "./trpc.ts";
import {useQuery} from "@tanstack/react-query";
import {useMessageSubscription} from "./messageSubscription.ts";
import type { Message } from "../shared";

export default () => {
    const currentUser = useQuery(trpcTanstack.currentUserEmail.queryOptions());
    useMessageSubscription();

    const messages = useQuery<Message[]>({
        queryKey: ["messages"],
        queryFn: async () => [],
    });

    if (currentUser.isLoading) return "Loadin' ...";
    if (!currentUser.data) {
        return <Navigate to="/" />;
    }

    console.log("messages", messages.data)
    return <div>
        Nice chats dogg: {currentUser.data}
        {messages.data?.map((message, i) => <div key={i}>{message.sentAt + " => " + message.content}</div>)}
    </div>
}