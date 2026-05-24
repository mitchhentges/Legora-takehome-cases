import { Navigate } from "react-router-dom";
import {trpcTanstack} from "./trpc.ts";
import {useQuery} from "@tanstack/react-query";
import {useMessageSubscription} from "./messageSubscription.ts";

export default () => {
    const currentUser = useQuery(trpcTanstack.currentUser.queryOptions());
    useMessageSubscription();

    const messages = useQuery({
        queryKey: ["messages"],
        queryFn: async () => [],
    });

    if (currentUser.isLoading) return "Loadin' ...";
    if (!currentUser.data || currentUser.data === "NOPE") {
        console.log("back to jail!", currentUser) // breakpoint is here
        return <Navigate to="/" />;
    }

    console.log("messages", messages.data)
    return <div>
        Nice chats dogg: {currentUser.data}
        {messages.data?.map((message, i) => <div key={i}>{message.b}</div>)}
    </div>
}