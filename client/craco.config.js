module.exports = {
  devServer: {
    port: 3001,
    host: '0.0.0.0',
    allowedHosts: 'all',
  },
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "crypto": false,
          "stream": false,
          "util": false,
          "buffer": false,
          "process": false,
        },
      },
    },
  },
};
