var apiKey = "A-vHCLpURBzrVRX_D8a7";


// Initializes the page with a default plot
function init() {
  /* global Plotly */
    pickStock("AAPL")
}

// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("body").on("change", updatePlotly);

// This function is called when a dropdown menu item is selected
function updatePlotly() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.node().value;

  var CHART = d3.selectAll("#plot").node();

  // Initialize x and y arrays
  var x = [];
  var y = [];

  switch (dataset) {
    case "AAPL":
      /* global Plotly */
      pickStock("AAPL")
      break;

    case "GOOGL":
      /* global Plotly */
      pickStock("GOOGL")
      break;

    case "MSFT":
      /* global Plotly */
      pickStock("MSFT")
      break;

    case "IBM":
      /* global Plotly */
      pickStock("IBM")
      break;

    case "INTC":
      /* global Plotly */
      pickStock("INTC")
      break;

    default:
      "Choose a stock"
      break;
  }

  // Note the extra brackets around 'x' and 'y'
  Plotly.restyle(CHART, "x", [x]);
  Plotly.restyle(CHART, "y", [y]);
}

init();

function pickStock(stock) {
  /* global Plotly */
  var url =
    `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?start_date=2016-10-01&end_date=2017-10-01&api_key=${apiKey}`;

  /**
  * Helper function to select stock data
  * Returns an array of values
  * @param {array} rows
  * @param {integer} index
  * index 0 - Date
  * index 1 - Open
  * index 2 - High
  * index 3 - Low
  * index 4 - Close
  * index 5 - Volume
  */
  function unpack(rows, index) {
    return rows.map(function (row) {
      return row[index];
    });
  }
  function buildPlot() {
    d3.json(url).then(function (data) {

      // Grab values from the data json object to build the plots
      var name = data.dataset.name;
      var stock = data.dataset.dataset_code;
      var startDate = data.dataset.start_date;
      var endDate = data.dataset.end_date;
      var dates = unpack(data.dataset.data, 0);
      var closingPrices = unpack(data.dataset.data, 4);

      var trace1 = {
        type: "scatter",
        mode: "lines",
        name: name,
        x: dates,
        y: closingPrices,
        line: {
          color: "#17BECF"
        }
      };

      var data = [trace1];

      var layout = {
        title: `${stock} closing prices`,
        xaxis: {
          range: [startDate, endDate],
          type: "date"
        },
        yaxis: {
          autorange: true,
          type: "linear"
        }
      };

      Plotly.newPlot("plot", data, layout);

    });
  }

  buildPlot();
}