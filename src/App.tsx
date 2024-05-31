import './App.scss';
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import { Header } from './components/Header/Header';
import { TxForm } from './components/TxForm/TxForm';
import { Footer } from './components/Footer/Footer';
import { TonProofDemo } from './components/TonProofDemo/TonProofDemo';
import { useEffect } from 'react';

function App() {
  return (
    <div style={{ height: '200vh' }}>
      <TonConnectUIProvider
        manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json"
        uiPreferences={{ theme: THEME.DARK }}
        walletsListConfiguration={{
          includeWallets: [
            {
              appName: 'safepalwallet',
              name: 'SafePal',
              imageUrl:
                'https://s.pvcliping.com/web/public_image/SafePal_x288.png',
              aboutUrl: 'https://www.safepal.com/download',
              jsBridgeKey: 'safepalwallet',
              platforms: ['ios', 'android', 'chrome', 'firefox'],
            },
            {
              appName: 'tonwallet',
              name: 'TON Wallet',
              imageUrl: 'https://wallet.ton.org/assets/ui/qr-logo.png',
              aboutUrl:
                'https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd',
              universalLink: 'https://wallet.ton.org/ton-connect',
              jsBridgeKey: 'tonwallet',
              bridgeUrl: 'https://bridge.tonapi.io/bridge',
              platforms: ['chrome', 'android'],
            },
            {
              appName: 'coin98wallet',
              name: 'Coin98',
              imageUrl:
                'https://coin98.s3.ap-southeast-1.amazonaws.com/Logo/c982024.png',
              aboutUrl:
                'https://chromewebstore.google.com/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
              jsBridgeKey: 'coin98',
              platforms: ['chrome', 'firefox', 'android', 'ios'],
            },
          ],
        }}
        actionsConfiguration={{
          twaReturnUrl: 'https://t.me/tc_twa_demo_bot/start',
        }}
      >
        <div className="app">
          <Header />
          <TxForm />
          {/* <TonProofDemo /> */}
          <Footer />
        </div>
      </TonConnectUIProvider>
    </div>
  );
}

export default App;
