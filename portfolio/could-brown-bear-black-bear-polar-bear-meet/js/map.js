(function() {
  const args = [
    {
      "container": {
        "step": 10,
        "map": 1,
        "percent": "100%",
        "align": "xMinYMin",
        "width": 600,
        "height": 600
      },
      "projection": {
        "angle": 90,
        "rotate": {
          "lambada": 67,
          "phi": -58
        },
        "scale": 300
      }
    },
    {
      "container": {
        "step": 10,
        "map": 2,
        "percent": "50%",
        "align": "xMaxYMin",
        "width": 300,
        "height": 300
      },
      "projection": {
        "angle": 90,
        "rotate": {
          "lambada": 0,
          "phi": -90
        },
        "scale": 150
      }
    },
    {
      "container": {
        "step": 10,
        "map": 3,
        "percent": "50%",
        "align": "xMinYMin",
        "width": 300,
        "height": 300
      },
      "projection": {
        "angle": 90,
        "rotate": {
          "lambada": 0,
          "phi": 90
        },
        "scale": 150
      }
    },
    {
      "container": {
        "step": 20,
        "map": 4,
        "percent": "100%",
        "align": "xMinYMin",
        "width": 300,
        "height": 300
      },
      "projection": {
        "angle": 180,
        "rotate": {
          "lambada": -50,
          "phi": -35
        },
        "scale": 150
      }
    },
    {
      "container": {
        "step": 10,
        "map": 5,
        "percent": "100%",
        "align": "xMinYMin",
        "width": 300,
        "height": 300
      },
      "projection": {
        "angle": 90,
        "rotate": {
          "lambada": -104,
          "phi": -30
        },
        "scale": 400
      }
    }
  ];

  const projection = d3.geoOrthographic();

  const queue = d3.queue();

  queue.defer(d3.json, "./json/countries.json");
  queue.defer(d3.json, "./json/ranges.json");
  queue.await(function(error, countries, ranges) {
    if (error) throw error;

    for (let i = 0; i < 5; i++) {
      render(args[i]);
    }

    function render(args) {
      const step = args.container.step;

      const graticule = d3.geoGraticule()
        .stepMajor([90, 360])
        .stepMinor([step, step]);

      const width = args.container.width,
        height = args.container.height,
        radius = width / 2;

      const svg = d3.select(".container-" + args.container.map + " svg")
        .attr("width", args.container.percent)
        .attr("height", args.container.percent)
        .attr("preserveAspectRatio", args.container.align + " meet")
        .attr("viewBox", "0 0 " + width + " " + height);

      projection.translate([radius, radius])
        .clipAngle(args.projection.angle)
        .rotate([
          args.projection.rotate.lambada,
          args.projection.rotate.phi
        ])
        .scale(args.projection.scale);

      const path = d3.geoPath()
        .projection(projection);

      svg.append("path")
        .datum({type: "Sphere"})
        .attr("class", "sphere")
        .attr("d", path);

      svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

      svg.selectAll(".country")
        .data(topojson.feature(countries, countries.objects.areas).features)
        .enter()
        .append("path")
        .attr("class", d => { return d.id + " " + d.properties.area; })
        .attr("d", path);

      const range = svg.append("g")
        .attr("class", "area");

      const tooltip = d3.select(".container-" + args.container.map)
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      range.selectAll(".range")
        .data(topojson.feature(ranges, ranges.objects.areas).features)
        .enter()
        .append("path")
        .attr("class", d => { return d.id + " " + d.properties.area; })
        .attr("d", path)
        .on("mouseover", function() {
          tooltip.transition()
            .duration(200)
            .style("opacity", .8);
        })
        .on("mousemove", function(d) {
          tooltip
            .text(d.properties.name)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 25) + "px");
        })
        .on("mouseout", function() {
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });

      }
    });
})();
