import classNames from "classnames";
import React from "react";

const Dashboard = ({ runners, handleBuyTicker, showPosition }) => {
  return (
    <div>
      {runners && runners.length > 0
        ? runners.map((item) => {
            return (
              <div
                className={classNames(
                  `${!showPosition ? "col-3" : "col-6"}`,
                  "my-5"
                )}
                onClick={(e) => handleBuyTicker(e, item.ticker)}
              >
                <div className="card p-0">
                  <div className="card-body">
                    <h3
                      className={
                        item?.upgrade > 0
                          ? "upgrade"
                          : item?.news_flag
                          ? "newsFlag"
                          : "text-light"
                      }
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
              </div>
            );
          })
        : null}
    </div>
  );
};

export default Dashboard;
