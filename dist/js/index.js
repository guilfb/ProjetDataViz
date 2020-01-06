'use strict';

var completeData = null;

// FOR THE MAP
var widthMap = 880,
  heightMap = 520;

var canvas = d3.select(".map")
  .append("canvas")
  .attr("id","canvas")
  .style("position","absolute")
  .style("background-image","url(./Carte_Paris.svg)")
  .style("background-size","contain")
  .style("background-repeat","no-repeat")
  .attr( "width", widthMap )
  .attr( "height", heightMap )
  .attr("x",0)
  .attr("y",0);

var svgMap = d3.select( ".map" )
  .append( "svg" )
  .style("position","absolute")
  .attr( "width", widthMap )
  .attr( "height", heightMap );

var g = svgMap.append( "g" );

const projection = d3.geoConicConformal()
  .center([2.357, 48.8563])
  .scale(250000)
  .translate([widthMap/2, heightMap/2])
  .angle([-1.2]);

var path = d3.geoPath().projection(projection);

var heat = simpleheat('canvas');
let heatarray = [];
let selectedArrondissements =
  ["75001","75002","75003","75004","75005",
    "75006","75007","75008","75009","75010",
    "75011","75012","75013","75014","75015",
    "75016","75017","75018","75019","75020"];

// FOR BAR CHART
var margin = { top: 20, right: 20, bottom: 20,left: 20 };
var width = 600 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;
var hauteurBarre = 10;

var svg = d3.select(".smallCharts").append("svg")
  .attr("width", 500 + 90 + 20)
  .attr("height", 340 + 60)
  .style("float","left")
  .style("margin-top","10px")
  .style("margin-left","22.5px")
  .style("margin-bottom","10px")
  .append("g")
  .attr("transform", "translate(" + 3 * margin.left + "," + (3*margin.top + 10) + ")");

var x = d3.scaleLinear()
  .range([0, 500]);

var y = d3.scaleBand()
  .range([0, 275])
  .padding(0.1)
/*
var y = d3.scaleLinear()
  .range([0, 275]);
*/
var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);

var gBarChart = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

gBarChart.append("text")
  .attr("text-anchor", "middle")
  .attr("font-family", "MontSerrat")
  .attr("font-size","13px")
  .attr("transform", "translate(250,290)")
  .text("Nombre de connexions");

gBarChart.append("text")
  .attr("text-anchor", "middle")
  .attr("font-family", "MontSerrat")
  .attr("font-size","13px")
  .attr("transform", "translate(-55,130)rotate(-90)")
  .text("Heures (format 24h)");

gBarChart.append("text")
  .attr("text-anchor", "middle")
  .attr("font-family", "MontSerrat")
  .attr("font-size","20px")
  .attr("transform", "translate(205,-50)")
  .text("Nombre de connexions par heure");

var tabHours = [24];

let selectedHours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

// FOR LINE CHART
var svgLineChart = d3.select(".smallCharts").append("svg")
  .attr("width", 500 + 90 + 20)
  .attr("height", 340 + 60)
  .style("float","left")
  .style("margin-top","10px")
  .style("margin-left","22.5px")
  .style("margin-bottom","10px")
  .append("g")
  .attr("transform", "translate(" + 3*margin.left + "," + (3 * margin.top +10 ) + ")");

var xScale = d3.scaleLinear()
  .domain([0, 24])
  .range([0, 500]);

var yScale = d3.scaleLinear()
  .domain([0, 3000])
  .range([275, 0]);

var line = d3.line()
  .x(function(d,i) { return xScale(i); })
  .y(function(d) { return yScale(d.download/1000000000); })
  .curve(d3.curveMonotoneX)

var line_bis = d3.line()
  .x(function(d, i) { return xScale(i); })
  .y(function(d) { return yScale(d.upload/1000000000); })
  .curve(d3.curveMonotoneX);

var gLineChart = svgLineChart.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

gLineChart.append("text")
  .attr("text-anchor", "middle")
  .attr("font-family", "MontSerrat")
  .attr("font-size","13px")
  .attr("transform", "translate(250,290)")
  .text("Heures (format 24h)");

gLineChart.append("text")
  .attr("text-anchor", "middle")
  .attr("font-family", "MontSerrat")
  .attr("font-size","13px")
  .attr("transform", "translate(-55,130)rotate(-90)")
  .text("Données (en GigaOctets)");

