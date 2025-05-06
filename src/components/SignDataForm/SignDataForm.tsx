import { useCallback, useState } from 'react';
import ReactJson from 'react-json-view';
import './style.scss';
import {
    SignDataPayload,
    SignDataResponse,
    useTonConnectUI,
    useTonWallet,
} from '@tonconnect/ui-react';
import { verifySignData } from './verify';
import {
    SignDataPayloadBinary,
    SignDataPayloadCell,
    SignDataPayloadText,
} from './types';

const defaultTextData: SignDataPayloadText = {
    type: 'text',
    text: 'Hello, TON!',
};

const defaultBinaryData: SignDataPayloadBinary = {
    type: 'binary',
    bytes: 'SGVsbG8sIFRPTiE=',
};

const defaultCellData: SignDataPayloadCell = {
    type: 'cell',
    schema: 'message#_ text:string = Message;',
    cell: 'te6cckEBAQEAEQAAHgAAAABIZWxsbywgVE9OIb7WCx4=',
};

export function SignDataForm() {
    const [data, setData] = useState<SignDataPayload>(defaultTextData);
    const [signedData, setSignedData] = useState<SignDataResponse | null>(null);
    const [signedDataActive, setSignedDataActive] = useState<boolean>(false);
    const [verificationResult, setVerificationResult] = useState<
        boolean | null
    >(null);
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();

    const onChange = useCallback((value: object) => {
        setData((value as { updated_src: typeof data }).updated_src);
        setSignedDataActive(false);
    }, []);

    const loadTemplate = (template: SignDataPayload) => {
        setData(template);
    };

    const onSend = () =>
        tonConnectUi.signData(data).then((res) => {
            setSignedData(res);
            setSignedDataActive(true);
        });

    const onVerify = useCallback(() => {
        if (!signedData || !wallet) return;

        const publicKey = Buffer.from(wallet.account.publicKey!, 'hex');

        try {
            const isValid = verifySignData({
                signedData: signedData,
                publicKey: publicKey,
            });

            setVerificationResult(isValid);
        } catch (error) {
            console.error('Verification failed:', error);
            setVerificationResult(false);
        }
    }, [signedData, wallet]);

    return (
        <div className="send-sign-data-form">
            <h3>Configure and sign data</h3>
            <h4>Data for sign</h4>

            <div className="template-buttons">
                <button onClick={() => loadTemplate(defaultTextData)}>
                    Text
                </button>
                <button onClick={() => loadTemplate(defaultBinaryData)}>
                    Binary
                </button>
                <button onClick={() => loadTemplate(defaultCellData)}>
                    Cell
                </button>
            </div>
            <ReactJson
                name={false}
                src={data}
                theme="ocean"
                onEdit={onChange}
                onAdd={onChange}
                onDelete={onChange}
            />
            {signedData && (
                <>
                    <h4>Signed response</h4>
                    <div style={{ opacity: signedDataActive ? 1 : 0.3 }}>
                        <ReactJson
                            name={false}
                            src={signedData}
                            theme="ocean"
                        />
                    </div>
                    {verificationResult !== null && (
                        <div
                            className={`verification-result ${
                                verificationResult ? 'success' : 'error'
                            }`}
                        >
                            Verification:{' '}
                            {verificationResult ? 'Success ✅' : 'Failed ❌'}
                        </div>
                    )}
                </>
            )}
            {wallet && (
                <div className="buttons-container">
                    <button onClick={onSend}>Sign data</button>
                    {signedData && (
                        <button onClick={onVerify}>Verify signature</button>
                    )}
                </div>
            )}
        </div>
    );
}
