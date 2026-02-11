// Define size.
var width = 980, height = 980, opacity = .2;

// Define ordinal scale with a range of categorical colors.
var color = d3.scale.ordinal()
.domain(d3.range(0, 10))
.range(["#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#3366cc", "#dc3912", "#ff9900"]);

// Define linear scale with a range of font sizes.
var size = d3.scale.linear()
.domain([5, 92])
.range([13, 20]);

// Append SVG container and center group container.
svg = d3.select("#data-vis")
.append("svg")
//.attr("width", width)
//.attr("height", height)

 // Make chart responsive.
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", "0 0 " + width + " " + height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Load data.
d3.csv("data.csv", function(error, csv) {

  // Clean data.
  csv.forEach(function(d) {
    d.appearances = +d.appearances;
    d.formed = +d.formed;
  });

  // Calculate dial start and end.
  var dial = [];
  for (var row in csv) {
    dial.push(csv[row].formed);
  }
  var start = d3.min(dial);
  var end = d3.max(dial);
  var length = end - start + 1;

  // Append dial.
  dial = [];
  for (i = start; i <= end; i++) {
    dial.push(+i);
  }
  svg.selectAll("text")
  .data(dial)
  .enter()
  .append("text")
  .attr("class", "dial")
  .attr("x", (width / 2) * .91)
  .attr("y", ".35em")
  .text(function(d) { return d; })
  .attr("transform", function(d, i) { return "rotate(" + (-90 + ((360 / dial.length) * i)) + ")"; });

  // Group data into hierarchical tree structure.
  var nest = d3.nest()
  .key(function(d) { return d.formed; })
  .sortKeys(d3.ascending)
  .sortValues(function(a, b) { return b.appearances - a.appearances; })
  .entries(csv);

  // Map data.
  var data = d3.values(nest).map(function(d) { return d.values; })

  // Append year group.
  var year = svg.selectAll("g")
  .data(data)
  .enter()
  .append("g")
  .attr("class", "year-group");

  // Append record group.
  var record = year.selectAll("g")
  .data(function(d) { return d; })
  .enter()
  .append("g");

  // Append lead in groove.
  record.append("circle")
  .attr("class", "lead-in-groove")
  .attr("cx", function(d, i) { d.x = coordinate(d, i, "x"); return d.x; })
  .attr("cy", function(d, i) { d.y = coordinate(d, i, "y"); return d.y; })
  .attr("r",  function(d) { return d.appearances; });

  // Append tracks.
  record.append("circle")
  .attr("class", "tracks")
  .attr("cx", function(d, i) { return d.x; })
  .attr("cy", function(d, i) { return d.y; })
  .attr("r",  function(d) { return d.appearances; });

  // Append run out.
  record.append("circle")
  .attr("class", "run-out")
  .attr("cx", function(d, i) { return d.x; })
  .attr("cy", function(d, i) { return d.y; })
  .attr("r", function(d) { return d.appearances * .44; });

  // Append label.
  record.append("circle")
  .attr("class", "record-label")
  .attr("cx", function(d, i) { return d.x; })
  .attr("cy", function(d, i) { return d.y; })
  .attr("r", function(d) { return d.appearances * .3; })
  .style("fill", function(d) { return color(d.formed.toString()[2]); });

  // Append center hole.
  record.append("circle")
  .attr("class", "center-hole")
  .attr("cx", function(d, i) { return d.x; })
  .attr("cy", function(d, i) { return d.y; })
  .attr("r", function(d) { return d.appearances * .04; });

  // Append name.
  record.append("text")
  .attr("class", "band-artist")
  .attr("x", function(d, i) { return d.x - d.appearances - 2; })
  .attr("y", function(d, i) { return d.y; })
  .attr("dy", ".35em")
  .text(function(d) { return d.name; })
  .attr("transform", function(d, i) { return "rotate(" + (360 / dial.length * (d.formed - start)) + ", " + d.x + ", " + d.y + ")"; })
  .style("font-size", function(d) { return size(d.appearances) + "px"; });

  // Calculate coordinate.
  function coordinate(d, i, type) {
    var offset = d.appearances;
    if (i == 0) {
      totalOffset = offset;
    } else {
      totalOffset += previous + offset;
    }
    previous = offset;
    var radius = center = (width / 2) * .9;
    var radian = 2 * Math.PI * ((d.formed - start) - (length / 4)) / length;
    var trigonometric = type == "x" ? Math.cos(radian): Math.sin(radian);
    return (center + (radius - totalOffset) * trigonometric) - radius;
  }

});

// Trigger hover event on screen tap.
var g = document.getElementsByTagName('g')[0];
  g.onclick = function() {
  g.onhover.call();
};
