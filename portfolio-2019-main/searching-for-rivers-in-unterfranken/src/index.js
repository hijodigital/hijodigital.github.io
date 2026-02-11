import * as d3Base from "d3";
import * as topojson from "topojson";
import getSlug from "speakingurl";
import { graphScroll } from "graph-scroll";
const d3 = Object.assign(d3Base, { graphScroll });

const results = [
  ["albertshofen", "alzenau", "aschaffenburg", "bergrheinfeld", "buchbrunn", "buergstadt", "collenberg", "dettelbach", "dorfprozelten", "ebelsbach", "eibelstadt", "eisenheim", "elsenfeld", "eltmann", "erlabrunn", "erlenbach-a-main", "eussenheim", "faulbach", "frickenhausen-a-main", "gaedheim", "gemuenden-a-main", "gochsheim", "grafenrheinfeld", "grettstadt", "grossheubach", "grosswallstadt", "hafenlohr", "hasloch", "hassfurt", "himmelstadt", "kahl-a-main", "karbach", "karlstadt", "karlstein-a-main", "kitzingen", "kleinheubach", "kleinostheim", "kleinwallstadt", "klingenberg-a-main", "knetzgau", "kolitzheim", "kreuzwertheim", "laudenbach", "lohr-a-main", "mainaschaff", "mainstockheim", "margetshoechheim", "marktbreit", "marktheidenfeld", "marktsteft", "miltenberg", "neuendorf", "neustadt-a-main", "niedernberg", "nordheim-a-main", "obernburg-a-main", "ochsenfurt", "prosselsheim", "randersacker", "roden", "roellbach", "rothenfels", "roethlein", "sand-a-main", "schonungen", "schwarzach-a-main", "schweinfurt", "segnitz", "sennfeld", "sommerach", "sommerhausen", "stadtprozelten", "steinfeld", "stettfeld", "stockstadt-a-main", "sulzbach-a-main", "sulzfeld-a-main", "theres", "thuengersheim", "triefenstein", "veitshoechheim", "volkach", "waigolshausen", "winterhausen", "wipfeld", "wonfurt", "woerth-a-main", "wuerzburg", "zeil-a-main", "zell-a-main", "zellingen"],
  [],
  ["heigenbruecken", "schoellkrippen", "blankenbach", "geiselbach", "huckelheimer-wald", "oberleichtersbach", "thundorf-i-ufr", "muennerstadt", "trappstadt", "wollbach", "sandberg", "bundorfer-forst", "grossbardorf", "herbstadt", "riedbach", "ruedenhausen", "forstwald", "wiesthal", "aura-i-sinngrund", "erlenbach-b-marktheidenfeld", "frammersbach", "neuhuetten", "niederwerrn", "poppenhausen", "werneck", "geiersberg", "giebelstadt", "hausen-b-wuerzburg", "helmstadt", "leinach", "kuernach", "neubrunn", "eisingen", "gerbrunn", "unterpleichfeld", "johannesberg", "kleinkahl", "krombach", "sommerkahl", "heinrichsthaler-forst", "rothenbucher-forst", "waldaschaffer-forst", "mottener-forst-sued", "ramsthal", "rannungen", "geroda", "massbach", "motten", "strahlungen", "roedelmaier", "mellrichstadter-forst", "bundorf", "markt-einersheim", "moenchberg", "ruedenau", "kirchzell", "lefeatureersbach", "lidersbach", "partenstein", "rechtenbach", "karsbach", "forst-lohrerstrasse", "frammersbacher-forst", "sulzheim", "dittelbrunn", "nonnenkloster", "hoechberg", "rimpar", "rottendorf", "estenfeld", "heimbuchenthal", "laufach", "dammbach", "glattbach", "haibach", "sulzdorf-a-d-lederhecke", "willmars", "forst-schmalwasser-nord", "ermershausen", "aidhausen", "afeaturehausen", "breitbrunn", "koenigsberg-i-bay", "mainbernheim", "martinsheim", "prichsenstadt", "roedelsee", "seinsheim", "neunkirchen", "hausen", "schollbrunn", "bischbrunn", "fellen", "herrnwald", "ruppertshuettener-forst", "gerolzhofen", "michelau-i-steigerwald", "oberschwarzach", "schwanfeld", "schwebheim", "uechtelhausen", "buergerwald", "sonderhofen", "guentersleben", "hettstadt", "altertheim", "waldbrunn", "waldbuettelbrunn", "guttenberger-wald", "heinrichsthal", "rothenbuch", "bessenbach", "westerngrund", "wiesener-forst", "waldfensterer-forst", "dreistelzer-forst", "oerlenbach", "sondheim-v-d-rhoen", "sulzfeld", "sulzfelder-forst", "weigler", "hausen", "rentweinsdorf", "biebelried", "castell", "iphofen", "kleinlangheim", "willanzheim", "obernbreit", "schneeberg", "retzstadt", "thuengen", "esselbach", "goessenheim", "haurain", "langenprozeltener-forst", "geldersheim", "wasserlosen", "dingolshausen", "euerbach", "hundelshausen", "wustvieler-forst", "aub", "theilheim", "kirchheim", "oberpleichfeld", "reichenberg", "remlingen", "riedenheim", "buetthard", "geroldshausen", "mespelbrunn", "waldaschaff", "weibersbrunn", "wiesen", "grossostheim", "forst-hain-i-spessart", "rohrbrunner-forst", "sailaufer-forst", "schoellkrippener-forst", "nuedlingen", "sulzthal", "hendungen", "maroldsweisach", "pfarrweisach", "rauhenebrach", "burgpreppach", "ebern", "hofheim-i-ufr", "kirchlauter", "abtswind", "grosslangheim", "wiesenbronn", "wiesenthefeature", "altenbuch", "wiesentheid", "eschau", "hohe-wart", "urspringen", "arnstein", "birkenfeld", "fuerstl-loewenstein-scher-park", "partensteiner-forst", "burgjoss", "forst-aura", "luelsfeld", "stadtlauringen", "donnersdorf", "frankenwinheim", "stollbergerforst", "vollburg", "bergtheim", "greussenheim", "uettingen", "holzkirchen", "kist", "kleinrinderfeld", "gaukoenigshofen", "gelchsheim", "gramschatzer-wald", "irtenberger-wald"]
];

