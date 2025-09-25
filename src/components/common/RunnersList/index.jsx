import React from "react";
import style from "./style.module.css";

const RunnersList = ({ runners, buyList, handleBuyTicker }) => {
  return (
    <>
      <div className="watchlist">
        {runners && runners.length > 0 ? (
          <ul>
            {runners.map((item, i) => {
              return (
                <li className={style.tickers} key={i}>
                  <div
                    className={
                      item?.upgrade > 0
                        ? "upgrade"
                        : item?.news_flag
                        ? "newsFlag"
                        : ""
                    }
                  >
                    {item?.ticker}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => handleBuyTicker(e, item?.ticker)}
                  >
                    {buyList.includes(item?.ticker) ? "Buy More" : "Buy"}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </>
  );
};

export default RunnersList;
