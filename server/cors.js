const cors = require('cors');

const allowedOrigins = ['chrome-extension://nnkmeadnjdnkbecimkifdhjhialbbfmo'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow if the origin is not present or if it's in the list of allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);