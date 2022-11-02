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
export const ADMIN_ACCOUNT1 = '0xAD30Ed907f394cF1E426c2F3Fa2Ba18B46aC6E66'
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

// BANK
export const REFERRAL_PERCENT = 1000
export const WITHDRAW_FEE = 100
export const DENOMINATOR = 10000
export const DENOMINATOR_PERCENT = 100

export const REF_PREFIX = `${BASE_URL}/?ref=`
export const DECIMALS = 'ether' // 18

// BSC TESTNET
// export const TREASURY = '0x84f8bF4bB72F4BE2C131a5F7B519b23958A76980'
// export const START_TIME = 1666300000
// export const EPOCH_LENGTH = 3600
// export const WITHDRAW_TIME = 600

// export const TTNBANK = '0xf5341377d0e6368C16097E31c27bd2283A9Cdc8E';

// export const RPC_URL = "https://data-seed-prebsc-2-s2.binance.org:8545"
// export const MAINNET = 97

// BSC MAINNET
export const TREASURY = '0x350c140f27291D4B4307451ac515eec81997A280'
export const START_TIME = 1669881600
export const EPOCH_LENGTH = 2592000
export const WITHDRAW_TIME = 86400

export const TTNBANK = '0x370D30b3f8437c2f40E203c1307e84a4BB6d672e';

export const RPC_URL = "https://bsc-dataseed1.binance.org"
export const MAINNET = 56
