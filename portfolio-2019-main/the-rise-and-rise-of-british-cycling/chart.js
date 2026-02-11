// append form
d3.select('#chart')
  .append("form")
  .attr("class", "mf-toggle")
  .html('<input type="radio" name="sex" value="m" checked><label class="option">Men</label><input type="radio" name="sex" value="f"><label class="option">Women</label>');

// define chart dimensions
const margin = {
  top: 32,
  right: 0,
  bottom: 32,
  left: 48
},
width = 960 - margin.left - margin.right,
height = 620 - margin.top - margin.bottom;

// generate x scale discrete values
let years = [];
for (let i = 1987; i <= 2016; i++) {
  years.push(+i);
}

// construct x scale
const x = d3.scaleBand()
  .domain(years)
  .range([0, width])
  .paddingInner(0.05);

// append svg container
const svg = d3.select("#chart")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load funding
d3.csv("funding.csv", function(error, funding) {
  if (error) throw error;

  // construct y scale
  const y = d3.scaleLinear()
    .domain([0, d3.max(funding, d => { return +d.received; })])
    .range([height, 0]);

  // construct y axis
  const yTick = d => { return "£" + d3.format(".0s")(d) };
  const yAxis = d3.axisLeft(y)
    .tickFormat(yTick)
    .tickPadding(6);

  // append y axis
  svg.append("g")
    .attr("class", "axis")
    .call(yAxis);

  // append y axis label
  svg.append("rect")
    .attr("class", "axis-key")
    .attr("width", 10)
    .attr("height", 10)
    .attr("x", 15)
    .attr("y", 100);
  svg.append("text")
    .attr("class", "axis-key-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -95)
    .attr("y", 24)
    .text("UK Sport funding");

  // append bars
  svg.selectAll(".bar")
    .data(funding)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => { return x(d.year); })
    .attr("width", x.bandwidth())
    .attr("y", height)
    .transition()
    .duration(700)
    .attr("height", d => { return height - y(d.received); })
    .attr("y", d => { return y(d.received); });

  // load wins
  d3.csv("wins.csv", function(error, wins) {
    if (error) throw error;

    // add new property by assigning year increment
    let year = 1987;
    let i = 0;
    wins.forEach(d => {
      if (d.year == year) {
        i++;
      } else {
        i = 1;
      }
      d.i = i;
      year = d.year;
    });

    // construct x axis
    const xAxis = d3.axisBottom(x)
      .ticks(30, "d")
      .tickPadding(6);

    // append x axis
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // generate legend keys
    const dots = ["gs", "ts", "vs", "gj", "dj", "pj", "yj", "gm", "rt", "rr", "cr", "hr"];
    const races = [
      "Giro d'Italia stage win",
      "Tour de France stage win",
      "Vuelta a Espana stage win",
      "Points win",
      "King of the mouintains win",
      "Giro d'Italia win",
      "Tour de France win",
      "Olympic gold",
      "Track world champion",
      "Road world champion",
      "Classics win",
      "Hour record",
    ];
    let keys = [];
    for (let i = 0; i < dots.length; i++) {
      keys.push({
        "dot": dots[i],
        "label": races[i]
      });
    }

    // calculate radius
    const radius = height / d3.max(wins, d => { return d.i; }) / 2;

    // append legend
    let legend = svg.append("g")
      .attr("transform", "translate(100," + radius + ")");
    legend.selectAll(".dot-key")
      .data(keys)
      .enter()
      .append("g")
      .attr("class", "dot-key")
      .attr("transform", (d, i) => { return "translate(50," + i * (radius * 2.25) + ")";} )
      .each(dotter)
      .append("text")
      .attr("class", "dot-key-label")
      .attr("x", radius * 1.5)
      .attr("dy", "0.35em")
      .text(d => { return d.label; });
    legend.selectAll("title")
      .remove();

    // define dotter
    function dotter(d) {
      d3.select(this)
        .append("title")
        .text(d => {
          return d.rider + " | " + d.race + " | " + d.event + " | " + d.finish;
        });
      switch (d.dot) {
        case "gs":
          d3.select(this)
            .append("circle")
            .attr("r", radius);
          d3.select(this)
            .append("circle")
            .attr("class", "gs-middle")
            .attr("r", radius - 3);
          d3.select(this)
            .append("circle")
            .attr("class", "gs-inner")
            .attr("r", radius - 6);
          break;
        case "ts":
          d3.select(this)
            .append("circle")
            .attr("r", radius);
          d3.select(this)
            .append("circle")
            .attr("class", "ts-middle")
            .attr("r", radius - 3);
          d3.select(this)
            .append("circle")
            .attr("class", "ts-inner")
            .attr("r", radius - 6);
          break;
        case "vs":
          d3.select(this)
            .append("circle")
            .attr("r", radius);
          d3.select(this)
            .append("circle")
            .attr("class", "vs-middle")
            .attr("r", radius - 3);
          d3.select(this)
            .append("circle")
            .attr("class", "vs-inner")
            .attr("r", radius - 6);
          break;
        case "rt":
        case "rr":
          d3.select(this)
            .append("circle")
            .attr("class", "r-base")
            .attr("r", radius);
          d3.select(this)
            .append("rect")
            .attr("class", "r-blue")
            .attr("x", -11)
            .attr("y", -5)
            .attr("width", (radius * 2) - 3)
            .attr("height", 2)
          d3.select(this)
            .append("rect")
            .attr("class", "r-red")
            .attr("x", -11)
            .attr("y", -3)
            .attr("width", (radius * 2) - 3)
            .attr("height", 2)
          d3.select(this)
            .append("rect")
            .attr("x", -11)
            .attr("y", -1)
            .attr("width", (radius * 2) - 3)
            .attr("height", 2);
          d3.select(this)
            .append("rect")
            .attr("class", "r-yellow")
            .attr("x", -11)
            .attr("y", 1)
            .attr("width", (radius * 2) - 3)
            .attr("height", 2)
          d3.select(this)
            .append("rect")
            .attr("class", "r-green")
            .attr("x", -11)
            .attr("y", 3)
            .attr("width", (radius * 2) - 3)
            .attr("height", 2)
          d3.select(this)
            .append("circle")
            .attr("class", "r-overlay")
            .attr("r", radius - 1)
            .attr("stroke", d => {
              return d.dot == "rt" ? "#745f01" : "#000";
            });
          break;
        case "gj":
          d3.select(this)
            .append("circle")
            .attr("class", "gj")
            .attr("r", radius);
          break;
        case "dj":
          d3.select(this)
            .append("circle")
            .attr("class", "dj-outer")
            .attr("r", radius);
          d3.select(this)
            .append("circle")
            .attr("class", "dj-inner")
            .attr("r", radius - 8);
          break;
        case "pj":
          d3.select(this)
            .append("circle")
            .attr("class", "pj")
            .attr("r", radius);
          break;
        case "yj":
          d3.select(this)
            .append("circle")
            .attr("class", "yj")
            .attr("r", radius);
          break;
        case "gm":
          d3.select(this)
            .append("circle")
            .attr("class", "gm-outer")
            .attr("r", radius);
          d3.select(this)
            .append("circle")
            .attr("class", "gm-inner")
            .attr("r", radius - 2);
          break;
        case "cr":
          d3.select(this)
            .append("circle")
            .attr("r", radius);
          d3.select(this)
            .append("circle")
            .attr("class", "cr-middle")
            .attr("r", radius - 3);
          d3.select(this)
            .append("circle")
            .attr("class", "cr-outer")
            .attr("r", radius - 6);
          break;
        case "hr":
          d3.select(this)
            .append("circle")
            .attr("r", radius);
          d3.select(this)
            .append("circle")
            .attr("class", "hr")
            .attr("r", radius - 2);
          d3.select(this)
            .append("rect")
            .attr("x", -1)
            .attr("y", -radius + 4)
            .attr("width", 2)
            .attr("height", radius - 2);
          break;
        default:
          d3.select(this)
            .append("circle")
            .attr("class", "default")
            .attr("r", radius);
      }
    }

    // add event listener for change event
    d3.selectAll("input")
      .on("change", render);

    // initialise dots
    render(800);

    // render dots
    function render(delay = 0) {
      let sex = delay == 800 ? "m" : this.value;

      // join data
      const dot = svg.selectAll(".dot")
        .data(wins.filter(d => { return d.sex == sex }));

      // update existing dots
      dot.selectAll("*")
        .remove();
      dot.attr("transform", d => {
        return "translate(" + (x(d.year) + (x.bandwidth() * .5)) + "," + (height - ((radius * 2) * d.i) + radius) + ")";
      })
        .each(dotter);

      // enter new dots
      dot.enter()
        .append("g")
        .attr("class", "dot")
        .attr("transform", d => {
          return "translate(" + (x(d.year) + (x.bandwidth() * .5)) + "," + (height - ((radius * 2) * d.i) + radius) + ")";
        })
        .style("opacity", 0)
        .transition()
        .delay(delay)
        .duration(0)
        .style("opacity", 1)
        .each(dotter);

      // exit old dots
      dot.exit()
        .remove();
    }
  });
});
