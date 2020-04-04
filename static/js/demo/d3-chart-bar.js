const sort_options = [
  { label: "Industry, alphabetical", value: (a, b) => a.industry.localeCompare(b.industry) },
  { label: "Exits, ascending", value: (a, b) => a.ceo_exits - b.ceo_exits },
  { label: "Exits, descending", value: (a, b) => b.ceo_exits - a.ceo_exits }
];

const colors = {
  2019: "#d97478",
  2018: "#d9d574",
  2017: "#74d9d5",
  2016: "#7478d9",
  2015: "#d9a374"
};
var svgWidth = d3.select("#d3BarChart .card-body").style('width').slice(0, -2);
var svgHeight = d3.select("#d3BarChart .card-body").style('height').slice(0, -2);;

var margin = ({ top: 20, right: 0, bottom: 100, left: 40 });

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

var chart = new Object();

chart.svg = d3.select("#d3BarChart .chart-area")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

// Load data from hours-of-tv-watched.csv
d3.csv("static/data/yearly_industry_exits.csv", function (exits) {
  return {
    industry: exits.Industry,
    year: +exits.Year,
    ceo_exits: +exits['CEO Exits']
  };
}).then(function (exits) {

  var x = d3.scaleBand()
    .domain(exits.map(d => d.industry))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  var y = d3.scaleLinear()
    .domain([0, d3.max(exits, d => d.ceo_exits)]).nice()
    .range([height - margin.bottom, margin.top]);

  var xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")	
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  var yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove());

  chart.bar = chart.svg.append("g")
    // .attr("fill", "steelblue")
    //.attr("fill", colors[exits.year])
    .selectAll("rect")
    .data(exits)
    .join("rect")
    .style("mix-blend-mode", "multiply")
    .attr("x", d => x(d.industry))
    .attr("y", d => y(d.ceo_exits))
    .attr("height", d => y(0) - y(d.ceo_exits))
    .attr("width", x.bandwidth())
    .style("fill", d => colors[d.year])
    ;
  chart.gx = chart.svg.append("g")
    .call(xAxis);
  chart.gy = chart.svg.append("g")
    .call(yAxis);
  chart.svg.update_chart = function () {
    var sort_option = this.selectedIndex ? sort_options[this.selectedIndex]['value'] : sort_options[0]['value'];
    x.domain(exits.sort(sort_option).map(d => d.industry));

    chart.bar.data(exits, d => d.industry)
      .order()
      .transition()
      .duration(750)
      .delay((d, i) => i * 20)
      .attr("x", d => x(d.industry));

    chart.gx.transition()
      .duration(750)
      .call(xAxis)
      .selectAll(".tick")
      .delay((d, i) => i * 20);
  };

  chart.legend = chart.svg.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) { return "translate(30," + i * 19 + ")"; });

  chart.legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", d => colors[d.year]);

  chart.legend.append("text")
    .attr("x", width + 5)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(d => d.year);

  var select = d3.select('#d3BarChart .dropdown')
    .data(sort_options)
    .append('select')
    .attr('class', 'dropdown-item')
    .on('change', chart.svg.update_chart);

  var options = select
    .selectAll('option')
    .data(sort_options).enter()
    .append('option')
    .text(function (d) { return d.label; })
    .attr("value", function (d) { return d.value; });

  chart.svg.update_chart();

}).catch(function (error) {
  console.log(error);
});
