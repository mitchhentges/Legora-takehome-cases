import './App.css';
import LoginForm from "./LoginForm.tsx";
import {
    QueryClientProvider,
} from '@tanstack/react-query'
import {queryClient} from "./trpc.ts";

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="bg-gray-100 min-h-screen p-8">
                <LoginForm />
            </div>
        </QueryClientProvider>
    );
};

export default App;
