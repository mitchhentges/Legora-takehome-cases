import React, {type SubmitEventHandler, useState} from "react";
import {trpcTanstack} from "./trpc.ts";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

export default () => {
    const loginMutation = useMutation(trpcTanstack.login.mutationOptions());

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        await loginMutation.mutateAsync({
            email,
            password,
        });
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
                    className="m-4 w-60 rounded-lg bg-blue-600 py-3 font-semibold text-white cursor-pointer">Sign in
            </button>
        </form>
    )
}