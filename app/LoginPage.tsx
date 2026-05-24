import React, {type SubmitEventHandler, useState} from "react";
// import {trpcTanstack} from "./trpc.ts";
import { useNavigate } from "react-router-dom";
import {
    useMutation
} from '@tanstack/react-query'
import {queryClient, trpcTanstack} from "./trpc";

export default () => {
    const navigate = useNavigate();
    const [hasLoginFailed, setHasLoginFailed] = useState(false);
    const loginMutation = useMutation(trpcTanstack.login.mutationOptions());

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const result = await loginMutation.mutateAsync({
            email,
            password,
        });
        if (!result) {
            setHasLoginFailed(true);
        } else {
            queryClient.removeQueries({ queryKey: trpcTanstack.chatState.queryKey() });
            console.log("Removed queries")
            navigate("/chats");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email:</label>
                <input name="email" id="email" type="email" className="border" defaultValue="a@a"></input>
            </div>
            <div>
                <label htmlFor="password" id="password">Password:</label>
                <input name="password" type="password" className="border" defaultValue="foo"></input>
            </div>
            <button type="submit"
                    className={`m-4 w-60 rounded-lg ${hasLoginFailed ? "bg-red-600" : "bg-blue-600"} py-3 font-semibold text-white cursor-pointer`}>Sign in
            </button>
        </form>
    )
}