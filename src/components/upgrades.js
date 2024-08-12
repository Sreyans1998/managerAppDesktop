import React, { useEffect, useState } from "react";
import { getRunUpgrades, getUpgrades } from "../api";
import Table from "./table";

const Upgrades = () => {
  const [upgrades, setUpgrades] = useState([]);
  const getUpgradesdata = async () => {
    try {
      const response = await getUpgrades();
      if (response.status === 200) {
        const responseData = await response.json();
        setUpgrades(responseData);
      } else {
        setUpgrades([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUpgradesdata();
  }, []);

  const handleRunUpgrades = async () => {
    try {
      const response = await getRunUpgrades();
      if (response.status === 200) {
        getUpgrades();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="my-1">
        <div className="p-3">
          <button
            className="btnPrimary float-right"
            onClick={handleRunUpgrades}
          >
            Refresh Sentiments
          </button>
        </div>
        {upgrades && upgrades.length > 0 && (
          <div>
            <Table tableContent={upgrades} />
          </div>
        )}
      </div>
    </>
  );
};

export default Upgrades;
