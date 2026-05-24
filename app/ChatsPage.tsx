import { Navigate } from "react-router-dom";
import {trpcTanstack, trpcReact} from "./trpc.ts";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useRef} from "react";
import {useMessageSubscription} from "./messageSubscription.ts";

export default () => {
    const chatState = useQuery(trpcTanstack.chatState.queryOptions());
    useMessageSubscription();

    if (chatState.isLoading) return "Loadin' ...";
    if (!chatState.data) {
        return <Navigate to="/" />;
    }

    return <div>
        Current user: {chatState.data.ownEmail}
        {Object.entries(chatState.data.chats)?.map(([from, messages]) => (
            <div key={from}>
                {messages.map(message => <div key={message.sentAt}>{message.from}: {message.content}</div>)}
            </div>
        ))}
    </div>
}