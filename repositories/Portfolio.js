const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const moment = require('moment');

const Portfolio = {};
let date = moment().format("MMM Do YY");
Portfolio.generate = (user, imgs) => {
  let pdf = new PDFDocument({
    size: 'LEGAL',
    info: {
      Title: 'Final portfolio by ' + user.name,
      Author: user.name,
    }
  });

  pdf.image(path.join(__dirname, '../', 'public/img/logo384x384.png'), 130, 30, {width: 150});
  pdf.fontSize(14);
  pdf.text('Introduction to marketing', 310, 40);
  pdf.fontSize(26);
  pdf.text('Final portfolio', 310, 65);
  pdf.fontSize(14);
  pdf.text(`Student: ${user.name}`, 310, 100);
  pdf.text(`Email: ${user.email}`, 310, 120);
  pdf.text(`Submitted date: ${date}`, 310, 140);
  pdf.fontSize(14);
  imgs.forEach((img, index) => {
    let xImg = index % 2 == 0 ? 70 : 350;
    let xTxT = index % 2 == 0 ? -200 : 350;
    let yImg;

    if(index < 2) yImg = 180;
    else if(index < 4) yImg = 410;
    else yImg = 640;

    pdf.text(img.title, xTxT, yImg + 210, {align: 'center'})
      .image(path.join(__dirname, '../', `public/${img.image.imageUrl}`), xImg, yImg, {
      height: 200
      });
      
  });

  // pdf.image(path.join(__dirname, '../', 'public/img/icon-144x144.png'), pdf.page.width - 450, pdf.page.height - 30, {
  //   height: 50,
  //   align: 'right'
  // });
  pdf.image(path.join(__dirname, '../', 'public/portfolios/footer.png'), 0, pdf.page.height - 85, {
    width:pdf.page.width
  });

  // Stream contents to a file
  pdf.pipe(
      fs.createWriteStream(path.join(__dirname, '../', `public/portfolios/${user.name.split(' ').join('')}.pdf`))
    )
    .on('finish', function () {
      console.log('PDF closed');
    });

  // Close PDF and write file.
  pdf.end();

  return `portfolios/${user.name.split(' ').join('')}.pdf`
}

module.exports = Portfolio;