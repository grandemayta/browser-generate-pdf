var PDFDocument = require('./pdfkit');
var SVGtoPDF = require('svg-to-pdfkit');
var blobStream = require('blob-stream');


var handlePdf = document.querySelector('#start-pdf');
handlePdf.addEventListener('click', function() {
    var doc = new PDFDocument();
    var svg = document.querySelector('svg');
    var stream = doc.pipe(blobStream());

    SVGtoPDF(doc, svg.outerHTML, 0, 0);
    
    stream.on('finish', function() {
        let blob = stream.toBlob('application/pdf');
        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, 'File.pdf');
        } else {
            var loadPdf = document.getElementById('load-pdf');
            loadPdf.href = URL.createObjectURL(blob);
        }
    });
    doc.end();
});