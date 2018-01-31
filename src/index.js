var d3 = require('d3');
var FileSaver = require('file-saver');
var PDFDocument = require('./pdfkit');
var SVGtoPDF = require('svg-to-pdfkit');
var blobStream = require('blob-stream');
var dataTSV = require('file-loader!./data.tsv');


loadChart();

var handlePdf = document.querySelector('#start-pdf');
handlePdf.addEventListener('click', function() {
    var doc = new PDFDocument();
    var svg = document.querySelector('svg');
    var stream = doc.pipe(blobStream());

    SVGtoPDF(doc, svg.outerHTML, 0, 0);

    doc.end();
    
    stream.on('finish', function() {
        var blob = stream.toBlob('application/pdf');
        FileSaver.saveAs(blob, "chart.pdf");
        
        /* if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(stream.toBlob('application/pdf'), 'my-pdf.pdf');
        } else {
            var loadPdf = document.getElementById('load-pdf');
            loadPdf.href = stream.toBlobURL('application/pdf');
        } */
    });
});

function loadChart() {
    var margin = {top: 40, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

    var formatPercent = d3.format(".0%");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatPercent);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv('./' + dataTSV, type, function(error, data) {
    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); })
        .attr('fill', 'orange');
    });
}

function type(d) {
    d.frequency = +d.frequency;
    return d;
}