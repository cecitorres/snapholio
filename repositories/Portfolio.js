const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Portfolio = {};

Portfolio.generate = (user, imgs) => {
  let pdf = new PDFDocument({
    size: 'LETTER',
    info: {
      Title: 'Portfolio by ' + user,
      Author: user,
    }
  });

  pdf.fontSize(32);
  // Write stuff into PDF
  pdf.text('Portfolio by ' + user, {
    align: 'center'
  });
  pdf.fontSize(18);
  imgs.forEach(img => {
    pdf.text(img.title)
      .image(path.join(__dirname, '../', 'public/') + img.image.imageUrl, {
        width: 300
      })
      .text('-------------------------------------------', {
        align: 'center'
      });
  });

  // Stream contents to a file
  pdf.pipe(
      fs.createWriteStream(path.join(__dirname, '../', `public/portfolios/${user.split(' ').join('')}.pdf`))
    )
    .on('finish', function () {
      console.log('PDF closed');
    });

  // Close PDF and write file.
  pdf.end();

  return `public/portfolios/${user.split(' ').join('')}.pdf`
}

module.exports = Portfolio;