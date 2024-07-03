import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";

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
          OperationType: "ADD_STOP",
          status: "Pending",
          id: operations.length,
          payload: JSON.stringify({
            symbol,
            stop_price: parseFloat(price),
          }),
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
          OperationType: "CANCEL_STOP",
          status: "Pending",
          id: operations.length,
          payload: JSON.stringify({
            symbol,
          }),
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
          OperationType: "ADD_MIT",
          status: "Pending",
          id: operations.length,
          payload: JSON.stringify({
            symbol,
            price: parseFloat(price),
          }),
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
          OperationType: "CANCEL_MIT",
          status: "Pending",
          id: operations.length,
          payload: JSON.stringify({
            symbol,
          }),
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
          OperationType: "SELL",
          status: "Pending",
          id: operations.length,
          payload: JSON.stringify({
            symbol,
            percentage: parseInt(percentage),
          }),
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
          OperationType: "SEL_ALL",
          status: "Pending",
          id: operations.length,
          payload: JSON.stringify({}),
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
    <div className="postionsContent">
      <span
        className="sliderButton"
        onClick={() => setShowPosition(!showPosition)}
      >
        {showPosition ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />}
      </span>
      <div className="w-100">
        <div className="headingbar">POSITION</div>
        <div className="tabActions w-100 mt-2 d-flex justify-content-end px-2">
          <button
            className="btn btn-danger btn-tabAction"
            onClick={handleSellAll}
          >
            SELL ALL
          </button>
        </div>
        {!showPosition ? (
          <div className="quickPosition">
            <ul className="positions">
              {positions && positions.length > 0
                ? positions.map((item, index) => {
                    return (
                      <li className="tickerContent" key={index}>
                        <span>{item.symbol}</span>
                        <div className="px-1">
                          <button
                            className="btn-error-graditant"
                            onClick={(e) => handleSell(e, item?.symbol, 20)}
                          >
                            20%
                          </button>
                          <button
                            className="btn-error-graditant"
                            onClick={(e) => handleSell(e, item?.symbol, 80)}
                          >
                            80%
                          </button>
                          <button
                            className="btn-error"
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
          <ul className="positions">
            {positions && positions.length > 0
              ? positions.map((element, index) => {
                  return (
                    <li key={index}>
                      <div className="tickerContent row mx-0 my-1">
                        <div className="tickerName col-1">
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
                        <div className="tickerFields col-4">
                          <div className="d-flex justify-content-center align-items-center">
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
                              className="btn-error"
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
                              className="btnWarning"
                              onClick={(e) =>
                                handleCancelStop(e, element?.symbol)
                              }
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                        <div className="tickerFields col-4">
                          <div className="d-flex justify-content-center align-items-center">
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
                              className="btnPrimary"
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
                              className="btnWarning"
                              onClick={(e) =>
                                handleCancelMIT(e, element?.symbol)
                              }
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                        <div className="col-3 my-0">
                          <button
                            className="btn-error-graditant"
                            onClick={(e) => handleSell(e, element?.symbol, 20)}
                          >
                            20%
                          </button>
                          <button
                            className="btn-error-graditant"
                            onClick={(e) => handleSell(e, element?.symbol, 80)}
                          >
                            80%
                          </button>
                          <button
                            className="btn-error"
                            onClick={(e) => handleSell(e, element?.symbol, 100)}
                          >
                            100%
                          </button>
                        </div>
                      </div>
                      {element.isActive ? (
                        <div className="tickerSubContent">
                          <div className="d-flex my-2 mx-0">
                            <div className="d-flex mx-2">
                              Analyst:{" "}
                              <select
                                className="selectInput ms-2"
                                value=""
                                onChange={(e) =>
                                  handleAnalystChange(e, element?.symbol)
                                }
                              >
                                {element?.analyst && element?.analyst.length > 0
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
                            <div className="d-flex mx-2">
                              Entry Price: {element?.accounts[0]?.entry}
                            </div>
                          </div>
                          <div className="d-flex">
                            {element?.accounts && element?.accounts.length > 0
                              ? element?.accounts.map((item) => {
                                  return (
                                    <>
                                      <div className="m-2 fw-bolder d-grid">
                                        {item?.nickname}: {item?.position}
                                        <span className="fw-normal">
                                          Stop Price:{" "}
                                          {parseFloat(
                                            element?.orderStopPrice
                                          ).toFixed(2)}
                                        </span>
                                        <span className="fw-normal">
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
                        </div>
                      ) : null}
                    </li>
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
