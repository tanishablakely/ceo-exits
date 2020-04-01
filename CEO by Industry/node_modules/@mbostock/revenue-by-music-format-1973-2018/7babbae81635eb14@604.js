// https://observablehq.com/@mbostock/revenue-by-music-format-1973-2018@604
import define1 from "./a33468b95d0b15b0@692.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["music.csv",new URL("./files/bc1d6e93fd1c8625c67a7afb0406aa0e6d956c0719b8b6f0b0348dc86f9f8f1423e1e157dcda317c9d13622598699a0b3feca27b361f934033ce302f88230607",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Revenue by Music Format, 1973–2018

Data: [RIAA](https://www.riaa.com/u-s-sales-database/)`
)});
  main.variable(observer()).define(["swatches","color","margin"], function(swatches,color,margin){return(
swatches({color, columns: "130px 4", marginLeft: margin.left})
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","series","color","x","y","formatRevenue","xAxis","yAxis"], function(d3,width,height,series,color,x,y,formatRevenue,xAxis,yAxis)
{  
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
      .attr("fill", ({key}) => color(key))
      .call(g => g.selectAll("rect")
        .data(d => d)
        .join("rect")
          .attr("x", d => x(d.data.year))
          .attr("y", d => y(d[1]))
          .attr("width", x.bandwidth() - 1)
          .attr("height", d => y(d[0]) - y(d[1]))
       .append("title")
          .text(d => `${d.data.name}, ${d.data.year}
${formatRevenue(d.data.value)}`));

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
Object.assign(d3.csvParse(await FileAttachment("music.csv").text(), ({Format, Year, ["Revenue (Inflation Adjusted)"]: Revenue}) => ({name: Format, year: +Year, value: +Revenue})), {y: "Revenue (billions, adj.)"})
)});
  main.variable(observer("colors")).define("colors", function(){return(
new Map([
  ["LP/EP", "#2A5784"],
  ["Vinyl Single", "#43719F"],
  ["8 - Track", "#5B8DB8"],
  ["Cassette", "#7AAAD0"],
  ["Cassette Single", "#9BC7E4"],
  ["Other Tapes", "#BADDF1"],
  ["Kiosk", "#E1575A"],
  ["CD", "#EE7423"],
  ["CD Single", "#F59D3D"],
  ["SACD", "#FFC686"],
  ["DVD Audio", "#9D7760"],
  ["Music Video (Physical)", "#F1CF63"],
  ["Download Album", "#7C4D79"],
  ["Download Single", "#9B6A97"],
  ["Ringtones & Ringbacks", "#BE89AC"],
  ["Download Music Video", "#D5A5C4"],
  ["Other Digital", "#EFC9E6"],
  ["Synchronization", "#BBB1AC"],
  ["Paid Subscription", "#24693D"],
  ["On-Demand Streaming (Ad-Supported)", "#398949"],
  ["Other Ad-Supported Streaming", "#61AA57"],
  ["SoundExchange Distributions", "#7DC470"],
  ["Limited Tier Paid Subscription", "#B4E0A7"]
])
)});
  main.variable(observer("series")).define("series", ["d3","colors","data"], function(d3,colors,data){return(
d3.stack()
    .keys(Array.from(colors.keys()))
    .value((group, key) => group.get(key).value)
    .order(d3.stackOrderReverse)
  (Array.from(d3.rollup(data, ([d]) => d, d => d.year, d => d.name).values()))
    .map(s => (s.forEach(d => d.data = d.data.get(s.key)), s))
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleBand()
    .domain(data.map(d => d.year))
    .rangeRound([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","series","height","margin"], function(d3,series,height,margin){return(
d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("color")).define("color", ["d3","colors"], function(d3,colors){return(
d3.scaleOrdinal()
    .domain(Array.from(colors.keys()))
    .range(Array.from(colors.values()))
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], function(height,margin,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
        .tickValues(d3.ticks(...d3.extent(x.domain()), width / 80))
        .tickSizeOuter(0))
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","data"], function(margin,d3,y,data){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y)
        .tickFormat(x => (x / 1e9).toFixed(0)))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y))
)});
  main.variable(observer("formatRevenue")).define("formatRevenue", function(){return(
x => (+(x / 1e9).toFixed(2) >= 1) 
    ? `${(x / 1e9).toFixed(2)}B` 
    : `${(x / 1e6).toFixed(0)}M`
)});
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 20, right: 30, bottom: 30, left: 30}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-array@2")
)});
  const child1 = runtime.module(define1);
  main.import("swatches", child1);
  return main;
}
