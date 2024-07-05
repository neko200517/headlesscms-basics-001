import { Html, Head, Main, NextScript } from 'next/document';
import { AppConfig } from '@/config/const';

export default function Document() {
  return (
    <Html lang='ja'>
      <Head />
      {/* Google検索から除外 */}
      {AppConfig.NO_INDEX && <meta name='robots' content='noindex' />}
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
