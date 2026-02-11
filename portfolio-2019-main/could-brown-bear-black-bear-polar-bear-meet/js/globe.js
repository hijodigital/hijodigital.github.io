const projection = d3.geoOrthographic()
  .rotate([200, -68])
  .fitSize([600, 600], { type: "Sphere" });

const queue = d3.queue();

queue.defer(d3.json, "./json/countries.json");
queue.defer(d3.json, "./json/ranges.json");
queue.await(function(error, countries, ranges) {
  if (error) throw error;

  const path = d3.geoPath()
    .projection(projection);

  const svg = d3.select(".container-6 svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 600");

  svg.append("path")
    .datum({type: "Sphere"})
    .attr("class", "sphere")
    .attr("d", path);

  svg.append("path")
    .datum(d3.geoGraticule())
    .attr("class", "graticule")
    .attr("d", path);

  svg.selectAll(".country")
    .data(topojson.feature(countries, countries.objects.areas).features)
    .enter()
    .append("path")
    .attr("class", d => { return d.id + " " + d.properties.area; })
    .attr("d", path);

  svg.selectAll(".range")
    .data(topojson.feature(ranges, ranges.objects.areas).features)
    .enter()
    .append("path")
    .attr("class", d => { return d.id + " " + d.properties.area; })
    .attr("d", path);

  function render() {
    svg.selectAll("path")
      .attr("d", path);
  }

  d3.geoInertiaDrag(svg, render);

});
