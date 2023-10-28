import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({locale}: any) => ({
    messages: (await import(`./src/messages/${locale}.json`)).default
}));