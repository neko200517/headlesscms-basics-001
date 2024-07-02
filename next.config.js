module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        // port: '8000',
        // pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wordpress-20240702.azurewebsites.net',
        // port: '443',
        // pathname: '/**',
      },
    ],
  },
};
