import SiteFooter from '@/components/SiteFooter';
import { AppConfig } from '@/config/AppConfig';
import '@/styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ja'>
      <head>
        {AppConfig.NO_INDEX && <meta name='robots' content='noindex' />}
      </head>
      <body>
        <main className='min-h-[95dvh]'>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
