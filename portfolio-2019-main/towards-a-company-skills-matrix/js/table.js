/**
 * @file
 * Skills matrix.
 */

// Generate random data.
const names = ["Steve Hughes", "Justin Phillips", "Jim Miller", "Frank Cooper", "Marcel Hernandez", "Samuel Gonzalez", "Gerald Butler", "Carl Thompson", "Roger Long", "Kenneth Watson", "Patrick Sanders", "Albert Kelly", "Phillip Moore", "Matt Rivera", "Will Henderson", "David Price", "Carlos Torres", "George Ramirez", "Raymond Bell", "Clarence Stewart", "Henry Bailey", "Steve Harris", "John Young", "Robert Alexander", "Joseph Clark", "Ryan Hall", "Brian Brown", "Thomas Cook", "Howard Roberts", "Ernest James", "Jeffrey Howard", "Jerry Foster", "Philip Lewis", "Joe Thomas", "Charles Bennett", "Alberto Martinez", "Terry Adams", "Roy Peterson", "Randy Mitchell", "Eugene Ross", "Douglas Wood", "Joshua Ward", "Elliot Baker", "Lawrence Cole", "Eric Johansson", "Chris White", "Arthur Brooks", "Michael Powell", "Louis Griffin", "Martin Flores"];
const raw = [];
for (let name of names) {
  const skills = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
  for (let i = 0; i < skills; i++) {
    const commonTech = ["CSS", "Drupal", "Git", "JavaScript", "PHP"];
    const uncommonTech = ["Angular", "Ansible", "Backbone", "Behat", "Composer", "Docker", "Elasticsearch", "EpiServer", "Gulp", "HTML5", "Java", "jQuery", "Kubernetes", "Laravel", "Less", "Linux", "MySQL", "NGINX", "NPM", "OAuth", "Pattern Lab", "Postgres", "Python", "REST", "RabbitMQ", "React", "Redux", "Sass", "Solr", "Symfony", "Wordpress"];
    let length = commonTech.length;
    let random = Math.floor(Math.random() * (length - 1 + 1)) + 1;
    let index = random - 1;
    let tech = commonTech.splice(index, 1);
    if (i > 3) {
      length = uncommonTech.length;
      random = Math.floor(Math.random() * (length - 1 + 1)) + 1;
      index = random - 1;
      tech = uncommonTech.splice(index, 1);
    }
    const skill = {
      name: name,
      skill: tech[0],
      basic: true,
      projects: Math.floor(Math.random() * 100) + 1 > 50,
      student: Math.floor(Math.random() * 100) + 1 > 90,
      teacher: Math.floor(Math.random() * 100) + 1 > 97
    };
    raw.push(skill);
  }
}

// Get filters width.
const filtersWidth = d3.select(".skills-matrix__filters").node()
  .getBoundingClientRect()
  .width;

// Toggle filters display.
let selection = ".skills-matrix__filters-display-toggle a";
d3.select(selection).on("click", function() {
  if (this.text === "Hide filters") {
    d3.select(this).text("Show filters");
    d3.select(".skills-matrix__filters").transition()
      .style("width", filtersWidth + "px")
      .duration(200)
      .style("width", "0px");
  }
  else {
    d3.select(this).text("Hide filters");
    d3.select(".skills-matrix__filters").transition()
      .style("width", "0px")
      .duration(200)
      .style("width", filtersWidth + "px");
  }
});

// Generate table.
selection = ".skills-matrix__outer .skills-matrix__inner";
const table = d3.select(selection).append("table");

// Initialise matrix (all skills at projects level).
selection = ".form-checkbox.skills-matrix__level, .form-checkbox[value=angular], .form-checkbox[value=backbone], .form-checkbox[value=css], .form-checkbox[value=jquery], .form-checkbox[value=javascript], .form-checkbox[value=less], .form-checkbox[value=npm], .form-checkbox[value=react], .form-checkbox[value=redux], .form-checkbox[value=sass]";
d3.selectAll(selection).property("checked", true);
update();

