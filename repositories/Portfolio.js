const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Portfolio = {};

Portfolio.generate = (user, imgs) => {
  let pdf = new PDFDocument({
    size: 'LEGAL',
    info: {
      Title: 'Portfolio by ' + user,
      Author: user,
    }
  });

  // pdf.image(path.join(__dirname, '../', 'public/img/logo256x256.png'), (pdf.page.width-50)/2, 20,{
  //   height: 50,
  //   align: 'center'
  // });
  pdf.fontSize(18);
  // Write stuff into PDF
  pdf.text('Portfolio by ' + user, 70, 30, {
    align: 'center'
  });
  pdf.fontSize(14);
  imgs.forEach((img, index) => {
    let xImg = index % 2 == 0 ? 70 : 350;
    let xTxT = index % 2 == 0 ? -200 : 350;
    let yImg;

    if(index < 2) yImg = 60;
    else if(index < 4) yImg = 290;
    else yImg = 520;

    pdf.text(img.title, xTxT, yImg + 210, {align: 'center'})
      .image(path.join(__dirname, '../', `public/${img.image.imageUrl}`), xImg, yImg, {
      height: 200
      });
      
  });

  pdf.text('This is a footer', 20, pdf.page.height - 50, {
    lineBreak: false
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

  return `portfolios/${user.split(' ').join('')}.pdf`
}

module.exports = Portfolio;