import './App.css';
import LoginPage from "./LoginPage.tsx";
import {
    QueryClientProvider,
} from '@tanstack/react-query'
import {queryClient} from "./trpc.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatsPage from "./ChatsPage.tsx";

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/chats" element={<ChatsPage />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default App;
