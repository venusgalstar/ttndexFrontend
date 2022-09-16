import { useState, useEffect } from "react";
import { useFarms, usePriceCakeBusd } from "state/hooks";
import BigNumber from "bignumber.js";
import { getFarmApr } from "utils/apr";
import { Farm } from "state/types";

export interface FarmWithApr extends Farm {
  apr: number
}

const useFarmsWithApr = () => {
  const { data: farms } = useFarms();
  const [farmsWithApr, setFarmsWithApr] = useState<FarmWithApr[]>([]);
  const cakePrice = usePriceCakeBusd();

  useEffect(() => {
    // const farmsToDisplayWithAPR = farms.map((farm) => {
    //   if (!farm.lpTotalInQuoteToken || !farm.quoteToken.busdPrice) {
    //     return {...farm, apr: undefined}
    //   }
    //   const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.busdPrice)
    //   console.log("[DAVID] useFarmsWithApr :: ", farm, cakePrice.toString(), totalLiquidity.toString());
    //   const apr = getFarmApr(new BigNumber(farm.poolWeight), cakePrice, totalLiquidity);
      
    //   return { ...farm, apr}
    // })

    // setFarmsWithApr(farmsToDisplayWithAPR);
  }, [farms, cakePrice]);
  return farmsWithApr;
}

export default useFarmsWithApr;
