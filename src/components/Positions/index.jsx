import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import style from "./style.module.css";
import classNames from "classnames";

const Positions = ({
  positions,
  setPositions,
  showPosition,
  setShowPosition,
  toastCall,
  setApiCallParams,
  setOperations,
  operations,
}) => {
  const handleShowMore = (e, symbol) => {
    try {
      e.preventDefault();
      setPositions(
        positions.map((item) => {
          if (item.symbol === symbol) {
            item.isActive = !item.isActive;
          }
          return item;
        })
      );
      e.preventDefault();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddStop = async (e, symbol, price) => {
    try {
      e.preventDefault();
      toastCall("Process initiated for add stop order.", "success");
      setOperations((prev) => [
        ...prev,
        {
          ticker: symbol,
          price: price,
          OperationType: "ADD_STOP",
          status: "Pending",
          id: operations.length,
        },
      ]);
      setApiCallParams((previousValue) => [
        ...previousValue,
        {
          type: "ADD_STOP",
          payload: {
            symbol,
            stop_price: parseFloat(price),
          },
          id: operations.length,
        },
      ]);
      let tempPositions = positions.map((item) => {
        if (item?.symbol === symbol) {
          item["stopPrice"] = "";
        }
        return item;
      });
      setPositions(tempPositions);
    } catch (error) {
      toastCall(error.message, "error");
      console.log(error);
    }
  };

  const handleCancelStop = async (e, symbol) => {
    try {
      e.preventDefault();
      toastCall("Process initiated for cancel stop order.", "success");
      setOperations((prev) => [
        ...prev,
        {
          ticker: symbol,
          price: "-",
          OperationType: "CANCEL_STOP",
          status: "Pending",
          id: operations.length,
        },
      ]);
      setApiCallParams((previousValue) => [
        ...previousValue,
        {
          type: "CANCEL_STOP",
          payload: {
            symbol,
          },
          id: operations.length,
        },
      ]);
    } catch (error) {
      toastCall(error.message, "error");
    }
  };

  const handleAddMIT = async (e, symbol, price) => {
    try {
      e.preventDefault();
      toastCall("Process initiated for add mit order.", "success");
      setOperations((prev) => [
        ...prev,
        {
          ticker: symbol,
          price: price,
          OperationType: "ADD_MIT",
          status: "Pending",
          id: operations.length,
        },
      ]);
      setApiCallParams((previousValue) => [
        ...previousValue,
        {
          type: "ADD_MIT",
          payload: {
            symbol,
            price: parseFloat(price),
          },
          id: operations.length,
        },
      ]);
      let tempPositions = positions.map((item) => {
        if (item?.symbol === symbol) {
          item["MITPrice"] = "";
        }
        return item;
      });
      setPositions(tempPositions);
    } catch (error) {
      toastCall(error.message, "error");
    }
  };

  const handleCancelMIT = async (e, symbol) => {
    try {
      e.preventDefault();
      toastCall("Process initiated for cancel mit order.", "success");
      setOperations((prev) => [
        ...prev,
        {
          ticker: symbol,
          price: "-",
          OperationType: "CANCEL_MIT",
          status: "Pending",
          id: operations.length,
        },
      ]);
      setApiCallParams((previousValue) => [
        ...previousValue,
        {
          type: "CANCEL_MIT",
          payload: {
            symbol,
          },
          id: operations.length,
        },
      ]);
    } catch (error) {
      toastCall(error.message, "error");
    }
  };

  const handleOnChangeAddStop = async (e, symbol) => {
    try {
      e.preventDefault();
      let tempPositions = positions.map((item) => {
        if (item?.symbol === symbol) {
          item["stopPrice"] = e.target.value;
        }
        return item;
      });
      setPositions(tempPositions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChangeAddMIT = async (e, symbol) => {
    try {
      e.preventDefault();
      let tempPositions = positions.map((item) => {
        if (item?.symbol === symbol) {
          item["MITPrice"] = e.target.value;
        }
        return item;
      });
      setPositions(tempPositions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAnalystChange = async (e, symbol) => {
    try {
      e.preventDefault();
      // console.log({ value: e.target.value })
      // let tempPositions = positions.map((item) => {
      //     if (item.symbol === symbol) {
      //         item["activeAccountId"] = item.analyst.findIndex((element) => element?.nickname === e.target.value);
      //     }
      //     return item;
      // });
      // setPositions(tempPositions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSell = async (e, symbol, percentage) => {
    try {
      e.preventDefault();
      toastCall("Process initiated for sell order.", "success");
      setOperations((prev) => [
        ...prev,
        {
          ticker: symbol,
          price: "-",
          OperationType: "SELL",
          status: "Pending",
          id: operations.length,
        },
      ]);
      setApiCallParams((previousValue) => [
        ...previousValue,
        {
          type: "SELL",
          payload: {
            symbol,
            percentage: parseInt(percentage),
          },
          id: operations.length,
        },
      ]);
    } catch (error) {
      toastCall(error.message, "error");
    }
  };

  const handleSellAll = async () => {
    try {
      toastCall("Process initiated for sell all order.", "success");
      setOperations((prev) => [
        ...prev,
        {
          ticker: "All-ticker",
          price: "-",
          OperationType: "SEL_ALL",
          status: "Pending",
          id: operations.length,
        },
      ]);
      setApiCallParams((previousValue) => [
        ...previousValue,
        {
          type: "SELL_ALL",
          id: operations.length,
        },
      ]);
    } catch (error) {
      console.log(error);
      toastCall(error.message, "error");
    }
  };

  return (
    <div className={style.content}>
      <span
        className={style.sliderButton}
        onClick={() => setShowPosition(!showPosition)}
      >
        {showPosition ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />}
      </span>
      <div className={style.content}>
        <div className={style.headingbar}>
          POSITION
          <button className="btn btn-error" onClick={handleSellAll}>
            SELL ALL
          </button>
        </div>
        {showPosition ? (
          <div className={style.quickPosition}>
            <ul className={style.positions}>
              {positions && positions.length > 0
                ? positions.map((item, index) => {
                    return (
                      <li className={style.tickerContent} key={index}>
                        <span>{item.symbol}</span>
                        <div className={style.tickerAction}>
                          <button
                            className="btn btn-error-graditant"
                            onClick={(e) => handleSell(e, item?.symbol, 20)}
                          >
                            20%
                          </button>
                          <button
                            className="btn btn-error-graditant"
                            onClick={(e) => handleSell(e, item?.symbol, 80)}
                          >
                            80%
                          </button>
                          <button
                            className="btn btn-error-graditant"
                            onClick={(e) => handleSell(e, item?.symbol, 100)}
                          >
                            100%
                          </button>
                        </div>
                      </li>
                    );
                  })
                : null}
            </ul>
          </div>
        ) : (
          <ul className={style.positions}>
            {positions && positions.length > 0
              ? positions.map((element, index) => {
                  return (
                    <>
                      <li key={index} className={style.tickerContent}>
                        <div className={style.tickerName}>
                          {element?.symbol}
                          <span
                            className="d-flex ms-3"
                            onClick={(e) => handleShowMore(e, element?.symbol)}
                          >
                            {element?.isActive ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </span>
                        </div>
                        <div className={style.tickerFilds}>
                          <input
                            type="text"
                            placeholder="Stop price"
                            title="Stop Price"
                            className="tickerInputs ms-4"
                            name="stopPrice"
                            value={element?.stopPrice}
                            onChange={(e) =>
                              handleOnChangeAddStop(e, element?.symbol)
                            }
                          />
                          <button
                            className="btn btn-error"
                            onClick={(e) =>
                              handleAddStop(
                                e,
                                element?.symbol,
                                element?.stopPrice
                              )
                            }
                          >
                            Stop
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={(e) =>
                              handleCancelStop(e, element?.symbol)
                            }
                          >
                            CANCEL
                          </button>
                        </div>
                        <div className={style.tickerFilds}>
                          <input
                            type="text"
                            placeholder="MIT price"
                            title="MIT Price"
                            className="tickerInputs ms-4"
                            name="MITPrice"
                            value={element?.MITPrice}
                            onChange={(e) =>
                              handleOnChangeAddMIT(e, element?.symbol)
                            }
                          />
                          <button
                            className="btn btn-success"
                            onClick={(e) =>
                              handleAddMIT(
                                e,
                                element?.symbol,
                                element?.MITPrice
                              )
                            }
                          >
                            MIT
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={(e) => handleCancelMIT(e, element?.symbol)}
                          >
                            CANCEL
                          </button>
                        </div>
                        <div className={style.tickerAction}>
                          <button
                            className="btn btn-error-graditant"
                            onClick={(e) => handleSell(e, element?.symbol, 20)}
                          >
                            20%
                          </button>
                          <button
                            className="btn btn-error-graditant"
                            onClick={(e) => handleSell(e, element?.symbol, 80)}
                          >
                            80%
                          </button>
                          <button
                            className="btn btn-error-graditant"
                            onClick={(e) => handleSell(e, element?.symbol, 100)}
                          >
                            100%
                          </button>
                        </div>
                      </li>
                      <li>
                        {element.isActive ? (
                          <div className={style.tickerContent}>
                            <div className={style.analystContent}>
                              <div>
                                Analyst:{" "}
                                <select
                                  className={style.selectInput}
                                  value=""
                                  onChange={(e) =>
                                    handleAnalystChange(e, element?.symbol)
                                  }
                                >
                                  {element?.analyst &&
                                  element?.analyst.length > 0
                                    ? element?.analyst.map((item) => {
                                        return (
                                          <option value={item?.nickname}>
                                            {item?.nickname}
                                          </option>
                                        );
                                      })
                                    : null}
                                </select>
                              </div>
                              <div>
                                Entry Price: {element?.accounts[0]?.entry}
                              </div>
                            </div>
                            {element?.accounts && element?.accounts.length > 0
                              ? element?.accounts.map((item) => {
                                  return (
                                    <>
                                      <div className={style.analystContent}>
                                        <span className={classNames(style.fontHighlight, style.fontBorder)}>
                                          {item?.nickname}: {item?.position}
                                        </span>
                                        <span className={style.fontHighlight}>
                                          Stop Price:{" "}
                                          {parseFloat(
                                            element?.orderStopPrice
                                          ).toFixed(2)}
                                        </span>
                                        <span className={style.fontHighlight}>
                                          MIT Price:{" "}
                                          {parseFloat(
                                            element?.orderMITPrice
                                          ).toFixed(2)}
                                        </span>
                                      </div>
                                    </>
                                  );
                                })
                              : null}
                          </div>
                        ) : null}
                      </li>
                    </>
                  );
                })
              : null}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Positions;
