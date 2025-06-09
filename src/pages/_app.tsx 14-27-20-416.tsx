import '../styles/globals.css'; // Tailwind CSSをインポートするために必要
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;