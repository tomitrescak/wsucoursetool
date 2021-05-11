module.exports = {
  webpack(config, options) {
    config.module.rules.push({
      test: /\.worker\.ts$/,
      loader: 'worker-loader',
      // options: { inline: true }, // also works
      options: {
        filename: 'static/[hash].worker.js',
        publicPath: '/_next/',
      },
    });
    return config
  }
}