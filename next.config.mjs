/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
    domains: ['firebasestorage.googleapis.com'], //允許image元件 使用外部URL
    },
};

export default nextConfig;
