const sort_options = [
  { label: "Alphabetical", value: (a, b) => a.name.localeCompare(b.name) },
  { label: "Hours, ascending", value: (a, b) => a.hours - b.hours },
  { label: "Hours, descending", value: (a, b) => b.hours - a.hours }
];

var svgWidth = d3.select("#d3BarChart .card-body").style('width').slice(0, -2);
var svgHeight = d3.select("#d3BarChart .card-body").style('height').slice(0, -2);;

var margin = ({ top: 20, right: 0, bottom: 30, left: 40 });

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

var chart = new Object();

chart.svg = d3.select("#d3BarChart .chart-area")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

// Load data from hours-of-tv-watched.csv
d3.csv("static/data/hours-of-tv-watched.csv").then(function (tvData) {

  // Cast the hours value to a number for each piece of tvData
  tvData.forEach(function (data) {
    data.hours = +data.hours;
  });

  // Create code to build the bar chart using the tvData.
  var x = d3.scaleBand()
    .domain(tvData.map(d => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  var y = d3.scaleLinear()
    .domain([0, d3.max(tvData, d => d.hours)]).nice()
    .range([height - margin.bottom, margin.top]);

  var xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  var yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove());

  chart.bar = chart.svg.append("g")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(tvData)
    .join("rect")
    .style("mix-blend-mode", "multiply")
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.hours))
    .attr("height", d => y(0) - y(d.hours))
    .attr("width", x.bandwidth());
  chart.gx = chart.svg.append("g")
    .call(xAxis);
  chart.gy = chart.svg.append("g")
    .call(yAxis);
  chart.svg.update_chart = function () {
    var sort_option = this.selectedIndex ? sort_options[this.selectedIndex]['value'] : sort_options[0]['value'];
    x.domain(tvData.sort(sort_option).map(d => d.name));

    chart.bar.data(tvData, d => d.name)
      .order()
      .transition()
      .duration(750)
      .delay((d, i) => i * 20)
      .attr("x", d => x(d.name));

    chart.gx.transition()
      .duration(750)
      .call(xAxis)
      .selectAll(".tick")
      .delay((d, i) => i * 20);
  };

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