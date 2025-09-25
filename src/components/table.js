import classNames from "classnames";
import React, { useEffect, useState } from "react";

const Table = ({ tableContent, isOperations = false }) => {
  const [headerList, setHeadersList] = useState([]);
  const [sortedTableContent, setSortedTableContent] = useState([]);

  useEffect(() => {
    if (tableContent && tableContent.length > 0) {
      const tempTableContent = tableContent.sort((a, b) => {
        return b.id - a.id;
      });
      setSortedTableContent(tempTableContent);
      setHeadersList(Object.keys(tableContent[0]));
    }
  }, [tableContent]);

  return (
    <>
      {sortedTableContent &&
      sortedTableContent.length > 0 &&
      headerList &&
      headerList.length > 0 ? (
        <table>
          <thead>
            <tr>
              {headerList.map((item, index) => {
                if (item !== "id") return <th key={index}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {sortedTableContent.map((element, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {headerList.map((colItem, colIndex) => {
                    if (colItem !== "id" && element?.OperationType !== "POSITION")
                      return (
                        <td
                          key={colIndex}
                          className={classNames(
                            `${isOperations ? `${element.status}` : ""}`,
                            "tableCell"
                          )}
                        >
                          {element[`${colItem}`]}
                        </td>
                      );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
    </>
  );
};

export default Table;
