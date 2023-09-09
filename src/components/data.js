import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const ACTIONS_APIURL =
  "https://api.thegraph.com/subgraphs/name/danielsmith0630/fxdx-optimism-actions";

const userTradesStatsQuery = gql`
  query UserTradesStats {
    userTradesStats(where: { period: "total" }, orderBy: marginVolume, orderDirection: desc) {
      account
      netPnl
      marginVolume
      swapVolume
      marginFees
      period
      timestamp
    }
  }
`;

const userTradeDetailsQuery = gql`
  query UserTradeDetails($account: String!) {
    userTradesStats(where: { account: $account, period: "weekly" }) {
      netPnl
    }
  }
`;

const tradeStatsClient = new ApolloClient({
  uri: ACTIONS_APIURL,
  cache: new InMemoryCache(),
});

export const getUserTradeStats = async () => {
  try {
    const data = await tradeStatsClient.query({
      query: userTradesStatsQuery,
    });
    
    const allUsersData = data.data.userTradesStats;
    const aggregatedData = allUsersData.reduce((result, user) => {
      const userAccount = user.account;
      const existingUser = result.find((item) => item.account === userAccount);

      if (existingUser) {
        existingUser.netPnl += parseFloat(user.netPnl);
      } else {
        result.push({
          account: userAccount,
          netPnl: parseFloat(user.netPnl),
          swapVolume: parseFloat(user.swapVolume),
          marginFees: parseFloat(user.marginFees),
          marginVolume: parseFloat(user.marginVolume),
        });
      }
      return result;
    }, []);
    
    console.log(aggregatedData);
    const aggregatedUserData = aggregatedData.map((user) => ({
      account: user.account,
      ...user,
    })).sort((a, b) => b.netPnl - a.netPnl);
    
    return aggregatedUserData;
  } catch (err) {
    console.log("Error fetching data: ", err);
  }
};

export const winloss = async (aggregatedData) => {
  try {
    const data = aggregatedData.map(async (user) => {
      const wl = await tradeStatsClient.query({
        query: userTradeDetailsQuery,
        variables: { account: user.account },
      });
      
      let winCount = 0;
      let lossCount = 0;
      let maxWin = 0;

      wl.data.userTradesStats.forEach((trade) => {
        const pnl = parseFloat(trade.netPnl);
        if (pnl > 0) {
          winCount += 1;
          maxWin = Math.max(maxWin, pnl);
        } else if (pnl < 0) {
          lossCount += 1;
        }
      });

      user.winCount = winCount;
      user.lossCount = lossCount;
      user.maxWin = maxWin;
    });

    await Promise.all(data);
    
    console.log("Updated aggregated data: ", aggregatedData);
    
    return aggregatedData;
  } catch (error) {
    console.error("Error fetching win/loss data: ", error);
  }
};
