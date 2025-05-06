import {BorderRadius, Locales, ReturnStrategy, SignDataType, Theme, THEME, useTonConnectUI,} from "@tonconnect/ui-react";
import './footer.scss';
import {useEffect, useState} from "react";
import {ColorsModal} from "./ColorsModal/ColorsModal";

const SIGN_DATA_TYPES: SignDataType[] = ['text', 'binary', 'cell'];

export const Footer = () => {
    const [checkboxes, setCheckboxes] = useState(
        [true, false, false, true, true, true]
    );

    const [returnStrategy, setReturnStrategy] = useState('back');
    const [skipRedirect, setSkipRedirect] = useState('ios');
    const [featuresType, setFeaturesType] = useState<'none' | 'required' | 'preferred'>('none');

    // Состояния для features
    const [useSendTransaction, setUseSendTransaction] = useState(false);
    const [useSignData, setUseSignData] = useState(false);
    const [useExtraCurrencyRequired, setUseExtraCurrencyRequired] = useState(false);
    const [useMinMessages, setUseMinMessages] = useState(false);
    const [extraCurrencyRequired, setExtraCurrencyRequired] = useState(false);
    const [minMessages, setMinMessages] = useState(5);
    const [selectedSignDataTypes, setSelectedSignDataTypes] = useState<SignDataType[]>([]);

    const [_, setOptions] = useTonConnectUI();

    const onLangChange = (lang: string) => {
        setOptions({language: lang as Locales})
    }

    const onThemeChange = (theme: string) => {
        setOptions({uiPreferences: {theme: theme as Theme}})
    }

    const onBordersChange = (borders: string) => {
        setOptions({uiPreferences: {borderRadius: borders as BorderRadius}})
    }

    const onCheckboxChange = (position: number) => {
        setCheckboxes(state => state.map((item, index) => index === position ? !item : item ));
    }

    const onReturnStrategyInputBlur = () => {
        if (!returnStrategy) {
            setReturnStrategy('back');
            return;
        }

        setOptions({ actionsConfiguration: { returnStrategy: returnStrategy as ReturnStrategy } })

    }

    const onSkipRedirectInputBlur = () => {
        if (!skipRedirect) {
            setSkipRedirect('ios');
            return;
        }

        setOptions({ actionsConfiguration: { skipRedirectToWallet: skipRedirect as 'ios' | 'never' | 'always' } })

    }

    const onSignDataTypeChange = (type: SignDataType) => {
        setSelectedSignDataTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    useEffect(() => {
        const sendTransactionConfig = {
            ...(useExtraCurrencyRequired && { extraCurrencyRequired }),
            ...(useMinMessages && { minMessages })
        };

        const featuresConfig = {
            ...(useSendTransaction && Object.keys(sendTransactionConfig).length > 0 && {
                sendTransaction: sendTransactionConfig
            }),
            ...(useSignData && selectedSignDataTypes.length > 0 && {
                signData: {
                    types: selectedSignDataTypes
                }
            })
        };

        if (Object.keys(featuresConfig).length === 0) {
            setOptions({
                walletsRequiredFeatures: undefined,
                walletsPreferredFeatures: undefined
            });
            return;
        }

        if (featuresType === 'required') {
            setOptions({
                walletsRequiredFeatures: featuresConfig,
                walletsPreferredFeatures: undefined
            });
        } else if (featuresType === 'preferred') {
            setOptions({
                walletsRequiredFeatures: undefined,
                walletsPreferredFeatures: featuresConfig
            });
        } else {
            setOptions({
                walletsRequiredFeatures: undefined,
                walletsPreferredFeatures: undefined
            });
        }
    }, [
        featuresType,
        useSendTransaction,
        useSignData,
        useExtraCurrencyRequired,
        useMinMessages,
        extraCurrencyRequired,
        minMessages,
        selectedSignDataTypes
    ]);

    return <footer className="footer">
        <div>
            <label>language</label>
            <select onChange={e => onLangChange(e.target.value)}>
                <option value="en">en</option>
                <option value="ru">ru</option>
            </select>
        </div>

        <div>
            <label>theme</label>
            <select onChange={e => onThemeChange(e.target.value)}>
                <option value={THEME.DARK}>dark</option>
                <option value={THEME.LIGHT}>light</option>
                <option value="SYSTEM">system</option>
            </select>
        </div>

        <div>
            <label>borders</label>
            <select onChange={e => onBordersChange(e.target.value)}>
                <option value="m">m</option>
                <option value="s">s</option>
                <option value="none">none</option>
            </select>
        </div>

        <div className="footer-checkbox-container">
            <span>modals</span>
            <label>
                before
                <input type="checkbox" checked={checkboxes[0]} onChange={() => onCheckboxChange(0)}/>
            </label>
            <label>
                success
                <input type="checkbox" checked={checkboxes[1]} onChange={() => onCheckboxChange(1)}/>
            </label>
            <label>
                error
                <input type="checkbox" checked={checkboxes[2]} onChange={() => onCheckboxChange(2)}/>
            </label>
        </div>

        <div className="footer-checkbox-container">
            <span>notifications</span>
            <label>
                before
                <input type="checkbox" checked={checkboxes[3]} onChange={() => onCheckboxChange(3)}/>
            </label>
            <label>
                success
                <input type="checkbox" checked={checkboxes[4]} onChange={() => onCheckboxChange(4)}/>
            </label>
            <label>
                error
                <input type="checkbox" checked={checkboxes[5]} onChange={() => onCheckboxChange(5)}/>
            </label>
        </div>

        <div>
            <ColorsModal />
        </div>

        <div>
            <label>
                return strategy:
                <input
                    style={{ width: '200px' }}
                    value={returnStrategy}
                    onChange={e => setReturnStrategy(e.target.value)} onBlur={onReturnStrategyInputBlur}
                />
            </label>
        </div>

        <div>
            <label>
                <div>
                skip redirect to wallet:
                </div>
                <div>
                    ('ios', 'never', 'always')
                </div>
                <input
                    style={{ width: '200px' }}
                    value={skipRedirect}
                    onChange={e => setSkipRedirect(e.target.value)} onBlur={onSkipRedirectInputBlur}
                />
            </label>
        </div>

        <div>
            <label>Request features:</label>
            <select
                value={featuresType}
                onChange={e => {
                    setFeaturesType(e.target.value as 'none' | 'required' | 'preferred');
                }}
            >
                <option value="none">none</option>
                <option value="required">walletsRequiredFeatures</option>
                <option value="preferred">walletsPreferredFeatures</option>
            </select>
            {featuresType !== 'none' && (
                <div style={{ marginTop: 8, textAlign: 'left' }}>
                    <div style={{ marginBottom: 8 }}>
                        <label style={{ marginRight: 8 }}>
                            <input
                                type="checkbox"
                                checked={useSendTransaction}
                                onChange={e => setUseSendTransaction(e.target.checked)}
                            />
                            sendTransaction
                        </label>
                        {useSendTransaction && (
                            <div style={{ marginLeft: 20 }}>
                                <label style={{ marginRight: 8 }}>
                                    <input
                                        type="checkbox"
                                        checked={useExtraCurrencyRequired}
                                        onChange={e => setUseExtraCurrencyRequired(e.target.checked)}
                                    />
                                    extraCurrencyRequired
                                </label>
                                {useExtraCurrencyRequired && (
                                    <label style={{ marginLeft: 8 }}>
                                        <input
                                            type="checkbox"
                                            checked={extraCurrencyRequired}
                                            onChange={e => setExtraCurrencyRequired(e.target.checked)}
                                        />
                                        value
                                    </label>
                                )}
                                <div style={{ marginTop: 4 }}>
                                    <label style={{ marginRight: 8 }}>
                                        <input
                                            type="checkbox"
                                            checked={useMinMessages}
                                            onChange={e => setUseMinMessages(e.target.checked)}
                                        />
                                        minMessages
                                    </label>
                                    {useMinMessages && (
                                        <input
                                            type="number"
                                            value={minMessages}
                                            onChange={e => setMinMessages(Number(e.target.value))}
                                            style={{ width: 60, marginLeft: 4 }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label style={{ marginRight: 8 }}>
                            <input
                                type="checkbox"
                                checked={useSignData}
                                onChange={e => setUseSignData(e.target.checked)}
                            />
                            signData
                        </label>
                        {useSignData && (
                            <div style={{ marginLeft: 20 }}>
                                {SIGN_DATA_TYPES.map(type => (
                                    <label key={type} style={{ marginRight: 8 }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedSignDataTypes.includes(type)}
                                            onChange={() => onSignDataTypeChange(type)}
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    </footer>
}
