const fs = require('fs');
const path = require('path');

const getStaticFile = (req, res, fileName, mimeType) => {
  const file = path.resolve(__dirname, `../client/${fileName}`);
  fs.stat(
    file,
    (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') res.writeHead(404);
        return res.end(err);
      }

      // check if browser sends range request
      // only happens during streaming
      let { range } = req.headers;
      // if page just loaded, send this back
      if (!range) range = 'bytes=0-';

      // parse range
      const positions = range.replace(/bytes=/, '').split('-');

      // parse start, always the first number
      let start = parseInt(positions[0], 10);

      // parse end if there. if the header is "bytes=x-",
      // return bytes from current to the total amount of bytes
      const total = stats.size;
      const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

      // if start byte is greater than or equal to end (aka total),
      // set start to last byte
      if (start > end) start = end - 1;

      const chunksize = (end - start) + 1;

      // send back headers of data size
      res.writeHead(206, { // partial data
        'Content-Range': `bytes ${start}-${end}/${total}`, // send back range
        'Accept-Ranges': 'bytes', // set to bytes pretty much always
        'Content-Length': chunksize, // send back size
        'Content-Type': mimeType, // MIME-type
      });

      // create file stream and send back partial file
      const stream = fs.createReadStream(file, { start, end });

      stream.on('open', () => {
        stream.pipe(res);
      });

      stream.on('error', (streamErr) => {
        res.end(streamErr);
      });

      return stream;
    },
  );
};

module.exports = {
  getStaticFile,
};
