const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (req, res) => {
  console.log(req.url);

  switch (req.url) {
    case '/':
    default:
      htmlHandler.getIndex(req, res);
      break;
    case '/page2':
      htmlHandler.getPage2(req, res);
      break;
    case '/page3':
      htmlHandler.getPage3(req, res);
      break;
    case '/party.mp4':
      mediaHandler.getStaticFile(req, res, req.url.substring(1), 'video/mp4');
      break;
    case '/bird.mp4':
      mediaHandler.getStaticFile(req, res, req.url.substring(1), 'video/mp4');
      break;
    case '/bling.mp3':
      mediaHandler.getStaticFile(req, res, req.url.substring(1), 'audio/mpeg');
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`listening on http://localhost:${port}/`);
