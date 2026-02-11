export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  chainId: number
  logoURI?: string
}

export const TOKENS: Token[] = [
  // Sepolia tokens
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    chainId: 11155111,
  },
  {
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    chainId: 11155111,
  },
  {
    address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    chainId: 11155111,
  },
  
  // Amoy (Polygon) tokens
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    chainId: 80002,
  },
  {
    address: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    chainId: 80002,
  },
  {
    address: '0x2c852e740B62308c46DD29B982FBb650D063Bd07',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    chainId: 80002,
  },
]

export function getTokensByChain(chainId: number): Token[] {
  return TOKENS.filter(token => token.chainId === chainId)
}

export function getTokenBySymbolAndChain(symbol: string, chainId: number): Token | undefined {
  return TOKENS.find(token => token.symbol === symbol && token.chainId === chainId)
}

export function getTokenByAddress(address: string, chainId: number): Token | undefined {
  return TOKENS.find(
    token => token.address.toLowerCase() === address.toLowerCase() && token.chainId === chainId
  )
}