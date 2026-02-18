// Define size.
width = 980.02;
height = 1801.47;

// Define map.
var rateById = d3.map();

// Define scale.
var quantize = d3.scale.quantize()
  .domain([0, 1])
  .range(d3.range(19).map(function(i) { return "q" + i; }));

// Define projection.
var projection = d3.geo.albers()
  .center([1.3, 55.4])
  .rotate([4.4, 0])
  .parallels([50, 60])
  .scale(9375.2989)
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

// Append SVG container.
var svg = d3.select("#data-vis")
  .append("svg")

  // Make responsive.
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + width + " " + height);

// Append legend.
var legend = svg.append("g")
  .attr("id", "legend")
  .attr("transform", "translate(10, 40)");

// Append remain text.
legend.append("text")
  .attr("y", 40)
  .attr("dy", ".35em")
  .text("Remain");

// Define remain gradient.
var remainGrad = svg.append("defs")
  .append("linearGradient")
  .attr("id", "remain")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");

// Define remain colors.
remainGrad.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#1a2a60")
  .attr("stop-opacity", 1);

remainGrad.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#afbde9")
  .attr("stop-opacity", .5);

// Append remain circle.
legend.append("circle")
  .attr("class", "leave")
  .attr("cx", 110.95)
  .attr("cy", 40)
  .attr("r", 40)
  .attr('fill', 'url(#remain)');

// Define leave gradient.
var leaveGrad = svg.append("defs")
  .append("linearGradient")
  .attr("id", "leave")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");

// Define leave colors.
leaveGrad.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#f3aaa5")
  .attr("stop-opacity", .5);

leaveGrad.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#da291c")
  .attr("stop-opacity", 1);

// Append leave circle.
legend.append("circle")
  .attr("class", "leave")
  .attr("cx", 171.95)
  .attr("cy", 40)
  .attr("r", 40)
  .attr('fill', 'url(#leave)');

// Append leave text.
legend.append("text")
  .attr("x", 215.95)
  .attr("y", 40)
  .attr("dy", ".35em")
  .text("Leave");

// Load data.
queue()
  .defer(d3.json, "uk.json")
  .defer(d3.json, "ot.json")
  .defer(d3.csv, "votes.csv", function(d) { rateById.set(d.id, +d.rate); })
  .await(ready);

function ready(error, uk, ot) {
  if (error) throw error;

  // Append Great Britain.
  svg.append("g")
    .attr("class", "constituency")
    .selectAll("path")
    .data(topojson.feature(uk, uk.objects.gb).features)
    .enter()
    .append("path")
    .attr("class", function(d) { return quantize(rateById.get(d.id)); })
    .attr("d", path);

  // Append Northern Ireland.
  svg.append("g")
    .attr("class", "constituency")
    .selectAll("path")
    .data(topojson.feature(uk, uk.objects.ni).features)
    .enter()
    .append("path")
    .attr("class", function(d) { return quantize(rateById.get(d.id)); })
    .attr("d", path);

  // Append Gibraltar excerpt.
  var excerpt = svg.append("g")
    .attr("class", "excerpt")
    .attr("transform", "translate(20, 160)");

  excerpt.append("rect")
    .attr("width", 100)
    .attr("height", 150);

  excerpt.append("g")
    .attr("class", "territory")
    .selectAll("path")
    .data(topojson.feature(ot, ot.objects.gi).features)
    .enter()
    .append("path")
    .attr("class", function(d) { return quantize(rateById.get(d.id)); })
    .attr("d", path);

  excerpt.append("text")
    .attr("x", 10)
    .attr("y", 140)
    .text("Gibraltar");
}
