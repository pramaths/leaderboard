import React, { useState, useEffect } from "react";
import "./mobilestyle.css";
import search from "../assests/search.svg";
import copy from "../assests/copy.svg";
import copywhite from "../assests/copywhite.svg";
import bigInt from "big-integer";
import { getUserTradeStats, winloss } from "./data";
import r1 from "../assests/1.svg";
import r3 from "../assests/3.svg";
import rank3 from "../assests/rank3.svg"
function formatHexWithDots(hexString) {
  const first5 = hexString.substring(0, 5);
  const last5 = hexString.substring(hexString.length - 5);
  const middleDots = "...";

  return `${first5}${middleDots}${last5}`;
}
const DivWFull = () => {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const usersPerPage = 10;
  const previousClass = currentPage === 1 ? "previous" : "previous";
  const nextClass = "next";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userTradeData = await getUserTradeStats();
        const aggregatedDataWithWinLoss = await winloss(userTradeData);
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

  const copyToClipboard = (text) => {
    const textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
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
  const filteredUsers = userData.filter((user) =>
    user.account.toLowerCase().includes(searchInput.toLowerCase())
  );

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="leaderboard-contains">
      <div className="leaderboard">
        <div>
          <h1> Leaderboard</h1>
          <p> see where you fit against</p>
        </div>
        <div>
          <div className="mobilesearch">
            <div className="searchicon">
              <img className="vector" alt="Vector" src={search} />
            </div>
            <input
              type="text"
              className="text-wrapper"
              placeholder="Search by address or profile name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)} 
            />
          </div>
          <div className="mob-container">
            {currentUsers.map((user, index) => (
              <div className="mob-box">
                <div className="mobile-box">
                  <button
                    className={`box-header ${
                      user.rank< 4 ? "top-rank-header" : ""
                    }`}
                  >
                    <div className="box-head">
                      <div className="box-header">
                        <div className="rank">
                          Rank {user.rank}
                          {user.rank === 1 ? (
                            <img src={r1} alt="Rank 1" />
                          ) : user.rank === 2 ? (
                            <img src={r3} alt="Rank 2" />
                          ) : user.rank === 3 ? (
                            <img src={rank3} alt="Rank 3" />
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="address">
                        <p className={user.rank < 4 ? "black-text" : ""}>
    ({formatHexWithDots(user.account)})
  </p>
                          {index +indexOfFirstUser< 3 ? (
                            <>
                              <button
                                className="black-button"
                                onClick={() => copyToClipboard(user.account)}
                              >
                                <img src={copywhite} alt="copy" />
                              </button>
                            </>
                          ) : (
                            <button
                              className="white-button"
                              onClick={() => copyToClipboard(user.account)}
                            >
                              <img src={copy} alt="copy" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                  <div className="mob-data">
                    <hr className="line" />
                    <div className="box">
                      <div className="box-data">
                        <div className="data">
                          <div className="data-c">
                            <div className="m-heads">Trading Volume</div>
                            <div className="dyn-data">
                              {" "}
                              $ {formatNumber(user.marginVolume, 2)}{" "}
                            </div>
                          </div>
                          <div className="data-c">
                            <div className="m-heads">W-L weekly</div>
                            <div className="dyn-data">
                              {" "}
                              {user.winCount}-{user.lossCount}
                            </div>
                          </div>
                          <div className="data-c">
                            <div className="m-heads">Biggest_Win</div>
                            <div className="dyn-data">
                              {" "}
                              $ {formatNumber(user.maxWin, 2)}{" "}
                            </div>
                          </div>
                          <div className="data-c">
                            <div className="m-heads">PnL</div>
                            <div className="dyn-data">
                              <div
                                className={`pnlcol ${
                                  user.netPnl < 0 ? "red-text" : "green-text"
                                }`}
                              >
                                $ {formatNumber(user.netPnl, 2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pagination">
          <div className="page">
            {" "}
            Page {currentPage} to {userData.length / 10}
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
  );
};
export default DivWFull;
