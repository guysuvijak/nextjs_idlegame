/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['cdn.discordapp.com']
    }
};

const withNextIntl = require('next-intl/plugin') (
    './i18n.ts'
);

module.exports = withNextIntl(nextConfig);