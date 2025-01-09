import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import style from "./style.module.css";
import { getRunSentiments, getSentiments } from "../../../api";

const Sentiments = () => {
  const [sentiments, setSentiments] = useState([]);
  const [dropdown, setDropdown] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    content: "",
  });
  const [colorScaleData, setColorScaleData] = useState([
    { color: "#f63538", value: "" },
    { color: "#bf4045", value: "" },
    { color: "#8b444e", value: "" },
    { color: "#414554", value: "" },
    { color: "#35764e", value: "" },
    { color: "#2f9e4f", value: "" },
    { color: "#30cc5a", value: "" },
  ]);
  const colorSequence = [
    "#f63538",
    "#bf4045",
    "#8b444e",
    "#414554",
    "#35764e",
    "#2f9e4f",
    "#30cc5a",
  ];

  const getSentimentsData = async () => {
    try {
      const response = await getSentiments();
      if (response.status === 200) {
        const responseData = await response.json();
        console.log({ responseData });
        setSentiments(responseData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSentimentsData();
  }, []);

  const svgRef = useRef();

  const handleMouseOver = useCallback((event, d) => {
    const [x, y] = d3.pointer(event);
    setDropdown({ isOpen: true, x, y, content: d.data });
    d3.select(event.currentTarget).classed("hovered", true);
  }, []);

  const handleMouseOut = (e) => {
    e.preventDefault();
    setDropdown({ isOpen: false, x: 0, y: 0, content: "" });
    d3.select(e.currentTarget).classed("hovered", false);
  };

  useEffect(() => {
    const width = 700;
    const height = 480;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    if (sentiments.length > 0) {
      const root = d3
        .hierarchy({ children: sentiments })
        .sum((d) => d.no_of_news)
        .sort((a, b) => b.no_of_news - a.no_of_news);

      d3.treemap().size([width, height]).padding(1)(root);

      const sentimentsdata = sentiments.map((item) => item.sentiment);
      const minSentiment = Math.min(...sentimentsdata);
      const maxSentiment = Math.max(...sentimentsdata);

      // Step 2: Divide the range into 7 equal parts
      const generateRange = (min, max, parts) => {
        const step = (max - min) / (parts - 1);
        const range = [];

        for (let i = 0; i < parts; i++) {
          range.push(parseFloat(min + step * i).toFixed(2));
        }

        return range;
      };

      const parts = colorSequence.length;
      const range = generateRange(minSentiment, maxSentiment, parts);
      setColorScaleData(
        colorScaleData.map((item, index) => {
          item["value"] = range[index];
          return item;
        })
      );
      const colorScale = d3
        .scaleQuantize()
        .domain([
          d3.min(sentiments, (d) => d.sentiment),
          d3.max(sentiments, (d) => d.sentiment),
        ])
        .range(colorSequence);

      // const color = d3.scaleOrdinal(d3.schemeCategory10);

      const nodes = svg
        .selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

      nodes
        .append("rect")
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("fill", (d) => colorScale(d.data.sentiment))
        .attr("stroke", "#fff");

      nodes
        .append("text")
        .attr("x", 5)
        .attr("y", 20)
        .text((d) => d.data.ticker)
        .attr("font-size", "15px")
        .attr("fill", "white")
        .each(function (d) {
          const textWidth = this.getBoundingClientRect().width;
          const rectWidth = d.x1 - d.x0;
          if (textWidth > rectWidth) {
            d3.select(this).text("");
          }
        });
    }
  }, [sentiments, handleMouseOver]);

  const handleRunSentiments = async () => {
    try {
      const response = await getRunSentiments();
      if (response.status === 200) {
        getSentimentsData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderColorLegend = () => {
    return (
      <div style={{ margin: "auto 0" }}>
        <ul className={style.colorScale}
        >
          {colorScaleData &&
            colorScaleData.length > 0 &&
            colorScaleData.map((item, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
              >
                <div
                  style={{
                    width: "fit-content",
                    backgroundColor: item?.color,
                    padding: "0  1em",
                    minWidth: "20px",
                    minHeight: "20px",
                  }}
                >
                  <span>
                    {item?.value ? <>&tilde;</> : null}
                    {item?.value}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className={style.container}>
        <div className="p-3">
          <button
            className="btn btn-success"
            onClick={handleRunSentiments}
          >
            Refresh Sentiments
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "5em",
            marginBottom: "1em",
          }}
        >
          <svg className="mx-auto" ref={svgRef}></svg>
          {dropdown.isOpen && (
            <div
              className={style.feeds}
              style={{ left: dropdown.x, top: dropdown.y }}
            >
              <span>Ticker : {dropdown?.content?.ticker}</span>
              <span>No of News : {dropdown?.content?.no_of_news}</span>
              <span>Sentiments value : {dropdown?.content?.sentiment}</span>
            </div>
          )}
          {renderColorLegend()}
        </div>
      </div>
    </>
  );
};

export default Sentiments;
