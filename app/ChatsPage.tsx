import { Navigate } from "react-router-dom";
import {trpcTanstack, trpcReact} from "./trpc.ts";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useMessageSubscription} from "./messageSubscription.ts";
import React, {useState} from "react";

export default () => {
    const chatState = useQuery(trpcTanstack.chatState.queryOptions());
    const sendMessageMutation = trpcReact.sendMessage.useMutation();
    useMessageSubscription();

    const [currentPartner, setCurrentPartner] = useState("");
    const [inputMessage, setInputMessage] = useState("");

    if (chatState.isLoading) return "Loadin' ...";
    if (!chatState.data) {
        return <Navigate to="/" />;
    }

    if (!currentPartner) {
        setCurrentPartner(Object.keys(chatState.data.chats)[0]);
        return;
    }

    const sendMessage = () => {
        const message = inputMessage;
        setInputMessage("");
        sendMessageMutation.mutate({
            to: currentPartner,
            content: message,
        })
    }

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e)=>  {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    const ownEmail = chatState.data.ownEmail;
    return <div>
        <div className="flex flex-col h-screen w-screen">
            <div>Current user: {chatState.data.ownEmail}</div>
            <div className="flex-1 flex divide-x divide-gray-300 border-t border-b border-gray-300">
                <div className="w-1/5 divide-y divide-gray-300">
                    {Object.keys(chatState.data.chats).map(fromEmail => <div onClick={() => setCurrentPartner(fromEmail)} key={fromEmail} className={`py-2 hover:bg-gray-100 cursor-pointer ${fromEmail === currentPartner ? "bg-blue-600" : ""}`}>{fromEmail}</div>)}
                </div>
                <div className="flex-1 divide-y divide-gray-100">
                    {chatState.data.chats[currentPartner].map(message => {
                        return <div className={`flex ${message.from === ownEmail ? "justify-end" : ""}`} key={message.sentAt}>{message.content}</div>
                    })}
                </div>
            </div>
            <div className="flex">
                <input className="flex-1 px-2" type="text" placeholder="Send a big ol' message, sport" onKeyDown={onKeyDown} value={inputMessage} onChange={e => setInputMessage(e.target.value)} />
                <input type="button" value="Send!" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700  cursor-pointer" onClick={sendMessage} />
            </div>
        </div>
    </div>
}