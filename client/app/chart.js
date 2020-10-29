/*
Reference:
https://www.d3-graph-gallery.com/graph/barplot_horizontal.html
*/

const margin = { top: 20, right: 30, bottom: 40, left: 90 }

const width = 500;
const height = 400;

const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

const xScale = d3.scaleLinear();
const yScale = d3.scaleBand().padding(.1);

const xAxis = svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom} )`)

const yAxis = svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)

let chartProperty = 'age';

const DomoChart = (props) => {

    const data = props.domos;

    const drawChart = (property) => {
        
        chartProperty = property; //store for reload on new

        xScale.domain([0, d3.max(data, d=>d[property]) + 10])
            .range([ margin.left, width-margin.right]);

        yScale.range([ margin.top, height - margin.bottom])
            .domain(data.map((d) => d.name));

        svg.selectAll("rect")
          .data(data, d => d._id)
          .join(
              enter => enter
                .append("rect")
                .attr("x", xScale(0) )
                .attr("y", (d) => yScale(d.name))
                .attr("width", (d) => xScale(d[property] || 0)-xScale(0))
                .attr("height", yScale.bandwidth())
                .attr("fill", "#338acc"),
            update => update
                .call(update => update
                    .transition()
                    .duration(500)
                    .attr("x", xScale(0) )
                    .attr("y", (d) => yScale(d.name))
                    .attr("width", (d) => xScale(d[property] || 0)-xScale(0))
                    .attr("height", yScale.bandwidth() )
                )
          );

          xAxis.call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

          yAxis.call(d3.axisLeft(yScale));
    }

    const drawChartAge = () => drawChart('age');
    const drawChartFriends = () => drawChart('friends');

    drawChart(chartProperty);

    //return the controls and hook up the onClick functions
    return(
        <div>
            <button className = "chartButton" onClick={drawChartAge}>Show Ages</button>
            <button className = "chartButton" onClick={drawChartFriends}>Show Friends</button>
        </div>
    );
}