// Full matrix.
d3.select(".skills-matrix__check-all").on("click", () => {
  d3.selectAll(".form-checkbox").property("checked", true);
  update();
});

// Clear matrix.
d3.select(".skills-matrix__clear-all").on("click", () => {
  d3.selectAll(".form-checkbox").property("checked", false);
  update();
});

// Update matrix.
d3.selectAll(".form-checkbox").on("click", update);

// Update table.
function update () {

  // Destroy old table head/body.
  table.selectAll("*").remove();

  // Get checked levels.
  const selection = ".form-checkbox.skills-matrix__level:checked";
  const levels = d3.selectAll(selection).nodes().map(d => d.value);

  // Generate new rows.
  const rows = build();

  // Generate new table head/body.
  table.append("thead")
    .append("tr")
    .selectAll("th")
    .data(rows.head)
    .enter()
    .append("th")
    .classed("skills-matrix--total", (d, i) => i === 1)
    .append("div")
    .text(d => d);
  const tr = table.append("tbody")
    .selectAll("tr")
    .data(rows.body)
    .enter()
    .append("tr");
  const td = tr.selectAll("td")
    .data(d => d)
    .enter()
    .append((d, i) => {
      return i ? document.createElement("td") : document.createElement("th");
    })
    .classed("skills-matrix--total", (d, i) => i === 1)
    .classed("skills-matrix--basic", (d, i) => {
      return typeof d === "object" && d.basic && i > 1 && levels.includes("basic");
    })
    .classed("skills-matrix--projects", (d, i) => {
      return typeof d === "object" && d.projects && i > 1 && levels.includes("projects");
    })
    .classed("skills-matrix--student", (d, i) => {
      return typeof d === "object" && d.student && i > 1 && levels.includes("student");
    })
    .classed("skills-matrix--teacher", (d, i) => {
      return typeof d === "object" && d.teacher && i > 1 && levels.includes("teacher");
    })
    .append("div")
    .text((d, i) => i > 1 ? "" : d);

  // Fade updates in.
  table.style("opacity", 0)
    .transition()
    .duration(400)
    .style("opacity", 1);
}

// Build rows.
function build() {

  // Generate desired data set.
  selection = ".form-checkbox.skills-matrix__level:checked";
  const levels = d3.selectAll(selection).nodes()
    .map(d => d.value);
  selection = ".form-checkbox.skills-matrix__skill:checked + label";
  const skills = d3.selectAll(selection).nodes()
    .map(d => d.innerHTML);
  const data = raw.filter(e => {
    return skills.includes(e.skill) && levels.some(i => e[i]);
  });

  // Generate distinct people/skills.
  const distinctPeople = [], distinctSkills = [];
  data.forEach(e => {
    if (!distinctPeople.includes(e.name)) {
      distinctPeople.push(e.name);
    }
    if (!distinctSkills.includes(e.skill)) {
      distinctSkills.push(e.skill);
    }
  });
  distinctPeople.sort();
  distinctSkills.sort();

  // Generate table head row.
  let tableHeadRow = [];
  if (data.length) {
    tableHeadRow = ["", "Total"].concat(distinctPeople);
  }

  // Generate table body rows.
  const tableBodyRows = distinctSkills.map(e => {

    // Identify skilled people.
    const skilledPeople = data.filter(o => o.skill === e);

    // Construct table row.
    const tableBodyRow = [];

    // Add skill label.
    tableBodyRow.push(e);

    // Add total skilled.
    tableBodyRow.push(skilledPeople.length);

    // Add skill object or undefined.
    distinctPeople.forEach(e => {
      tableBodyRow.push(skilledPeople.find(o => o.name === e));
    });
    return tableBodyRow;
  });

  // Sort table body rows by total skilled in descending order.
  tableBodyRows.sort(function(a, b) {
    return d3.descending(a[1], b[1]);
  });
  return {"head": tableHeadRow, "body": tableBodyRows};
}
