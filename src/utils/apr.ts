import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, CAKE_PER_YEAR } from 'config'
import lpAprs from 'config/constants/lpAprs.json'

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param tokenPerBlock Amount of new miniDoge allocated to the farms for each new block
 * @param miniDogePriceUsd MiniDOGE price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  tokenPerBlock: BigNumber,
  miniDogePriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
): { miniDogeRewardsApr: number; lpRewardsApr: number } => {
  // const yearlyMiniDogeRewardAllocation = CAKE_PER_YEAR.times(poolWeight)
  const yearlyMiniDogeRewardAllocation = tokenPerBlock.times(BLOCKS_PER_YEAR).times(poolWeight)
  const miniDogeRewardsApr = yearlyMiniDogeRewardAllocation.times(miniDogePriceUsd).div(poolLiquidityUsd).times(100)
  let miniDogeRewardsAprAsNumber = null
  if (!miniDogeRewardsApr.isNaN() && miniDogeRewardsApr.isFinite()) {
    miniDogeRewardsAprAsNumber = miniDogeRewardsApr.toNumber()
  }
  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
  return { miniDogeRewardsApr: miniDogeRewardsAprAsNumber, lpRewardsApr }
}

export default null
