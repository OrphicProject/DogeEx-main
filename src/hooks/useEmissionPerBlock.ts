import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getMasterchefContract } from 'utils/contractHelpers'
import useRefresh from './useRefresh'

export const useEmissionPerBlock = () => {
    const { slowRefresh } = useRefresh()
    const [emissionPerBlock, setEmissionPerBlock] = useState<BigNumber>()
  
    useEffect(() => {
      async function fetchEmissionPerBlock() {
        const masterChefContract = getMasterchefContract()
        const tokenperBlock = await masterChefContract.tokenPerBlock()
        setEmissionPerBlock(new BigNumber(tokenperBlock.toString()))
      }
  
      fetchEmissionPerBlock()
    }, [slowRefresh])
  
    return emissionPerBlock
  }
  
export default useEmissionPerBlock
