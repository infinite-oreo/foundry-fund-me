/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // wagmi/viem/RainbowKit 的 Node.js 依赖在 webpack 中需要外置
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    // MetaMask SDK 在浏览器端引入了 React Native 依赖，用空模块替代
    config.resolve.alias['@react-native-async-storage/async-storage'] = false
    return config
  },
}

export default nextConfig
