const projectConfig = {
  nftName: 'NFTMembership',

  nftSymbol: 'NMS',

  maxSupply: 5025,

  maxMintAmountPerTxn: 10,

  mintCost: process.env.NODE_ENV === 'production' ? [1,2,3,4] : [0.08, 0.04, 0.02, 0.01],

  networkName:
    process.env.NODE_ENV === 'production'
      ? 'BSC Mainnet' // 'Ethereum Mainnet'
      : 'BSC Testnet', // 'Rinkeby Testnet'

  chainName: 'BNB', // 'ETH'

  chainId: process.env.NODE_ENV === 'production' ? 56 : 97, // Ethereum (1), Rinkeby (4)

  siteDomain: 'www.yourdomain.com',

  siteUrl:
    process.env.NODE_ENV === 'production'
      ? `https://your_site_domain`
      : 'http://localhost:3000',

  twitterUsername: '@your_twitter_handle',

  twitterUrl: 'https://twitter.com/your_twitter_handle',

  discordUrl: 'https://discord.gg/your_discord_invite_code',

  openseaCollectionUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://opensea.io/collection/your_opensea_collection_name'
      : 'https://testnets.opensea.io/collection/your_opensea_collection_name',

  contractAddress:
    process.env.NODE_ENV === 'production'
      ? '0xC46729e37156492BD9d2e3D1C2D0C3620e0573b0'
      : '0xC46729e37156492BD9d2e3D1C2D0C3620e0573b0',

  scanUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://bscscan.com/address/0xc46729e37156492bd9d2e3d1c2d0c3620e0573b0'
      : 'https://testnet.bscscan.com/address/0xc46729e37156492bd9d2e3d1c2d0c3620e0573b0',
  // 'https://etherscan.io/address/your_ethereum_contract_address'
  // 'https://rinkeby.etherscan.io/address/your_rinkeby_contract_address'

  adminWallet: "0x30811AB798c98d64bAaFDCa0767dEd9A1670B0F9",
};

export default projectConfig;
