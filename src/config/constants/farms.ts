import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'MiniDoge-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x045b8c3B5E60780E3B42348BAF39F2e0F3D7ffe5',
    },
    token: tokens.minidoge,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 1,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: tokens.busd,
    quoteToken: tokens.wbnb,
  },
]

export default farms