gLineChart.append("text")
  .attr("text-anchor", "middle")
  .attr("font-family", "MontSerrat")
  .attr("font-size","20px")
  .attr("transform", "translate(205,-50)")
  .text("Données (en GigaOctets) par heure (format 24h)");

// FOR BAR CHART ARRONDISSEMENT
var svgBarChartArrondissement = d3.select(".smallCharts").append("svg")
  .attr("width", 500 + 90 + 20)
  .attr("height", 340 + 60)
  .style("float","left")
  .style("margin-top","10px")
  .style("margin-right","22.5px")
  .style("margin-left","22.5px")
  .style("margin-bottom","10px")
  .append("g")
  .attr("transform", "translate(" + 0 + "," + margin.top + ")");

var xArrondissement = d3.scaleBand().rangeRound([0, 500]).padding(0.1),
  yArrondissement = d3.scaleLinear().rangeRound([height, 0]);

var xArrondissementAxis = d3.axisBottom(xArrondissement);
var yArrondissementAxis = d3.axisLeft(yArrondissement);

var gArrondissement = svgBarChartArrondissement.append("g")
  .attr("transform", "translate(" + 3*margin.left + "," + (3*margin.top+5) + ")");

gArrondissement.append("text")
  .attr("text-anchor", "middle")
  .attr("font-family", "MontSerrat")
  .attr("font-size","13px")
  .attr("transform", "translate(250,295)")
  .text("Arrondissements Parisiens");

gArrondissement.append("text")
  .attr("text-anchor", "middle")
  .attr("font-family", "MontSerrat")
  .attr("font-size","13px")
  .attr("transform", "translate(-35,130)rotate(-90)")
  .text("Données (en GigaOctets)");

gArrondissement.append("text")
  .attr("text-anchor", "middle")
  .attr("font-family", "MontSerrat")
  .attr("font-size","20px")
  .attr("transform", "translate(205,-50)")
  .text("Données (en GigaOctets) par arrondissement");

var tabCp = [20];

// DECLARATION TABHOURS ET TABCP
var i;
for (i=0;i<24;i++){
  tabHours[i]={
    hours: i,
    frequency: 0,
    download: 0,
    upload: 0
  }
}

for (i=0;i<21;i++){
  tabCp[i]={
    codePostal: i,
    donnees: 0,
    upload: 0,
    download: 0
  }
}

// FOR PIECHART (HORLOGE INDICATRICE)
var widthPie = 350,
  heightPie = 350,
  marginPie = 40;

var radiusPie = Math.min(widthPie, heightPie) / 2 - marginPie;

var svgPie = d3.select("#pieChart")
  .append("svg")
  .attr("width", widthPie)
  .attr("height", heightPie)
  .append("g")
  .attr("transform", "translate(" + widthPie / 2 + "," + heightPie / 2 + ")");

