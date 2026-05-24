import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {trpc} from "./trpc.ts";

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

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
