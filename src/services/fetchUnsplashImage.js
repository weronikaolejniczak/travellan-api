const request = require('request-promise');

const defaultImage = {
    authorName: 'Annie Spratt',
    imageUrl:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1866&q=80',
    username: 'anniespratt',
  };
  
const fetchUnsplashImage = (keyword) => {
    return request({
        method: 'GET',
        uri: encodeURI(`https://api.unsplash.com/search/photos?page=1&query=${keyword}&client_id=${process.env.UNSPLASH_API_KEY}`),
        json: true
    })
        .then((data) => {
            const imageUrl = data.results[0].urls.regular.toString();
            const authorName = data.results[0].user.name.toString();
            const username = data.results[0].user.username.toString();
    
            const image = { authorName, imageUrl, username };
    
            return image;
        })
        .catch((error) => {
            return defaultImage;
        });
  }
  
module.exports = fetchUnsplashImage;
  