// Reference: http://bl.ocks.org/weiglemc/6185069
// This example was useful for figuring out how d3 works

// Assumes that jQuery has been imported as `$` in this scope

// If you change these, also change padding for qcon in anscombe.css
const margin = { top: 20, left: 20, bottom: 20, right: 20 };

function getDims(div) {
    return {
        height: div.height(),
        width: div.width()
    }
}

function toObjArray(csvData) {
    var data = [];
    for (i = 0; i < csvData.length; i++)
    {
        var newO = {};
        newO.x = + csvData[i]["x"];
        newO.y = + csvData[i]["y"];
        data[i] = newO;
    }
    return data;
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
    var yscale = d3.scaleLinear().range([svgDims.height, 0]);

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
    yscale.domain([0, d3.max(data, function(d) { return d.y; }) + 1]);

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
        .attr("x", (svgDims.width - margin.left - margin.right) / 2)
        .attr("text-achnor", "middle")
        .style("font-size", "16pt")
        .text(title);
}

d3.csv("data/anscombe_I.csv", function(error, data) {
    if (error) throw error;
    plot("Anscombe I", "aq1", toObjArray(data));
});

d3.csv("data/anscombe_II.csv", function(error, data) {
    if (error) throw error;
    plot("Anscombe II", "aq1", toObjArray(data));
});

d3.csv("data/anscombe_III.csv", function(error, data) {
    if (error) throw error;
    plot("Anscombe III", "aq1", toObjArray(data));
});

d3.csv("data/anscombe_IV.csv", function(error, data) {
    if (error) throw error;
    plot("Anscombe IV", "aq1", toObjArray(data));
});