import React, { useEffect, useState } from "react";

const Table = ({ tableContent, isOperations }) => {
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
                return <th key={index}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {sortedTableContent.map((element, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {headerList.map((colItem, colIndex) => {
                    return (
                      <td
                        key={colIndex}
                        className={isOperations ? `${element.status}` : ""}
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
