import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='ja'>
      <Head />
      {/* Google検索から除外 */}
      <meta name='robots' content='noindex' />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
