import { Navigate } from "react-router-dom";
import {trpcTanstack, trpcReact} from "./trpc.ts";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useMessageSubscription} from "./messageSubscription.ts";
import {useState} from "react";

export default () => {
    const chatState = useQuery(trpcTanstack.chatState.queryOptions());
    useMessageSubscription();

    // TODO choose user based on who has most-recent message
    const [currentPartner, setCurrentPartner] = useState("b@b");

    if (chatState.isLoading) return "Loadin' ...";
    if (!chatState.data) {
        return <Navigate to="/" />;
    }

    return <div>
        Current user: {chatState.data.ownEmail}
        <div className="flex h-screen w-screen divide-x divide-gray-300 border-t border-gray-300">
            <div className="w-1/5 divide-y divide-gray-300">
                {Object.keys(chatState.data.chats).map(fromEmail => <div onClick={() => setCurrentPartner(fromEmail)} key={fromEmail} className={`py-2 hover:bg-gray-100 cursor-pointer ${fromEmail === currentPartner ? "bg-blue-300" : ""}`}>{fromEmail}</div>)}
            </div>
            <div className="flex-1 divide-y divide-gray-100">
                {chatState.data.chats[currentPartner].map(message => <div key={message.sentAt}>{message.content}</div>)}
            </div>
        </div>
    </div>
}