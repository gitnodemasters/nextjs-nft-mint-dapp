// For Ethereum, use the Infura endpoints
export default function rpcConfig(infuraKey?: string) {
  return process.env.NODE_ENV === 'production'
    ? 'https://bsc-dataseed.binance.org/' // `https://mainnet.infura.io/v3/${infuraKey}`
    : 'https://data-seed-prebsc-1-s1.binance.org:8545'; // `https://rinkeby.infura.io/v3/${infuraKey}`
}
