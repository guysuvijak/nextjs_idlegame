import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next'

import Footer from './components/Footer';
import Navbar from './components/Navbar';

export const metadata: Metadata = {
    title: 'Pixture Idle',
    description: 'Idle Game',
}
 
export default async function LocaleLayout({children, params: {locale}}: any) {
    let messages;
    try {
        messages = (await import(`../../messages/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html lang={locale} style={{ height: '100%' }}>
            <body style={{backgroundColor: '#c4c9d0', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Navbar />
                    <div style={{ flex: '1' }}>
                        {children}
                    </div>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}