import React, { useMemo } from "react";
import style from "./style.module.css";
import classNames from "classnames";

const Sidebar = ({ handleActiveTab, activeTab }) => {
  const dashboardTabs = useMemo(() => {
    return [
      {
        name: "Dashboard",
        value: "dashboard",
      },
      {
        name: "Order",
        value: "order",
      },
      {
        name: "Trades",
        value: "trades",
      },
      {
        name: "Upgrades",
        value: "upgrades",
      },
      {
        name: "News",
        value: "news",
      },
      {
        name: "Sentiments",
        value: "sentiments",
      },
      {
        name: "Operations",
        value: "operations",
      },
    ];
  }, []);

  return (
    <div className={style.sideBarContainer}>
      <div className={style.tabs}>
        <div className={style.tabHeader}>Tabs</div>
        <div className={style.tabSection}>
          {dashboardTabs?.length > 0 &&
            dashboardTabs.map((tab) => {
              return (
                <span
                  className={classNames(
                    activeTab?.value !== tab?.value
                      ? style.tab
                      : style.activeTab
                  )}
                  onClick={() => handleActiveTab(tab)}
                >
                  {tab?.name}
                </span>
              );
            })}
        </div>
        <hr />
      </div>
    </div>
  );
};

export default Sidebar;
