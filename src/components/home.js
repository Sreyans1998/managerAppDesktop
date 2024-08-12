import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addMIT,
  addStop,
  buyOrder,
  cancelMIT,
  cancelStop,
  getOrders,
  getPosition,
  getRunners,
  sellOrder,
} from "../api";
import Dashboard from "./dashboard";
import NavBar from "./navBar";
import Operations from "./operations";
import Positons from "./positions";
import Watchlist from "./watchList";
import Sentiments from "./sentiments";
import Upgrades from "./upgrades";

const Home = ({ setOperations, operations }) => {
  // const { ipcRenderer } = window?.electron;
  const [buyTicker, setBuyTicker] = useState("");
  const [buyQuantity, setBuyQuantity] = useState(1000);
  const [showPosition, setShowPosition] = useState(false);
  const [activeTab, setActiveTab] = useState("DASHBOARD");
  const [positions, setPositions] = useState([]);
  const [watchList, setWatchList] = useState([
    {
      watchlistName: "RUNNERS",
      watchlistData: [],
      isActive: false,
    },
  ]);
  const [runners, setRunners] = useState([]);
  const [buyList, setBuyList] = useState([]);
  const [isPendingRquest, setIsPendingRquest] = useState(false);
  const [apiCallParams, setApiCallParams] = useState([]);
  const [isRefreshCall, setIsRefreshCall] = useState(false);
  const [activeTabHeader, setActiveTabHeader] = useState("RUNNERS");
  const [isRenderingDataCall, setIsRenderingDataCall] = useState(false);

  const toastCall = (message, type) => {
    try {
      toast.dismiss();
      toast[`${type}`](message, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      // logFileCreation(error.message, error, "error");
    }
  };

  useEffect(() => {
    getRenderingData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(getAllRunners, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getOrdersDetails = async () => {
    try {
      if (apiCallParams.length <= 0 || !isPendingRquest) {
        const response = await getOrders();
        if (response.status === 200) {
          const data = await response.json();
          // logFileCreation(`Orders API call success.`, data, "success");
          if (data?.results.length > 0) {
            const orderData = data?.results[0];

            const apiCallFound = apiCallParams.find((element) => {
              if (element?.payload?.symbol === orderData?.ticker && element?.ordersCalls) {
                if (["BUY", "SELL"].includes(orderData?.order_type)) {
                  return element;
                } else if (
                  orderData?.type === "STOP_LOSS" &&
                  (orderData?.status === "cancelled" ||
                    orderData?.price === element?.payload?.stop_price)
                ) {
                  return element;
                } else if (
                  orderData?.type === "MIT" &&
                  (orderData?.status === "cancelled" ||
                    orderData?.price === element?.payload?.price)
                ) {
                  return element;
                } else {
                  return null;
                }
              } else {
                return null;
              }
            });
            if (apiCallFound) {
              let payload = {
                symbol: orderData?.ticker,
                order_id: orderData?.order_id,
              };
              switch (orderData?.order_type) {
                case "STOP_LOSS":
                  if (orderData?.status === "cancelled") {
                    setOperations((prev) => [
                      ...prev,
                      {
                        ticker: orderData?.ticker,
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
                        payload,
                        ordersCalls: true,
                        id: operations.length,
                      },
                    ]);
                  } else {
                    payload["stop_price"] = parseFloat(orderData.price);
                    setOperations((prev) => [
                      ...prev,
                      {
                        ticker: orderData?.ticker,
                        price: orderData.price,
                        OperationType: "ADD_STOP",
                        status: "Pending",
                        id: operations.length,
                      },
                    ]);
                    setApiCallParams((previousValue) => [
                      ...previousValue,
                      {
                        type: "ADD_STOP",
                        payload,
                        ordersCalls: true,
                        id: operations.length,
                      },
                    ]);
                  }
                  break;
                case "MIT":
                  if (orderData?.status === "cancelled") {
                    setOperations((prev) => [
                      ...prev,
                      {
                        ticker: orderData?.ticker,
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
                        payload,
                        ordersCalls: true,
                        id: operations.length,
                      },
                    ]);
                  } else {
                    payload["price"] = parseFloat(orderData.price);
                    setOperations((prev) => [
                      ...prev,
                      {
                        ticker: orderData?.ticker,
                        price: orderData?.price,
                        OperationType: "ADD_MIT",
                        status: "Pending",
                        id: operations.length,
                      },
                    ]);
                    setApiCallParams((previousValue) => [
                      ...previousValue,
                      {
                        type: "ADD_MIT",
                        payload,
                        ordersCalls: true,
                        id: operations.length,
                      },
                    ]);
                  }
                  break;
                case "BUY":
                  setOperations((prev) => [
                    ...prev,
                    {
                      ticker: orderData?.ticker,
                      price: "-",
                      OperationType: "BUY",
                      status: "Pending",
                      id: operations.length,
                    },
                  ]);
                  setApiCallParams((previousValue) => [
                    ...previousValue,
                    {
                      type: "BUY",
                      payload,
                      ordersCalls: true,
                      id: operations.length,
                    },
                  ]);
                  break;
                case "SELL":
                  setOperations((prev) => [
                    ...prev,
                    {
                      ticker: orderData?.ticker,
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
                      payload,
                      ordersCalls: true,
                      id: operations.length,
                    },
                  ]);
                  break;
                default:
                  break;
              }
            }
          }
        } else {
          // logFileCreation(response.message, response, "error");
        }
      }
    } catch (error) {
      // logFileCreation(error.message, error, "error");
    }
  };

  const apiCalls = async () => {
    try {
      if (apiCallParams.length > 0 && !isPendingRquest) {
        const apiData = apiCallParams[0];
        apiCallParams.shift();
        setIsPendingRquest(true);
        const apiPromise = new Promise(async (resolve) => {
          switch (apiData?.type) {
            case "ADD_STOP":
              return resolve(await addStop(apiData?.payload));
            case "CANCEL_STOP":
              return resolve(await cancelStop(apiData?.payload));
            case "ADD_MIT":
              return resolve(await addMIT(apiData?.payload));
            case "CANCEL_MIT":
              return resolve(await cancelMIT(apiData?.payload));
            case "BUY":
              return resolve(await buyOrder(apiData?.payload));
            case "SELL":
              return resolve(await sellOrder(apiData?.payload));
            case "POSITION":
              return resolve(await getPosition());
            default:
              break;
          }
        });
        // if (apiData.ordersCalls) {
        //   setIsPendingRquest(false);
        //   return;
        // }
        const response = await apiPromise;
        if (response.status === 200) {
          setIsPendingRquest(false);
          setOperations((prevOperations) =>
            prevOperations.map((element) => {
              if (apiData?.id === element?.id) {
                element.status = "Success";
              }
              return element;
            })
          );
          if (apiData?.type === "BUY") {
            setBuyList([...buyList, apiData?.payload?.symbol]);
          }
          const responseData = await response.json();
          // logFileCreation(
          //   `${apiData?.type} API call success.`,
          //   responseData,
          //   "success"
          // );
          if (apiData?.type === "POSITION") {
            setTimeout(() => {
              setOperations((prev) => [
                ...prev,
                {
                  ticker: "-",
                  price: "-",
                  OperationType: "POSITION",
                  status: "Pending",
                  id: operations.length,
                },
              ]);
              setApiCallParams((previousValue) => [
                ...previousValue,
                {
                  type: "POSITION",
                  id: operations.length,
                },
              ]);
            }, 60000);
            if (
              responseData?.positions &&
              responseData?.positions?.length > 0
            ) {
              setBuyList(responseData?.positions.map((item) => item.symbol));
              setPositions(
                responseData?.positions.map((item) => {
                  item["isActive"] = false;
                  item["orderStopPrice"] = 0;
                  item["orderMITPrice"] = 0;
                  if (
                    item.accounts[0].orders &&
                    item.accounts[0].orders.length > 0
                  ) {
                    item.accounts[0].orders.forEach((element) => {
                      if (element?.orderType === "STP") {
                        item["orderStopPrice"] = element?.stop_price
                          ? element?.stop_price
                          : 0;
                      } else if (element?.orderType === "MKT") {
                        item["orderMITPrice"] = element?.mit_price
                          ? element?.mit_price
                          : 0;
                      } else {
                      }
                    });
                  }
                  item["stopPrice"] = "";
                  item["MITPrice"] = "";
                  return item;
                })
              );
            } else {
              toastCall("Any active position is not present.", "info");
              setPositions([]);
            }
          }
          toastCall(responseData.message, "success");
        } else {
          setOperations((prevOperations) =>
            prevOperations.map((element) => {
              if (apiData?.id === element?.id) {
                element.status = "Error";
              }
              return element;
            })
          );
          if (apiData?.type === "POSITION") {
            setTimeout(() => {
              setOperations((prev) => [
                ...prev,
                {
                  ticker: "-",
                  price: "-",
                  OperationType: "POSITION",
                  status: "Pending",
                  id: operations.length,
                },
              ]);
              setApiCallParams((previousValue) => [
                ...previousValue,
                {
                  type: "POSITION",
                  id: operations.length,
                },
              ]);
            }, 60000);
          }
          toastCall(
            `Something went wrong with ${apiData?.type} order.`,
            "error"
          );
          // logFileCreation(response.message, response, "error");
        }
        setIsPendingRquest(false);
        return;
      }
    } catch (error) {
      const tempOperations = await operations.map((element) => {
        if (apiCallParams[0]?.id === element?.id) {
          element.status = "Error";
        }
        return element;
      });
      setOperations(tempOperations);
      setIsPendingRquest(false);
      // logFileCreation(error.message, error, "error");
    }
  };

  useEffect(() => {
    if (isRefreshCall) {
      getAllPositions();
    } else {
      apiCalls();
    }
  }, [apiCallParams, isPendingRquest]);

  useEffect(() => {
    if (!isRenderingDataCall) {
      const intervalId = setInterval(getOrdersDetails, 10000);
      return () => clearInterval(intervalId);
    }
  }, [getOrdersDetails, isRenderingDataCall]);

  const getRenderingData = async () => {
    try {
      setIsRenderingDataCall(true);
      getAllPositions();
      getAllRunners();
    } catch (error) {
      // logFileCreation(error.message, error, "error");
    }
  };

  const getAllPositions = async () => {
    try {
      if (!isPendingRquest) {
        const responseData = await getPosition();
        setIsRenderingDataCall(false);
        setIsRefreshCall(false);
        apiCalls();
        if (responseData.status === 200) {
          const data = await responseData.json();
          // logFileCreation(
          //   "Position API call success.",
          //   responseData,
          //   "success"
          // );
          setTimeout(() => {
            setOperations((prev) => [
              ...prev,
              {
                ticker: "-",
                price: "-",
                OperationType: "POSITION",
                status: "Pending",
                id: operations.length,
              },
            ]);
            setApiCallParams((previousValue) => [
              ...previousValue,
              {
                type: "POSITION",
                id: operations.length,
              },
            ]);
          }, 60000);
          if (data?.positions && data?.positions?.length > 0) {
            setBuyList(data?.positions.map((item) => item.symbol));
            setPositions(
              data?.positions.map((item) => {
                item["isActive"] = false;
                item["orderStopPrice"] = 0;
                item["orderMITPrice"] = 0;
                if (
                  item.accounts[0].orders &&
                  item.accounts[0].orders.length > 0
                ) {
                  item.accounts[0].orders.forEach((element) => {
                    if (element?.orderType === "STP") {
                      item["orderStopPrice"] = element?.stop_price
                        ? element?.stop_price
                        : 0;
                    } else if (element?.orderType === "MKT") {
                      item["orderMITPrice"] = element?.mit_price
                        ? element?.mit_price
                        : 0;
                    } else {
                    }
                  });
                }
                item["stopPrice"] = "";
                item["MITPrice"] = "";
                return item;
              })
            );
          } else {
            toastCall("Any active position is not present.", "info");
            setPositions([]);
          }
        } else {
          setTimeout(() => {
            setOperations((prev) => [
              ...prev,
              {
                ticker: "-",
                price: "-",
                OperationType: "POSITION",
                status: "Pending",
                id: operations.length,
              },
            ]);
            setApiCallParams((previousValue) => [
              ...previousValue,
              {
                type: "POSITION",
                id: operations.length,
              },
            ]);
          }, 60000);
          // logFileCreation(responseData.message, responseData, "error");
        }
      }
    } catch (error) {
      // logFileCreation(error.message, error, "error");
    }
  };

  const getAllRunners = async () => {
    try {
      const response = await getRunners();
      if (response.status === 200) {
        const responseData = await response.json();
        // logFileCreation("Runners API call success.", responseData, "success");
        let tempRunners = responseData?.results;
        tempRunners = tempRunners.sort((a, b) => {
          const aNewsFlag = a?.news_flag;
          const bNewsFlag = b?.news_flag;

          // If both have the same news_flag value, maintain original order
          if (aNewsFlag === bNewsFlag) return 0;

          // If a has news_flag true and b does not, a should come before b
          if (aNewsFlag) return -1;

          // If b has news_flag true and a does not, b should come before a
          return 1;
        });

        setRunners(tempRunners);
        let tempWatchList = watchList.map((element) => {
          if (element?.watchlistName === "RUNNERS") {
            element["watchlistData"] = tempRunners;
          }
          return element;
        });
        setWatchList(tempWatchList);
      } else {
        // logFileCreation(response.message, response, "error");
      }
    } catch (error) {
      // logFileCreation(error.message, error, "error");
    }
  };

  const handleBuyTicker = async (e, ticker, quantity = 0) => {
    try {
      e.preventDefault();
      let payload = {
        symbol: ticker,
      };
      if (quantity > 0) {
        payload["quantity"] = quantity;
      }
      toastCall("Process initiated for buy order.", "success");
      setOperations((prev) => [
        ...prev,
        {
          ticker: ticker.length > 0 ? ticker : "-",
          price: "-",
          OperationType: "BUY",
          status: "Pending",
          id: operations.length,
        },
      ]);
      setApiCallParams((previousValue) => [
        ...previousValue,
        {
          type: "BUY",
          payload,
          id: operations.length,
        },
      ]);
      setBuyTicker("");
      setBuyQuantity(1000);
    } catch (error) {
      setIsPendingRquest(false);
      toastCall(error.message, "error");
      // logFileCreation(error.message, error, "error");
    }
  };

  // const logFileCreation = (message, payload, messageType) => {
  //   try {
  //     // ipcRenderer.send("LOG-EVENT", { message, payload, messageType });
  //   } catch (error) {
  //     console.log(error.message, "error");
  //   }
  // };

  const componentCall = () => {
    try {
      switch (activeTab) {
        case "DASHBOARD":
          return (
            <Dashboard
              runners={runners}
              handleBuyTicker={handleBuyTicker}
              showPosition={showPosition}
            />
          );
        case "UPGRADES":
          return <Upgrades />
        case "OPERATIONS":
          return <Operations operations={operations} />;

        case "SENTIMENTS":
          return <Sentiments />;

        default:
          return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashBoard">
      <NavBar />
      <div className="innerContainer row m-0 border border-1 border border-dark-subtle">
        <div className="col-2 border border-1 border border-dark-subtle text-center p-0">
          <div className="headingbar">OPEN POSITIONS</div>
          <div className="d-grid border border-white rounded-2 m-2 row px-0 py-2">
            <div className="col-12 row align-items-center">
              <span className="col-6">Ticker:</span>
              <input
                type="text"
                className="tickerInputs col-6"
                title="Ticker Name"
                value={buyTicker}
                name="ticker"
                onChange={(e) => setBuyTicker(e.target.value.toUpperCase())}
              />
            </div>
            <div className="col-12 row align-items-center">
              <span className="col-6">Quantity:</span>
              <input
                type="number"
                className="tickerInputs col-6"
                title="Ticker Quantity"
                value={buyQuantity}
                name="ticker"
                onChange={(e) => setBuyQuantity(e.target.value)}
              />
            </div>
            <div className="col-12">
              <button
                className="btnPrimary"
                onClick={(e) => handleBuyTicker(e, buyTicker, buyQuantity)}
              >
                Buy
              </button>
              <button
                className="btnWarning"
                onClick={(e) => {
                  setBuyQuantity(1000);
                  setBuyTicker("");
                }}
              >
                Reset
              </button>
            </div>
          </div>
          <Watchlist
            watchList={watchList}
            setWatchList={setWatchList}
            buyList={buyList}
            handleBuyTicker={handleBuyTicker}
          />
        </div>
        <div className="col-10 border border-1 border border-dark-subtle">
          <div className="d-flex justify-content-between align-items-center">
            <div className="tabs d-flex">
              <span
                className={
                  activeTab === "DASHBOARD" ? "activeTab" : "disableTab"
                }
                onClick={() => {
                  setActiveTab("DASHBOARD");
                  setActiveTabHeader("RUNNERS");
                }}
              >
                DASHBOARD
              </span>
              <span
                className={activeTab === "ORDERS" ? "activeTab" : "disableTab"}
                onClick={() => {
                  setActiveTab("ORDERS");
                  setActiveTabHeader("ORDERS");
                }}
              >
                ORDERS
              </span>
              <span
                className={activeTab === "TRADES" ? "activeTab" : "disableTab"}
                onClick={() => {
                  setActiveTab("TRADES");
                  setActiveTabHeader("TRADES");
                }}
              >
                TRADES
              </span>
              <span
                className={
                  activeTab === "UPGRADES" ? "activeTab" : "disableTab"
                }
                onClick={() => {
                  setActiveTab("UPGRADES");
                  setActiveTabHeader("UPGRADES");
                }}
              >
                UPGRADES
              </span>
              <span
                className={activeTab === "NEWS" ? "activeTab" : "disableTab"}
                onClick={() => {
                  setActiveTab("NEWS");
                  setActiveTabHeader("NEWS");
                }}
              >
                NEWS
              </span>
              <span
                className={
                  activeTab === "OPERATIONS" ? "activeTab" : "disableTab"
                }
                onClick={() => {
                  setActiveTab("OPERATIONS");
                  setActiveTabHeader("OPERATIONS");
                }}
              >
                OPERATIONS
              </span>
              <span
                className={
                  activeTab === "SENTIMENTS" ? "activeTab" : "disableTab"
                }
                onClick={() => {
                  setActiveTab("SENTIMENTS");
                  setActiveTabHeader("SENTIMENTS");
                }}
              >
                SENTIMENTS
              </span>
            </div>
            <div className="tabActions">
              <button
                className="btnPrimary"
                onClick={() => {
                  getRenderingData();
                  setIsRefreshCall(true);
                }}
              >
                Refresh
              </button>
            </div>
          </div>
          <div className="row content">
            <div
              className={classNames(
                `${!showPosition ? "col-9" : "col-3"}`,
                "h-100 p-0 text-center content-div"
              )}
            >
              <div className="headingbar">{activeTabHeader}</div>
              <div className="row w-100 m-0 g-3 runnersDashboard">
                {componentCall()}
              </div>
            </div>
            <div
              className={classNames(
                `${!showPosition ? "col-3" : "col-9"}`,
                "h-100 p-0 text-center content-div"
              )}
            >
              <Positons
                positions={positions}
                setPositions={setPositions}
                showPosition={showPosition}
                setShowPosition={setShowPosition}
                getAllPositions={getAllPositions}
                setApiCallParams={setApiCallParams}
                setOperations={setOperations}
                operations={operations}
                toastCall={toastCall}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
