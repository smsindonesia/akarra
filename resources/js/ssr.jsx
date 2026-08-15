import { AsyncLocalStorage } from 'node:async_hooks';

import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route as ziggyRoute } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'AKARRA';

// Node SSR menangani beberapa request bersamaan lewat satu event loop —
// createInertiaApp() sendiri async (ada `await` di antara resolve komponen
// dan render), jadi kalau ziggyConfig disimpan di variabel module-level
// biasa, request lain yang datang di sela-sela `await` itu bisa menimpanya
// sebelum request pertama selesai render (dua pengunjung bersamaan bisa
// saling "bertukar" konteks route). AsyncLocalStorage menjaga tiap request
// tetap membaca ziggyConfig miliknya sendiri walau eksekusinya bersilangan.
const routeContext = new AsyncLocalStorage();

global.route = (name, params, absolute) => {
    const ziggyConfig = routeContext.getStore();

    return ziggyRoute(name, params, absolute, {
        ...ziggyConfig,
        location: new URL(ziggyConfig.location),
    });
};

createServer((page) => {
    const ziggyConfig = page.props.ziggy;

    return routeContext.run(ziggyConfig, () =>
        createInertiaApp({
            page,
            render: ReactDOMServer.renderToString,
            title: (title) => (title ? `${title} | ${appName}` : appName),
            resolve: (name) =>
                resolvePageComponent(
                    `./Pages/${name}.jsx`,
                    import.meta.glob('./Pages/**/*.jsx'),
                ),
            setup: ({ App, props }) => <App {...props} />,
        }),
    );
});
