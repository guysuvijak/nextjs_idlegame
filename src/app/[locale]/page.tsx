'use client'
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';

export default function Index() {
    const t = useTranslations('Index');
    return (
        <div>
            <h1>{t('title')}</h1>
            <div className='flex'>
                <Link href='/game' locale='en'><div className='bg-orange-600 w-[150px] mr-5 text-center text-white'>{t('button_start_en')}</div></Link>
                <Link href='/game' locale='th'><div className='bg-orange-600 w-[150px] text-center text-white'>{t('button_start_th')}</div></Link>
            </div>
        </div>
    )
}