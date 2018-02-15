// Reference: http://bl.ocks.org/weiglemc/6185069
// This example was useful for figuring out how d3 works

// Assumes that jQuery has been imported as `$` in this scope

// I'm using a javascript-ified version of the data rather than d3.csv to load it.
const AQ = [
    // I
    [
        {x: 10.0, y: 8.04},
        {x: 8.0, y: 6.95},
        {x: 13.0, y: 7.58},
        {x: 9.0, y: 8.81},
        {x: 11.0, y: 8.33},
        {x: 14.0, y: 9.96},
        {x: 6.0, y: 7.24},
        {x: 4.0, y: 4.26},
        {x: 12.0, y: 10.84},
        {x: 7.0, y: 4.82},
        {x: 5.0, y: 5.68}
    ],
    // II
    [
        {x: 10.0, y: 9.14},
        {x: 8.0, y: 8.14},
        {x: 13.0, y: 8.74},
        {x: 9.0, y: 8.77},
        {x: 11.0, y: 9.26},
        {x: 14.0, y: 8.10},
        {x: 6.0, y: 6.13},
        {x: 4.0, y: 3.10},
        {x: 12.0, y: 9.13},
        {x: 7.0, y: 7.26},
        {x: 5.0, y: 4.74}
    ],
    // III
    [
        {x: 10.0, y: 7.46},
        {x: 8.0, y: 6.77},
        {x: 13.0, y: 12.74},
        {x: 9.0, y: 7.11},
        {x: 11.0, y: 7.81},
        {x: 14.0, y: 8.84},
        {x: 6.0, y: 6.08},
        {x: 4.0, y: 5.39},
        {x: 12.0, y: 8.15},
        {x: 7.0, y: 6.42},
        {x: 5.0, y: 5.73}
    ],
    // IV
    [
        {x: 8.0, y: 6.58},
        {x: 8.0, y: 5.76},
        {x: 8.0, y: 7.71},
        {x: 8.0, y: 8.84},
        {x: 8.0, y: 8.47},
        {x: 8.0, y: 7.04},
        {x: 8.0, y: 5.25},
        {x: 19.0, y: 12.50},
        {x: 8.0, y: 5.56},
        {x: 8.0, y: 7.91},
        {x: 8.0, y: 6.89}
    ]
];

const Y_MAX = Math.max(
    d3.max(AQ[0], function(d) { return d.y }),
    d3.max(AQ[1], function(d) { return d.y }),
    d3.max(AQ[2], function(d) { return d.y }),
    d3.max(AQ[3], function(d) { return d.y })
);

// If you change these, also change padding for qcon in anscombe.css
const margin = { top: 20, left: 20, bottom: 20, right: 20 };

function getDims(div) {
    return {
        height: div.height(),
        width: div.width()
    }
}

// http://www.statisticshowto.com/probability-and-statistics/regression-analysis/find-a-linear-regression-equation/
function linReg(data, domain) {
    var sigxsqr = 0;
    var sigx = 0;
    var sigy = 0;
    var sigxy = 0;
    var n = 0;

    data.forEach(function(p) {
        sigxsqr += p.x * p.x;
        sigx += p.x;
        sigy += p.y;
        sigxy += p.x * p.y;
        n += 1;
    });

    var slope = ((n * sigxy) - (sigx * sigy)) / ((n * sigxsqr) - (sigx * sigx));
    var intercept = ((sigy * sigxsqr) - (sigx * sigxy)) / ((n * sigxsqr) - (sigx * sigx));

    f = function(x) { return slope * x + intercept; }

    return [{x: domain[0], y: f(domain[0])}, {x: domain[1], y: f(domain[1])}];
}

function plot(title, divId, data) {
    var div = $("div #" + divId);
    var dims = getDims(div);

    console.log("Computed dims of div#" + divId + " as " + JSON.stringify(dims));

    var svgDims = {
        width: dims.width - margin.left - margin.right,
        height: dims.height - margin.top - margin.bottom
    };

    var xscale = d3.scaleLinear().range([0, svgDims.width]);
    var yscale = d3.scaleLinear().range([0, svgDims.height]);

    // Create the svg element
    var svg = d3.select("div #" + divId)
        .append("svg")
        .attr("width", dims.width)
        .attr("height", dims.height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xExtent = d3.extent(data, function(d) { return d.x; });
    var extendedxExtent = [xExtent[0]-1, xExtent[1]+1];
    xscale.domain(extendedxExtent);
    yscale.domain([Y_MAX + 1, 0]);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("cx", function(d) { return xscale(d.x); })
        .attr("cy", function(d) { return yscale(d.y); })
        .attr("fill", "black");

    var regressionLine = d3.line()
        .x(function(d) { return xscale(d.x) })
        .y(function(d) { return yscale(d.y) });

    var xAxis = d3.axisBottom(xscale),
        yAxis = d3.axisLeft(yscale);

    // regression line
    svg.append("path")
        .datum(linReg(data, extendedxExtent))
        .attr("stroke", "red")
        .attr("stroke-width", "1px")
        .attr("d", regressionLine);

    // x-axis
    svg.append("g")
        .attr("transform", "translate(0," + svgDims.height + ")")
        .call(xAxis);

    // y-axis
    svg.append("g")
        .call(yAxis);

    // title
    svg.append("text")
        .attr("y", margin.top / 2 )
        .attr("x", svgDims.width / 2)
        .style("text-achnor", "middle")
        .style("font-size", "16pt")
        .text("Set " + title);
}

plot("Anscombe I", "aq1", AQ[0]);
plot("Anscombe II", "aq2", AQ[1]);
plot("Anscombe III", "aq3", AQ[2]);
plot("Anscombe IV", "aq4", AQ[3]);