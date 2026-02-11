// set global constants
const svg = d3.select("svg");

const step = (960 - 96) / 31;

const daysInMonth = [31, 28, 31, 30, 31, 30];

const formatDay = d3.timeFormat("%a");

const formatMonth = d3.timeFormat("%B");

const scale = d3.scaleLinear()
  .range([8, 32]);

// append legend
const legend = svg.append("g")
  .attr("class", "workout")
  .attr("transform", "translate(430, 17)");

legend.append("rect")
  .attr("x", 0)
  .attr("y", -5)
  .attr("width", 14)
  .attr("height", 2);

legend.append("text")
  .attr("x", 17)
  .attr("y", 0)
  .text("Workout day");

// append month labels
svg.selectAll(".month-label")
  .attr("class", "month-label")
  .data(daysInMonth)
  .enter()
  .append("text")
  .attr("y", (d, i) => {
    return ((i * 64) + 80)
  })
  .attr("dy", ".35em")
  .text((d, i) => {
    return formatMonth(new Date(2017, i, 1));
  });

// load data
d3.csv("data.csv", function(error, data) {
  if (error) throw error;

  // reformat data
  data.map(d => {
    delete d.activity_calories;
    d.calories_burned = +d.calories_burned.replace(',', '');
    const date = d.date.split("/");
    d.day = +date[0];
    d.month = +date[1];
    delete d.date;
    delete d.distance;
    delete d.floors;
    d.minutes_fairly_active = +d.minutes_fairly_active.replace(',', '');
    delete d.minutes_lightly_active;
    delete d.minutes_sedentary;
    d.minutes_very_active = +d.minutes_very_active.replace(',', '');
    d.steps = +d.steps.replace(',', '');
    return d;
  });

  // initialise chart
  scale.domain([
    d3.min(data, d => { return +d.steps; }),
    d3.max(data, d => { return +d.steps; }),
  ]);

  const datum = svg.selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", d => {
      const x = 64 + (((31 - daysInMonth[d.month - 1]) / 2) * step) + (d.day * step);
      const y = ((d.month - 1) * 64) + 80;
      return "translate(" + x + ", " + y + ")";
    });

  datum.append("circle")
    .attr("r", d => {
      return scale(d.steps);
    });

  datum.append("text")
    .attr("class", "day")
    .attr("dy", ".35em")
    .text(d => {
      return formatDay(new Date(2017, (d.month - 1), d.day)).substring(0, 1);
    });

  datum.append("rect")
    .attr("class", "workout")
    .attr("x", 0 - (step / 4))
    .attr("y", 30)
    .attr("width", d => {
      return d.workout != 'none' ? (step / 2) : 0;
    })
    .attr("height", 2);

  // add event listener for change event
  d3.selectAll("select").on("change", update);

  // update chart
  function update() {
    scale.domain([
      d3.min(data, d => { return d[this.value]; }),
      d3.max(data, d => { return d[this.value]; }),
    ]);

    datum.select("circle")
      .transition()
      .duration(500)
      .attr("r", d => {
        return scale(d[this.value]);
      });
  }
});
