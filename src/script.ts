import crossfilter from 'crossfilter2';
import * as dc from 'dc';
import * as d3 from 'd3';

dc.config.defaultColors(d3.schemePaired);

export const dailyCasesChart = new dc.BarChart('#daily-cases-chart');
export const timeRangeChart = new dc.BarChart('#time-range-chart');
export const laenderChart = new dc.RowChart('#laender-chart');

d3.csv('filtered.csv').then((germanyData) => {
  console.log('done parsing');
  // Since its a csv file we need to format the data a bit.
  const dateFormatSpecifier = '%d.%m.%Y';
  const dateFormatParser = d3.timeParse(dateFormatSpecifier);

  germanyData.forEach((d) => {
    d.dd = dateFormatParser(d.Datum);
    d.week = d3.timeWeek(d.dd);
  });

  const data = crossfilter(germanyData);

  // const all = data.groupAll();

  // Dimension by full date
  const weekDimension = data.dimension((d) => d['week']);
  const dateDimension = data.dimension((d) => d['dd']);
  const laenderDimension = data.dimension((d) => d['Landkreis']);
  const dailyGroup = dateDimension.group();
  const laenderGroup = laenderDimension.group();
  const indidenceByDayGroup = dailyGroup.reduceSum((d) => d["InzidenzFallNeu"]);
  const incidenceByLandGroup = laenderGroup.reduceSum((d) => d['InzidenzFallNeu']);

  laenderChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
    .width(800)
    .height(280)
    .margins({
      top: 20, left: 10, right: 10, bottom: 20,
    })
    .group(incidenceByLandGroup)
    .dimension(laenderDimension)
  // Assign colors to each value in the x scale domain
    // .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
    .label((d) => d.key.split('.')[1])
  // Title sets the row text
    // .title((d) => d.value)
    .elasticX(true)
    .xAxis()
    // .ticks(4);
    // .rangeChart(timeRangeChart)
    // .x(d3.scaleTime().domain([new Date(2020, 2, 1), new Date(2021, 3, 19)]))
    // .round(d3.timeDay.round)
    // .elasticY(true)
    // .alwaysUseRounding(true)
    // .xUnits(d3.timeDays);

  dailyCasesChart.width(800)
    .height(380)
    .margins({
      top: 0, right: 50, bottom: 20, left: 40,
    })
    .dimension(dateDimension)
    .group(indidenceByDayGroup)
    .centerBar(true)
    .gap(1)
    .rangeChart(timeRangeChart)
    .x(d3.scaleTime().domain([new Date(2020, 2, 1), new Date(2021, 3, 19)]))
    // .round(d3.timeDay.round)
    .elasticY(true)
    .alwaysUseRounding(true)
    .xUnits(d3.timeDays);

  timeRangeChart.width(800)
    .height(40)
    .margins({
      top: 0, right: 50, bottom: 20, left: 40,
    })
    .dimension(weekDimension)
    .group(indidenceByDayGroup)
    .centerBar(true)
    .gap(1)
    .x(d3.scaleTime().domain([new Date(2020, 2, 1), new Date(2021, 3, 19)]))
    .round(d3.timeWeek.round)
    .elasticY(true)
    .alwaysUseRounding(true)
    .xUnits(d3.timeWeek);

  dc.renderAll();


  // function sayHello(name) {
  //   return `Hello World! I'm ${name}`;
  // }

  // const user = 'Mario Romano';

  // document.body.innerHTML = sayHello(user);

});