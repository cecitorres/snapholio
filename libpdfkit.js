const fs = require('fs')
const PDFDocument = require('pdfkit');

const libpdf = {};

libpdf.generatePortfolio = (user, imgs) => {

  let pdf = new PDFDocument({
    size: 'LETTER',
    info: {
      Title: 'Portfolio by ' + user.name,
      Author: user.email,
    }
  });

  // Write stuff into PDF
  pdf.text('Hello World');
  imgs.forEach(img => {
    pdf.image(img.image.imageUrl, 0, 15, {
        width: 300
      })
      .text(img.title, 0, 0);
  });

  // Stream contents to a file
  pdf.pipe(
      fs.createWriteStream('./pruebafile.pdf')
    )
    .on('finish', function () {
      console.log('PDF closed');
    });

  // Close PDF and write file.
  pdf.end();

}

module.exports = libpdf;