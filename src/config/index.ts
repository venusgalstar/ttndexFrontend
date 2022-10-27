import BigNumber from 'bignumber.js/bignumber'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const BSC_BLOCK_TIME = 3

// CAKE_PER_BLOCK details
// 40 TTNP is minted per block
// 20 TTNP per block is sent to Burn pool (A farm just for burning cake)
// 10 TTNP per block goes to TTNP syrup pool
// 10 TTNP per block goes to Yield farms and lottery
// TTNP_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// TTNP/Block in src/views/Home/components/CakeStats.tsx = 20 (40 - Amount sent to burn pool)

export const ADMIN_ACCOUNT = '0x2Cc4467e7a94D55497B704a0acd90ACd1BF9A5af'
export const CAKE_PER_BLOCK = new BigNumber(5)
export const BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365) // 10512000
export const CAKE_PER_YEAR = CAKE_PER_BLOCK.times(BLOCKS_PER_YEAR)
export const BASE_URL = 'https://ttndex.com'
export const BASE_EXCHANGE_URL = 'https://dex.ttndex.com'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_EXCHANGE_URL}/#/add`
export const BASE_LIQUIDITY_POOL_URL = `${BASE_EXCHANGE_URL}/#/pool`
export const BASE_BSC_SCAN_URL = 'https://bscscan.com'
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 2000000
export const DEFAULT_GAS_PRICE = 5
export const TESTNET_CHAIN_ID = '97'
export const MAINNET_CHAIN_ID = '56'
