if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://root:123@ds231205.mlab.com:31205/snapholio-dev'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/snapholio-dev'}
}