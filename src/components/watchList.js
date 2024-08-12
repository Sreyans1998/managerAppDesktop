import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import React from "react";

const Watchlist = ({ watchList, setWatchList, buyList, handleBuyTicker }) => {
  const handleWatchlistOpen = (watchlistName) => {
    try {
      setWatchList(
        watchList?.map((element) => {
          if (element?.watchlistName === watchlistName) {
            element["isActive"] = !element?.isActive;
          } else {
            element["isActive"] = false;
          }
          return element;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="py-3 watchlist">
        {watchList && watchList.length > 0
          ? watchList.map((element, index) => {
              return (
                <>
                  <div className="watchlistName" key={index}>
                    <span>{element?.watchlistName}</span>
                    <span
                      className="d-flex"
                      role="button"
                      onClick={(e) => {
                        handleWatchlistOpen(element?.watchlistName);
                      }}
                    >
                      {element.isActive ? (
                        <ExpandMoreIcon />
                      ) : (
                        <KeyboardArrowLeftIcon />
                      )}
                    </span>
                  </div>
                  {element.isActive &&
                  element?.watchlistData &&
                  element?.watchlistData.length > 0 ? (
                    <ul>
                      {element?.watchlistData.map((item, i) => {
                        return (
                          <li className="d-flex justify-content-between" key={i}>
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
                              className="btnPrimary"
                              onClick={(e) => handleBuyTicker(e, item?.ticker)}
                            >
                              {buyList.includes(item?.ticker)
                                ? "Buy More"
                                : "Buy"}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </>
              );
            })
          : null}
      </div>
    </>
  );
};

export default Watchlist;
