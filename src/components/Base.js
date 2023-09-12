import React, { useEffect, useState } from "react";
import { baseUserTradeStats,basewinloss } from "./data";
import bigInt from "big-integer";
import "./leaderboard.css";
import Mobile from "./Mobileleaderboard";
import search from "../assests/search.svg";
import rank3 from "../assests/rank3.svg";
import rank1 from "../assests/rank1.svg";
import r3 from "../assests/3.svg";
import { useMediaQuery } from "react-responsive";

function formatHexWithDots(hexString) {
  const first5 = hexString.substring(0, 5);
  const last5 = hexString.substring(hexString.length - 5);
  const middleDots = "...";

  return `${first5}${middleDots}${last5}`;
}

const Base= () => {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [pnlSortOrder, setPnlSortOrder] = useState("asc");

  const desktop = 15;
  const bigscreen = 20;
  const bigscreenbreak = 1600;
  const isDesktop = useMediaQuery({ minWidth: bigscreenbreak });
  const usersPerPage = isDesktop ? bigscreen : desktop;
  const previousClass = currentPage === 1 ? "previous" : "previous";
  const nextClass = "next";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userTradeData = await baseUserTradeStats();
        const aggregatedDataWithWinLoss = await basewinloss(userTradeData);
        for(let i=0;i<aggregatedDataWithWinLoss?.length;i++){
          aggregatedDataWithWinLoss[i].rank=i+1;
        }
        setUserData(aggregatedDataWithWinLoss);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const sortPnl = () => {
    if (pnlSortOrder === "asc") {
      setUserData((prevUserData) =>
        [...prevUserData].sort((a, b) => a.netPnl - b.netPnl)
      );
      setPnlSortOrder("desc");
    
    } else {
      setUserData((prevUserData) =>
        [...prevUserData].sort((a, b) => b.netPnl - a.netPnl)
      );
      setPnlSortOrder("asc");
    
    }
  };

  const formatNumber = (value, decimalPlaces) => {
    if (isNaN(value)) {
      return "N/A";
    }
    const bigValue = bigInt(value);
    const divisor = bigInt(10).pow(30);
    const result = bigValue.divide(divisor).toString();
    return parseFloat(result).toFixed(decimalPlaces);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const filteredUserData = userData.filter((user) =>
    user.account.toLowerCase().includes(searchInput.toLowerCase())
  );
  console.log("fftygtg",filteredUserData)
  console.log(filteredUserData.length)

  return (
    <div>
      <div className="leaderboard-container">
        <div className="table-container">
          {/* <div>
            <h1 className="leaderboard-heading">Leaderboard</h1>
            <p className="leaderboard-subtitle">
              See where you fit against the best
            </p>
          </div>
          <div className="routes">
            <div>BASE</div> <div>OPTIMISIM</div></div> */}
          <div className="table">
            <div className="mobilesearch">
              <div className="searchicon">
                <img className="vector" alt="Vector" src={search} />
              </div>
              <input
                type="text"
                className="text-wrapper"
                placeholder="Search by address"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="ulttable">
              <div className="table-row">
                <div className="table-header-rank">Rank</div>
                <div className="table-header-address">Address</div>
                <div className="table-header-tradingvolume">Trading Volume</div>
                <div className="table-header-wl">W-L-Weekly</div>
                <div className="table-header-biggest-win">Biggest Win</div>
                <div className="table-header-pnl" onClick={sortPnl}>
                  PNL
                  {pnlSortOrder === "asc" ? (
                    <span className="sort-icon">&#9650;</span>
                  ) : (
                    <span className="sort-icon">&#9660;</span>
                  )}
                </div>
              </div>
              <hr className="line"></hr>
              <div className="table-border">
                {filteredUserData
                  .slice(indexOfFirstUser, indexOfLastUser)
                  .map((user, index) => {
                    const rank =
                      pnlSortOrder === "asc"
                        ? user.rank
                        : filteredUserData.length - filteredUserData.findIndex((u) => u === user);
                    return (
                      <div key={index} className="user-row">
                        <div className="table-cell-rank">
                          {rank === 1 ? (
                            <img src={rank1} alt="Rank 1" />
                          ) : rank === 2 ? (
                            <img src={r3} alt="Rank 2" />
                          ) : rank === 3 ? (
                            <img src={rank3} alt="Rank 3" />
                          ) : (
                            rank
                          )}
                        </div>
                        <div className="table-cell-address">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path>
                          </svg>{" "}
                          {formatHexWithDots(user.account)}
                        </div>
                        <div className="table-cell-tradingvolume">
                          $ {formatNumber(user.marginVolume, 2)}
                        </div>
                        <div className="table-cell-wl">
                          <span style={{ color: "green" }}>{user.winCount}</span>
                          -
                          <span style={{ color: "red" }}>{user.lossCount}</span>
                        </div>
                        <div className="table-cell-biggest-win">
                          ${formatNumber(user.maxWin, 2)}
                        </div>
                        <div
                          className="table-cell-pnl"
                          style={{
                            color: user.netPnl >= 0 ? "#1cb360" : "red",
                          }}
                        >
                          ${formatNumber(user.netPnl, 2)}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="pagination">
            <div className="page">
              Page {currentPage} to{" "}
              {Math.ceil(filteredUserData.length / usersPerPage)}
            </div>

            <div className="nav-page">
              <div className="previousbutton">
                <button
                  className={previousClass}
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  disabled={currentPage === 1}
                >
                  &#8249;
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </div>
              <div className="nextbutton">
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={indexOfLastUser >= userData.length}
                >
                  Next
                </button>
                <button
                  className={nextClass}
                  onClick={() => {
                    if (indexOfLastUser < userData.length) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  disabled={indexOfLastUser >= userData.length}
                >
                  &#8250;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Mobile mode="base" />
    </div>
  );
};

export default Base;
