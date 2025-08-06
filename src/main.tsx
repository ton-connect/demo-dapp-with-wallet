import './patch-local-storage-for-github-pages';

import React, {StrictMode} from 'react'
import { render } from 'react-dom';
import App from './App'
import './index.scss'
import eruda from "eruda";
import { enableQaMode } from '@tonconnect/ui-react';

if (import.meta.env.VITE_QA_MODE === 'enable') {
    enableQaMode();
}

eruda.init();

render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById('root') as HTMLElement
)
