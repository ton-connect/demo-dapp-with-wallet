import './style.scss';
import {
    useTonConnectUI,
    useTonWallet,
} from '@tonconnect/ui-react';

export function ConnectionButton() {
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();

    return (
        <div className="send-tx-form">
            {!wallet && (
                <button onClick={() => tonConnectUi.openModal()}>
                    Connect wallet to send the transaction
                </button>
            )}
        </div>
    );
}
