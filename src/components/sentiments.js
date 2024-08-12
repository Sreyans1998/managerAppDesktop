import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getRunSentiments, getSentiments } from "../api";

const Sentiments = () => {
  const [sentiments, setSentiments] = useState([]);
  const [dropdown, setDropdown] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    content: "",
  });
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
    const width = 800;
    const height = 400;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const root = d3
      .hierarchy({ children: sentiments })
      .sum((d) => d.no_of_news)
      .sort((a, b) => b.no_of_news - a.no_of_news);

    d3.treemap().size([width, height]).padding(1)(root);

    const colorSequence = [
      "#f63538",
      "#bf4045",
      "#8b444e",
      "#414554",
      "#35764e",
      "#2f9e4f",
      "#30cc5a",
    ];
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
  }

  return (
    <>
      <div className="my-1">
        <div className="p-3">
          <button
            className="btnPrimary float-right"
            onClick={handleRunSentiments}
          >
            Refresh Sentiments
          </button>
        </div>
        <svg className="mx-auto" ref={svgRef}></svg>
        {dropdown.isOpen && (
          <div
            style={{
              position: "absolute",
              left: dropdown.x,
              top: dropdown.y,
              backgroundColor: "black",
              border: "none",
              color: "white",
              padding: "5px",
              pointerEvents: "none",
              width: "240px",
              height: "150px",
              marginTop: "10%",
              marginLeft: "30%",
              display: "grid",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 1px 10px 5px rgb(255, 255, 255)",
            }}
          >
            <span>Ticker : {dropdown?.content?.ticker}</span>
            <span>No of News : {dropdown?.content?.no_of_news}</span>
            <span>Sentiments value : {dropdown?.content?.sentiment}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Sentiments;
