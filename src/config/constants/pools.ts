import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.minidoge,
    earningToken: tokens.bnb,
    contractAddress: {
      97: '',
      56: '0xff734d9E7BDEb799672B81461180303D4816BE7B',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.0000005',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 1,
    stakingToken: tokens.minidoge,
    earningToken: tokens.busd,
    contractAddress: {
      97: '',
      56: '0x2126B3ECD36d8d0Ce4c9C074966C70C1f30616aa',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.00025',
    sortOrder: 1,
    isFinished: false,
  },
]

export default pools
