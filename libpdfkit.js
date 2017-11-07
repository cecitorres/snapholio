const fs = require('fs')
const PDFDocument = require('pdfkit');

let pdf = new PDFDocument({
  size: 'LETTER',
  info: {
    Title: 'Tile of File Here',
    Author: 'Some Author',
  }
});

// Write stuff into PDF
pdf.text('Hello World');

doc.image('images/test.jpeg', 0, 15, {width: 300})
.text('Proportional to width', 0, 0)

// Stream contents to a file
pdf.pipe(
  fs.createWriteStream('./path/to/file.pdf')
)
  .on('finish', function () {
    console.log('PDF closed');
  });

// Close PDF and write file.
pdf.end();