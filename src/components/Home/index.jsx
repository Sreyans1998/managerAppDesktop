import React, { useCallback, useEffect, useMemo, useState } from "react";
import style from "./style.module.css";
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
} from "../../api";
import Sidebar from "../Sidebar";
import Sentiments from "../DashboardContent/Sentiments";
import Runners from "../DashboardContent/Runners";
import Upgrades from "../DashboardContent/Upgrades";
import Operations from "../DashboardContent/Operations";
import DynamicForm from "../common/DynamicForm";
import { Divider } from "@mui/material";
import classNames from "classnames";
import Positions from "../Positions";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ShimmerCard } from "react-shimmer-effects";

const Home = ({ setOperations, operations }) => {
  const [runners, setRunners] = useState([]);
  const [isRenderingDataCall, setIsRenderingDataCall] = useState([]);
  const [activeTab, setActiveTab] = useState({
    name: "Dashboard",
    value: "dashboard",
  });
  const [isRefreshCall, setIsRefreshCall] = useState(false);
  const [showPosition, setShowPosition] = useState(true);
  const [isPendingRquest, setIsPendingRquest] = useState(false);
  const [apiCallParams, setApiCallParams] = useState([]);
  const [buyInputValues, setbuyInputValues] = useState([
    {
      label: "Ticker",
      type: "text",
      value: "",
    },
    {
      label: "Quantity",
      type: "text",
      value: 1000,
    },
  ]);
  const [positions, setPositions] = useState([]);
  const [buyList, setBuyList] = useState([]);
  const [openChat, setOpenChat] = useState([]);
  const [textMessage, setTextMessage] = useState("");

  useEffect(() => {
    getRenderingData();
  }, []);

  const getOrdersDetails = useCallback(async () => {
    try {
      if (apiCallParams.length <= 0 || !isPendingRquest) {
        const response = await getOrders();
        if (response.status === 200) {
          const data = await response.json();
          // logFileCreation(`Orders API call success.`, data, "success");
          if (data?.results.length > 0) {
            const orderData = data?.results[0];

            const apiCallFound = apiCallParams.find((element) => {
              if (
                element?.payload?.symbol === orderData?.ticker &&
                element?.ordersCalls
              ) {
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
  }, []);

  useEffect(() => {
    if (!isRenderingDataCall) {
      const intervalId = setInterval(getOrdersDetails, 10000);
      return () => clearInterval(intervalId);
    }
  }, [getOrdersDetails, isRenderingDataCall]);

  const toastCall = useCallback((message, type) => {
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
  }, []);

  const getAllRunners = useCallback(async () => {
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
      } else {
        // logFileCreation(response.message, response, "error");
      }
    } catch (error) {
      // logFileCreation(error.message, error, "error");
    }
  }, [setRunners]);

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

  const getRenderingData = useCallback(async () => {
    try {
      setIsRenderingDataCall(true);
      getAllPositions();
      getAllRunners();
    } catch (error) {
      // logFileCreation(error.message, error, "error");
    }
  }, [getAllRunners, setIsRenderingDataCall]);

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

  const handleActiveTab = useCallback((tab) => {
    try {
      setActiveTab(tab);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (isRefreshCall) {
      getAllPositions();
    } else {
      apiCalls();
    }
  }, [apiCallParams, isPendingRquest, apiCalls, getAllPositions]);

  const handleBuyFormSubmit = useCallback((e, inputs) => {
    try {
      handleBuyTicker(e, buyInputValues[0].value, buyInputValues[1].value);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleBuyTicker = useCallback(async (e, ticker, quantity = 0) => {
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
      // setBuyTicker("");
      // setBuyQuantity(1000);
    } catch (error) {
      setIsPendingRquest(false);
      toastCall(error.message, "error");
      // logFileCreation(error.message, error, "error");
    }
  }, []);

  const handleReset = () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = useCallback((index, newValue) => {
    setbuyInputValues((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index].value = newValue;
      return updatedValues;
    });
  }, []);

  const dashboard = useMemo(() => {
    switch (activeTab?.value) {
      case "dashboard":
        return (
          <Runners
            runners={runners}
            handleBuyTicker={handleBuyTicker}
            showPosition={showPosition}
          />
        );
      case "order":
        return;
      case "trades":
        return;
      case "upgrades":
        return <Upgrades />;
      case "news":
        return;
      case "sentiments":
        return <Sentiments />;
      case "operations":
        return <Operations operations={operations} />;
      default:
        break;
    }
  }, [activeTab, runners, handleBuyTicker, showPosition, operations]);

  return (
    <div className={style.contanier}>
      <div className={style.sideBar}>
        <Sidebar handleActiveTab={handleActiveTab} activeTab={activeTab} />
      </div>
      <div className={style.content}>
        <div className={style.header}>
          <div className={style.headerActions}>
            <DynamicForm
              inputs={buyInputValues.map((input, index) => ({
                ...input,
                onChange: handleInputChange,
              }))}
              primaryButtonName={"Buy"}
              secondaryButtonName={"Reset"}
              handlePrimaryButton={handleBuyFormSubmit}
              handleSecondaryButton={handleReset}
            />
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 2, backgroundColor: "#fff", width: "2px" }}
            />
            <button
              className="btn btn-success"
              onClick={() => {
                getRenderingData();
                setIsRefreshCall(true);
              }}
            >
              Refresh
            </button>
          </div>
        </div>
        <div className={style.dashboardContent}>
          <div
            className={classNames(
              !showPosition ? style.width20 : style.width80,
              style.innerContent
            )}
          >
            {dashboard}
          </div>
          <div
            className={classNames(
              !showPosition ? style.width80 : style.width20,
              style.positionContent
            )}
          >
            <Positions
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
      <div
        className={classNames(style.chatSection, {
          [style.closeChat]: !openChat, // Apply `style.closeChat` when `openChat` is false
        })}
      >
        <div className={style.chatContent}>
          <div className={style.chatHeader}>
            <span
              className={style.chatToggleIcon}
              onClick={() => setOpenChat(!openChat)}
            >
              {openChat ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            </span>
            Chats
          </div>
          {openChat ? (
            <>
              <div className={style.chatBody}>
                <ShimmerCard />
              </div>
              <div className={style.chatFooter}>
                <div className={style.chatFooterActions}>
                  <span>
                    <AttachFileIcon />
                  </span>
                </div>
                <input
                  type="text"
                  value={textMessage}
                  className={style.chatInput}
                  onChange={(e) => setTextMessage(e.target.value)}
                />
                <div>
                  <SendIcon />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Home;
