const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Ensuring fallbacks are in place
      const fallback = webpackConfig.resolve.fallback || {};
      Object.assign(fallback, {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        brotli: false,
        fs: false, // fs is not available in the browser
        Browser: false,
        path: require.resolve("path-browserify"),
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
      });
      webpackConfig.resolve.fallback = fallback;

      // Configuring plugins for global variables (process, Buffer)
      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ]);

      // Ignoring source map warnings
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];

      // Enforcing the source-map-loader for better debugging support
      webpackConfig.module.rules.push({
        test: /\.(js|mjs|jsx,ts,tsx)$/,
        enforce: "pre",
        use: ["source-map-loader"],
        resolve: {
          fullySpecified: false, // To fix issues with module resolution
        },
      });

      webpackConfig.module.rules.push({
        test: /\.ttf$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      });

      return webpackConfig;
    },
  },
};
