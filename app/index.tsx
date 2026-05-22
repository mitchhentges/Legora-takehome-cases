import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
    createTRPCClient,
    httpLink,
    httpSubscriptionLink,
    loggerLink,
    splitLink,
} from '@trpc/client';
import type { AppRouter } from '../shared';

const trpc = createTRPCClient<AppRouter>({
    links: [
        splitLink({
            condition: (op) => op.type === 'subscription',
            true: httpSubscriptionLink({
                url: 'http://localhost:6789',
            }),
            false: httpLink({
                url: 'http://localhost:6789',
            }),
        }),
    ],
});

async function main() {
    trpc.onUserCreate.subscribe(123, {
        onData: data => {
            console.log('Server says user created: ', data)
        },
        onError: console.error,
    });
    const user = await trpc.userById.query('123');
    console.log(user)
    console.log(await trpc.userCreate.mutate({ name: 'Homieee' }));
}
main().catch(console.error)

console.log('what up')
console.log('oy2')
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