d3.graphScroll().sections(d3.selectAll(".map"));

d3.selectAll(".map").each(function() {

  const svg = d3.select(this);
  const id = +svg.attr("id");
  const path = d3.geoPath();
  const tooltip = d3.select(".tooltip");

  d3.json("json/lower-franconia.json", function(error, topology) {
    if (error) throw error;

    const g = svg.selectAll("path")
      .data(topojson.feature(topology, topology.objects.features).features)
      .enter()
      .append("g")
      .attr("class", d => {
        const feature = d.properties.feature + " ";
        const slug = getSlug(d.properties.name);
        const status = results[id].indexOf(slug) > -1 ? " active" : "";
        return feature + slug + status;
      });

    svg.selectAll(".river")
      .append("path")
      .attr("d", path)
      .style("stroke-width", d => { return d.properties.name == "Main" ? 3 : 1; });

    svg.selectAll(".community")
      .append("path")
      .attr("d", path)
      .on("mouseover", function() {
        tooltip.transition()
          .duration(200)
          .style("opacity", 1);
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

    svg.selectAll(".marker")
      .append("text")
      .attr("transform", d => { return "translate(" + path.centroid(d) + ")"; })
      .text(d => { return d.properties.name });

    svg.append("circle")
      .attr("class", "range")
      .attr("cx", 557)
      .attr("cy", 280)
      .attr("r", results[id].length > 0 ? 0 : 70);

    svg.append("circle")
      .attr("class", "desk")
      .attr("cx", 557)
      .attr("cy", 280)
      .attr("r", results[id].length > 0 ? 0 : 3);

    /* svg.on("mousedown.log", function () {
      console.log(d3.mouse(this));
    }); */

  });
});