// FONCTION DECLARANT LE BARCHART
function barChart() {
  var maxFrequency = d3.max(tabHours, function(d) { return d.frequency});

  y.domain(tabHours.map(function(d) { return d.hours; }).reverse())
  x.domain([0, maxFrequency]);
  //y.domain([0,24].reverse());

  svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(0,275)")
    .style("font-size","12px")
    .call(xAxis);

  var gy = svg.append("g")
    .attr("class", "axis axis--y")
    .style("font-size","12px")
    .call(yAxis);

  svg.selectAll(".bar")
    .data(tabHours.reverse())
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("height", 11)
    .style("opacity",0.7)
    .attr("y", function(d,i) { return y(d.hours)-5.5; })
    .on("click", function(d) {
      if(selectedHours.includes(d.hours)) {
        selectedHours.splice(selectedHours.indexOf(d.hours),1);

        d3.select(this)
          .transition()
          .duration(500)
          .style("fill","#808080");

        svgLineChart.selectAll(".dot")
          .filter((item,index) => {
            return item.hours == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","#808080");

        svgLineChart.selectAll(".dot_bis")
          .filter((item,index) => {
            return item.hours == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","#808080");

        svgPie.selectAll('.piePart')
          .filter((item) => {
            let hourClicked = parseInt(item.data.key);
            return hourClicked == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","#808080")
      } else {
        selectedHours.push(parseInt(d.hours,10));

        d3.select(this)
          .transition()
          .duration(500)
          .style("fill","blue");

        svgLineChart.selectAll(".dot")
          .filter((item,index) => {
            return item.hours == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","#ffab00");

        svgLineChart.selectAll(".dot_bis")
          .filter((item,index) => {
            return item.hours == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","#000000");

        svgPie.selectAll('.piePart')
          .filter((item) => {
            let hourClicked = parseInt(item.data.key);
            return hourClicked == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","blue")
      }

      indexHostpots();
      majBarChartArr()
    })
    .attr("width", 0)
    .transition()
    .duration(300)
    .delay(function (d, i) {
      return i * 50;
    })
    .attr("width", function(d) { return x(d.frequency); });

  Object.assign(svg, {
    update(sorttype) {
      y.domain(tabHours.sort(sorttype).map(d => parseInt(d.hours)).reverse());
      svg.transition().duration(500);

      svg.selectAll(".bar").data(tabHours.reverse(), d => d.hours)
        .order()
        .transition()
        .duration(500)
        .attr("y", (d) => y(d.hours)-5.5)

      gy.call(yAxis);
    }
  });
}

function lineChart() {
  var maxFrequencyUpload = d3.max(tabHours, function(d) { return d.upload});
  var maxFrequencyDownload = d3.max(tabHours, function(d) { return d.download});

  if(maxFrequencyUpload >= maxFrequencyDownload) {
    yScale.domain([0, maxFrequencyUpload/1000000000]);
  } else {
    yScale.domain([0, maxFrequencyDownload/1000000000]);
  }

  svgLineChart.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(0,275)")
    .style("font-size","12px")
    .call(d3.axisBottom(xScale));

  svgLineChart.append("g")
    .attr("class", "axis axis--y")
    .style("font-size","12px")
    .call(d3.axisLeft(yScale));

  var line_init = d3.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(0); })
    .curve(d3.curveMonotoneX);

  svgLineChart.append("path")
    .datum(tabHours)
    .attr("class", "line")
    .attr("d", line_init)
    .merge(svgLineChart.selectAll(".line"))
    .transition()
    .duration(1500)
    .attr("d", line)

  var line_bis_init = d3.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(0); })
    .curve(d3.curveMonotoneX);

  svgLineChart.append("path")
    .datum(tabHours)
    .attr("class", "line_bis")
    .attr("d", line_bis_init)
    .merge(svgLineChart.selectAll(".line_bis"))
    .transition()
    .duration(1500)
    .attr("d", line_bis)

  svgLineChart.selectAll(".dot")
    .data(tabHours)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", 275)
    .attr("r", 0)
    .on("click", function(d) {
      if(selectedHours.includes(d.hours)) {
        selectedHours.splice(selectedHours.indexOf(d.hours),1);

        d3.select(this)
          .transition()
          .duration(500)
          .style("fill","#808080");

        svg.selectAll(".bar")
          .filter((item) => {
            return item.hours == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","#808080");

        svgLineChart.selectAll(".dot_bis")
          .filter((item) => {
            return item.hours == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","#808080")

        svgPie.selectAll('.piePart')
          .filter((item) => {
            let hourClicked = parseInt(item.data.key);
            return hourClicked == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","#808080")
      } else {
        selectedHours.push(parseInt(d.hours,10));

        d3.select(this)
          .transition()
          .duration(500)
          .style("fill","#ffab00");

        svg.selectAll(".bar")
          .filter((item) => {
            return item.hours == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","blue");

        svgLineChart.selectAll(".dot_bis")
          .filter((item) => {
            return item.hours == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","#000000")

        svgPie.selectAll('.piePart')
          .filter((item) => {
            let hourClicked = parseInt(item.data.key);
            return hourClicked == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","blue")
      }

      indexHostpots();
      majBarChartArr()
    })
    .transition()
    .duration(1500)
    .attr("cy", function(d) { return yScale(d.download/1000000000) })
    .attr("r", 7)

  svgLineChart.selectAll(".dot_bis")
    .data(tabHours)
    .enter().append("circle")
    .attr("class", "dot_bis")
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", 275)
    .attr("r", 0)
    .on("click", function(d) {
      if(selectedHours.includes(d.hours)) {
        selectedHours.splice(selectedHours.indexOf(d.hours),1);

        d3.select(this)
          .transition()
          .duration(500)
          .style("fill","#808080");

        svg.selectAll(".bar")
          .filter((item) => {
            return item.hours == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","#808080");

        svgLineChart.selectAll(".dot")
          .filter((item) => {
            return item.hours == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","#808080")

        svgPie.selectAll('.piePart')
          .filter((item) => {
            let hourClicked = parseInt(item.data.key);
            return hourClicked == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","#808080")
      } else {
        selectedHours.push(parseInt(d.hours,10));

        d3.select(this)
          .transition()
          .duration(500)
          .style("fill","black");

        svg.selectAll(".bar")
          .filter((item) => {
            return item.hours == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","blue");

        svgLineChart.selectAll(".dot")
          .filter((item) => {
            return item.hours == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","#ffab00")

        svgPie.selectAll('.piePart')
          .filter((item) => {
            let hourClicked = parseInt(item.data.key);
            return hourClicked == d.hours
          })
          .transition()
          .duration(500)
          .style("fill","blue")
      }
      indexHostpots();
      majBarChartArr()
    })
    .transition()
    .duration(1500)
    .attr("cy", function(d) { return yScale(d.upload/1000000000) })
    .attr("r", 7)
}

function barChartArrondissement() {
  const maxUploadDownload = d3.max(tabCp, function(d) { return d.upload + d.download; });

  xArrondissement.domain(tabCp.map(function(d) { return d.codePostal; }));
  yArrondissement.domain([0, maxUploadDownload/1000000000]);

  var gxArrondissement = gArrondissement.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(0," + height + ")")
    .style("font-size","12px")
    .call(xArrondissementAxis);

  var gyArrondissement = gArrondissement.append("g")
    .attr("class", "axis axis--y")
    .style("font-size","12px")
    .call(yArrondissementAxis);

  gArrondissement.selectAll(".bar")
    .data(tabCp)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("id","databar")
    .style("fill","#ffab00")
    .attr("x", function(d) { return xArrondissement(d.codePostal); })
    .attr("y", function(d) { return yArrondissement(d.download/1000000000); })
    .on("click", function(d) {
      let arrondissementClicked = d.codePostal;

      if(d.codePostal.toString().length == 1) {
        arrondissementClicked = "7500" + d.codePostal
      } else {
        arrondissementClicked = "750" + d.codePostal
      }

      if(!selectedArrondissements.includes(arrondissementClicked)) {
        selectedArrondissements.push(arrondissementClicked);

        d3.select(this)
          .transition()
          .duration(500)
          .style("fill",'#ffab00');

        gArrondissement.selectAll(".bar_bis")
          .filter(function(d) {
            let thisArrondissement = d.codePostal;
            if(d.codePostal.toString().length == 1) {
              thisArrondissement = "7500" + d.codePostal
            } else {
              thisArrondissement = "750" + d.codePostal
            }
            return thisArrondissement == arrondissementClicked;
          })
          .transition()
          .duration(500)
          .style("fill","#000000");

        svgMap.selectAll("path")
          .filter(function (d) {
            let thisArrondissement = "750" + d.properties.n_sq_ar.toString().split("7500000")[1];
            return thisArrondissement == arrondissementClicked;
          })
          .transition()
          .duration(500)
          .style("fill", "#1E90FF");
      } else {
        selectedArrondissements.splice(selectedArrondissements.indexOf(arrondissementClicked),1);
        d3.select(this)
          .transition()
          .duration(500)
          .style("fill",'#808080');

        gArrondissement.selectAll(".bar_bis")
          .filter(function(d) {
            let thisArrondissement = d.codePostal;
            if(d.codePostal.toString().length == 1) {
              thisArrondissement = "7500" + d.codePostal
            } else {
              thisArrondissement = "750" + d.codePostal
            }

            return thisArrondissement == arrondissementClicked;
          })
          .transition()
          .duration(500)
          .style("fill","#808080");

        svgMap.selectAll("path")
          .filter(function (d) {
            let thisArrondissement = "750" + d.properties.n_sq_ar.toString().split("7500000")[1];
            return thisArrondissement == arrondissementClicked;
          })
          .transition()
          .duration(500)
          .style("fill", "#B0E0E6");
      }

      indexHostpots();
      majBarLineChart()
    })
    .attr("width", xArrondissement.bandwidth())
    .attr("y",  () => { return height; })
    .attr("height", 0)
    .transition()
    .duration(300)
    .delay(function (d, i) {
      return i * 50;
    })
    .attr("y",  d => { return yArrondissement(d.download/1000000000); })
    .attr("height",  d => { return height - yArrondissement(d.download/1000000000); });

  gArrondissement.selectAll(".bar_bis")
    .data(tabCp)
    .enter().append("rect")
    .attr("class", "bar_bis")
    .attr("id","databar")
    .style("fill","#000000")
    .attr("x", function(d) { return xArrondissement(d.codePostal); })
    .attr("y", function(d) { return yArrondissement(d.download/1000000000); })
    .on("click", function(d) {
      let arrondissementClicked = d.codePostal;

      if(d.codePostal.toString().length == 1) {
        arrondissementClicked = "7500" + d.codePostal
      } else {
        arrondissementClicked = "750" + d.codePostal
      }

      if(!selectedArrondissements.includes(arrondissementClicked)) {
        selectedArrondissements.push(arrondissementClicked);
        d3.select(this)
          .transition()
          .duration(500)
          .style("fill",'#000000');

        gArrondissement.selectAll(".bar")
          .filter(function(d) {
            let thisArrondissement = d.codePostal;
            if(d.codePostal.toString().length == 1) {
              thisArrondissement = "7500" + d.codePostal
            } else {
              thisArrondissement = "750" + d.codePostal
            }

            return thisArrondissement == arrondissementClicked;
          })
          .transition()
          .duration(500)
          .style("fill","#ffab00");

        svgMap.selectAll("path")
          .filter(function (d) {
            let thisArrondissement = "750" + d.properties.n_sq_ar.toString().split("7500000")[1];
            return thisArrondissement == arrondissementClicked;
          })
          .transition()
          .duration(500)
          .style("fill", "#1E90FF");
      } else {
        selectedArrondissements.splice(selectedArrondissements.indexOf(arrondissementClicked),1);

        d3.select(this)
          .transition()
          .duration(500)
          .style("fill",'#808080');

        gArrondissement.selectAll(".bar")
          .filter(function(d) {
            let thisArrondissement = d.codePostal;
            if(d.codePostal.toString().length == 1) {
              thisArrondissement = "7500" + d.codePostal
            } else {
              thisArrondissement = "750" + d.codePostal
            }

            return thisArrondissement == arrondissementClicked;
          })
          .transition()
          .duration(500)
          .style("fill","#808080");

        svgMap.selectAll("path")
          .filter(function (d) {
            let thisArrondissement = "750" + d.properties.n_sq_ar.toString().split("7500000")[1];
            return thisArrondissement == arrondissementClicked;
          })
          .transition()
          .duration(500)
          .style("fill", "#B0E0E6");
      }

      indexHostpots();
      majBarLineChart()
    })
    .attr("width", xArrondissement.bandwidth())
    .attr("y",  () => { return height; })
    .attr("height", 0)
    .transition()
    .duration(300)
    .delay(function (d, i) {
      return i * 50;
    })
    .attr("y",  d => { return yArrondissement((d.download+d.upload)/1000000000); })
    .attr("height",  d => { return height - yArrondissement(d.upload/1000000000); });

  Object.assign(svgBarChartArrondissement, {
    update(sorttype) {
      xArrondissement.domain(tabCp.sort(sorttype).map(d => d.codePostal));
      svgBarChartArrondissement.transition().duration(500);

      gArrondissement.selectAll(".bar").data(tabCp, d => d.codePostal)
        .order()
        .transition()
        .duration(500)
        .attr("x", d => xArrondissement(d.codePostal));

      gArrondissement.selectAll(".bar_bis").data(tabCp, d => d.codePostal)
        .order()
        .transition()
        .duration(500)
        .attr("x", d => xArrondissement(d.codePostal));

      gxArrondissement.call(xArrondissementAxis);
    }
  });
}

// TOUT CE QUI CONCERNE LA MAP
// FONCTION PERMETTANT L'AFFICHAGE DES HOTSPOTS
function indexHostpots() {
  d3.csv("indexHotspots.csv").then(function(data) {
    heatarray = [];
    data.forEach(function(obj) {
      if(obj.CodeSite != "") {
        if(selectedArrondissements.includes(obj.CodePostal)) {
          heatarray.push([obj.CodeSite,projection([obj.Longitude,obj.Latitude])[0],projection([obj.Longitude,obj.Latitude])[1],0])
        }
      }
    });

    svgMap.selectAll("circle")
      .data(data).enter()
      .append("circle")
      .attr("cx", function (d) { return projection([d.Longitude,d.Latitude])[0]; })
      .attr("cy", function (d) { return projection([d.Longitude,d.Latitude])[1]; })
      .attr("r", "3px")
      .attr("fill", "red")
      .on("click", function(d) {
        alert(d.NomSite + "\n" +
          d.Adresse + "\n" +
          d.CodePostal + "\n" +
          d.NbBornes + " bornes sur ce site.")
      })
      .on("mousemove", function(d) {
        d3.select(this)
          .attr("r","8px")
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .attr("r","3px")
      })

  }).then(() => {
    dataParisHotspotslight();
  })
}

// FONCTION PERMETTANT L'AFFICHAGE DE LA HEAT MAP
function dataParisHotspotslight() {
  let data = completeData;
  data.forEach(function (obj) {
    var datetime = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");
    let heure = datetime(obj.DateDebut).getHours();
    if(selectedHours.includes(heure)) {
      heatarray.forEach(function(tab,i) {
        if(heatarray[i].includes(obj.CodeSite)) {
          heatarray[i][3] += 1;
        }
      });
    }
  });
  heatArray()
}

// FONCTION PERMETTANT LE CALCUL ET LAFFICHAGE DU HEAT ARRAY POUR LA MAP
function heatArray() {
  heatarray.forEach((data,i) => {
    heatarray[i] = heatarray[i].slice(1)
  });
  var maxTotal = d3.max(heatarray, function(d) { return parseInt(d,10) });
  heat.data(heatarray).max(maxTotal/10).radius(15,15).draw()
  d3.select("#MinConnection").text("0.1")
  d3.select("#MaxConnection").text("0.2")
}

function geoJson(json) {
  svgMap.selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill",'#1E90FF')
    .style("stroke","#D9EDF7")
    .style("opacity","0.2")
    .on('click', function(d) {
      let arrondissementClicked = "750" + d.properties.n_sq_ar.toString().split("7500000")[1];

      if(!selectedArrondissements.includes(arrondissementClicked)) {
        selectedArrondissements.push(arrondissementClicked);
        d3.select(this)
          .style("fill",'#1E90FF');

        gArrondissement.selectAll(".bar")
          .filter(function (d) {
            let thisArrondissement = d.codePostal;
            if(thisArrondissement.toString().length == 1) {
              thisArrondissement = "7500" + d.codePostal
            } else {
              thisArrondissement = "750" + d.codePostal
            }
            return thisArrondissement == arrondissementClicked;
          })
          .style("fill", "#ffab00");

        gArrondissement.selectAll(".bar_bis")
          .filter(function (d) {
            let thisArrondissement = d.codePostal;
            if(thisArrondissement.toString().length == 1) {
              thisArrondissement = "7500" + d.codePostal
            } else {
              thisArrondissement = "750" + d.codePostal
            }
            return thisArrondissement == arrondissementClicked;
          })
          .style("fill", "#000000");
      } else {
        selectedArrondissements.splice(selectedArrondissements.indexOf(arrondissementClicked),1);
        d3.select(this)
          .style("fill",'#B0E0E6');

        gArrondissement.selectAll(".bar")
          .filter(function (d) {
            let thisArrondissement = d.codePostal;
            if(thisArrondissement.toString().length == 1) {
              thisArrondissement = "7500" + d.codePostal
            } else {
              thisArrondissement = "750" + d.codePostal
            }
            return thisArrondissement == arrondissementClicked;
          })
          .style("fill", "#808080");
        gArrondissement.selectAll(".bar_bis")
          .filter(function (d) {
            let thisArrondissement = d.codePostal;
            if(thisArrondissement.toString().length == 1) {
              thisArrondissement = "7500" + d.codePostal
            } else {
              thisArrondissement = "750" + d.codePostal
            }
            return thisArrondissement == arrondissementClicked;
          })
          .style("fill", "#808080");
      }

      majBarLineChart();
      indexHostpots()
    })
}

// FONCTION PERMETTANT L'AFFICHAGE DU PIE CHART
function initPieChart() {
  var data = {
    0:1, 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1,
    10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1, 17:1, 18:1, 19:1,
    20:1, 21:1, 22:1, 23:1,
  };

  var labelArc = d3.arc()
    .outerRadius(radiusPie + 15)
    .innerRadius(radiusPie + 15);

  var pie = d3.pie()
    .value(function(d) { return d.value; });
  var data_ready = pie(d3.entries(data));

  svgPie.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "MontSerrat")
    .attr("font-size","20px")
    .attr("transform", "translate(0,175)")
    .text("Heures sélectionnées");

  svgPie.selectAll('.piePart')
    .data(data_ready)
    .enter()
    .append('path')
    .attr("class","piePart")
    .attr('d', d3.arc()
      .innerRadius(1)
      .outerRadius(0)
    )
    .attr('fill', 'blue')
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity",0.7)
    .on('click', function(d) {
      let hourClicked = parseInt(d.data.key);
      if(selectedHours.includes(hourClicked)) {
        selectedHours.splice(selectedHours.indexOf(hourClicked),1);

        d3.select(this)
          .style('fill','#808080');

        svg.selectAll(".bar")
          .filter((item) => {
            return item.hours == hourClicked
          })
          .style("fill","#808080");

        svgLineChart.selectAll(".dot")
          .filter((item) => {
            return item.hours == hourClicked
          })
          .style("fill","#808080");

        svgLineChart.selectAll(".dot_bis")
          .filter((item) => {
            return item.hours == hourClicked
          })
          .style("fill","#808080")
      } else {
        selectedHours.push(hourClicked);
        d3.select(this)
          .style('fill','blue');

        svg.selectAll(".bar")
          .filter((item) => {
            return item.hours == hourClicked
          })
          .style("fill","blue");

        svgLineChart.selectAll(".dot")
          .filter((item) => {
            return item.hours == hourClicked
          })
          .style("fill","#ffab00");

        svgLineChart.selectAll(".dot_bis")
          .filter((item) => {
            return item.hours == hourClicked
          })
          .style("fill","#000000")
      }

      indexHostpots();
      majBarChartArr()
    })
    .transition()
    .duration(1500)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radiusPie)
    );

  svgPie.selectAll('.textPie')
    .data(data_ready)
    .enter()
    .append('text')
    .attr("class","textPie")
    .attr("text-anchor", "middle")
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
    .text(function(d) { return d.data.key;})
    .style("fill", "#000000")
    .style("font-size", "15px")
}

// FONCTION PERMETTANT D'AFFICHER LA CARTE COUPEE EN ARRONDISSEMENT
function runAll() {
  d3.json("arrondissements.geojson")
    .then((json) => {
      geoJson(json)
    })
    .then(() => {
      indexHostpots()
    })
    .then(() => {
      lineChart()
    })
    .then(() => {
      barChartArrondissement();
      barChart()
    })
    .then(() => {
      initPieChart()
    })
}

function reinitTabs() {
  for (i=0;i<24;i++){
    tabHours[i]={
      hours: i,
      frequency: 0,
      download: 0,
      upload: 0
    }
  }

  for (i=0;i<21;i++){
    tabCp[i]={
      codePostal: i,
      donnees: 0,
      upload: 0,
      download: 0
    }
  }
}

function runTest(data) {
  var datetime = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");
  reinitTabs();
  data.forEach(function(obj,i) {
    var DateDebutHours = datetime(obj.DateDebut).getHours();
    tabHours[DateDebutHours].frequency += 1;
    tabHours[DateDebutHours].download += parseInt(obj.Download,10);
    tabHours[DateDebutHours].upload += parseInt(obj.Upload,10);

    var codePostal = obj.CodePostal;
    if(codePostal.substr(3,1) == "0") {
      codePostal=codePostal.substr(4,1);
    } else {
      codePostal=codePostal.substr(3,2);
    }

    tabCp[codePostal].upload += parseInt(obj.Upload, 10);
    tabCp[codePostal].download += parseInt(obj.Download, 10);
  });
  tabCp = tabCp.slice(1);
}

function majBarChartArr() {
  runTest(completeData.filter(function(item,index) {
    var datetime = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");
    const DateDebutHours = datetime(item.DateDebut).getHours();
    return selectedHours.includes(DateDebutHours)
  }));

  gArrondissement.selectAll(".bar")
    .data(tabCp, function(d) {
      return d.codePostal
    })
    .order()
    .transition()
    .duration(500)
    .attr("y",  d => { return yArrondissement(d.download/1000000000); })
    .attr("height",  d => { return height - yArrondissement(d.download/1000000000); });

  gArrondissement.selectAll(".bar_bis")
    .data(tabCp, function(d) {
      return d.codePostal
    })
    .order()
    .transition()
    .duration(500)
    .attr("y",  d => { return yArrondissement((d.download+d.upload)/1000000000); })
    .attr("height",  d => { return height - yArrondissement(d.upload/1000000000); })

}

// FONCTION PERMETTANT LA MAJ DES GRAPHES : LINE CHART, BAR CHART
function majBarLineChart() {
  runTest(completeData.filter(function(item) {
    return selectedArrondissements.includes(item.CodePostal.toString())
  }));

  svg.selectAll(".bar")
    .data(tabHours, function(d) {
      return d.hours
    })
    .order()
    .transition()
    .duration(500)
    .attr("width", function(d) { return x(d.frequency); });

  svgLineChart.selectAll("path")
    .filter(function(d) {
      return d3.select(this).attr("class") == "line"
    })
    .datum(tabHours)
    .attr("class", "line")
    .transition()
    .duration(500)
    .attr("d", line);

  svgLineChart.selectAll("path")
    .filter(function(d) {
      return d3.select(this).attr("class") == "line_bis"
    })
    .datum(tabHours)
    .attr("class", "line_bis")
    .transition()
    .duration(300)
    .attr("d", line_bis);

  svgLineChart.selectAll(".dot")
    .data(tabHours)
    .transition()
    .duration(500)
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", function(d) { return yScale(d.download/1000000000) });

  svgLineChart.selectAll(".dot_bis")
    .data(tabHours)
    .transition()
    .duration(500)
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", function(d) { return yScale(d.upload/1000000000) })
}

d3.csv("dataParisHotspotsDemo.csv")
  .then(function(data) {
    completeData = data;
    runTest(data);
  })
  .then(() => {
    runAll();
  });

// FONCTION PERMETTANT LE TRI DU BARCHART
function resort(element){
  switch(element.value){
    case "1":
      svg.update((a,b) => d3.ascending(a.hours, b.hours));
      svgBarChartArrondissement.update((a,b) => d3.ascending(a.codePostal, b.codePostal));
      break;
    case "2":
      svg.update((a,b) => d3.descending(a.frequency, b.frequency));
      svgBarChartArrondissement.update((a,b) => d3.descending(a.download, b.download));
      break;
  }
}

// FONCTION POUR GERER LES BOUTONS ALL ET NONE
function index(value) {
  if(value.value == "None") {
    selectedArrondissements = [];

    svgMap.selectAll("path")
      .transition()
      .duration(500)
      .style("fill", "#B0E0E6");

    gArrondissement.selectAll(".bar")
      .transition()
      .duration(500)
      .style("fill", "#808080");

    gArrondissement.selectAll(".bar_bis")
      .transition()
      .duration(500)
      .style("fill", "#808080");
  } else {
    selectedArrondissements =
      ["75001","75002","75003","75004","75005",
        "75006","75007","75008","75009","75010",
        "75011","75012","75013","75014","75015",
        "75016","75017","75018","75019","75020"];

    svgMap.selectAll("path")
      .transition()
      .duration(500)
      .style("fill", "#1E90FF");

    gArrondissement.selectAll(".bar")
      .transition()
      .duration(500)
      .style("fill", "#ffab00");

    gArrondissement.selectAll(".bar_bis")
      .transition()
      .duration(500)
      .style("fill", "#000000");
  }

  indexHostpots();
  majBarLineChart();
}

function indexHours(value) {
  if(value.value == "None2") {
    selectedHours = [];

    svgLineChart.selectAll(".dot")
      .transition()
      .duration(500)
      .style("fill","#808080");

    svgLineChart.selectAll(".dot_bis")
      .transition()
      .duration(500)
      .style("fill","#808080");

    svg.selectAll(".bar")
      .transition()
      .duration(500)
      .style("fill","#808080");

    svgPie.selectAll(".piePart")
      .transition()
      .duration(500)
      .style("fill","#808080")
  } else {
    selectedHours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

    svgLineChart.selectAll(".dot")
      .transition()
      .duration(500)
      .style("fill","#ffab00");

    svgLineChart.selectAll(".dot_bis")
      .transition()
      .duration(500)
      .style("fill","#000000");

    svg.selectAll(".bar")
      .transition()
      .duration(500)
      .style("fill","blue");

    svgPie.selectAll(".piePart")
      .transition()
      .duration(500)
      .style("fill","blue")
  }

  indexHostpots();
  majBarChartArr();
}
