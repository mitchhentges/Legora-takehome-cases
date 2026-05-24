import { Navigate } from "react-router-dom";
import {trpcTanstack} from "./trpc.ts";
import {useQuery} from "@tanstack/react-query";

export default () => {
    const currentUser = useQuery(trpcTanstack.currentUser.queryOptions());

    if (currentUser.isLoading) return "Loadin' ...";
    if (!currentUser.data || currentUser.data === "NOPE") {
        console.log("back to jail!", currentUser) // breakpoint is here
        return <Navigate to="/" />;
    }

    return (
        "Nice chats dogg: " + currentUser.data
    )
}