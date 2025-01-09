import classNames from "classnames";
import React from "react";
import style from "./style.module.css";
import TweetSection from "../../common/Tweets";

const Runners = ({ runners, handleBuyTicker, showPosition }) => {
  return (
    <div className={classNames(showPosition ? style.contanier : "")}>
      <div className={classNames(style.w50, !showPosition ? style.dNone : "")}>
        <TweetSection />
      </div>
      <div className={classNames(style.wrapper, showPosition ? style.w50 : "")}>
        {runners && runners.length > 0
          ? runners.map((item) => {
              return (
                <div
                  className={classNames(
                    style.runnersCard,
                    item?.news_flag > 0 ? style.bgNewsFlag : "",
                    item.ticker === "BAC" ? style.upgrade : "",
                  )}
                  onClick={(e) => handleBuyTicker(e, item.ticker)}
                >
                  <div className={style.runnersCardBody}>
                    <h3
                    // className={item?.upgrade > 0 ? style.upgrade : ""}
                    >
                      {item.ticker}
                    </h3>
                    <h6 className="w-100 text-center text-light">
                      Delta: {item?.delta_avat_30d}
                    </h6>
                    <h6 className="w-100 text-center text-light">
                      Date: {item?.percent_from_open}%
                    </h6>
                    <h6 className="w-100 text-center text-light">
                      Data Time: {item?.data_time}
                    </h6>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default Runners;
