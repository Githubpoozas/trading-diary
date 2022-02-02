module.exports = {
  webpack: (config, webpack) => {
    // Add your variable using the DefinePlugin
    config.plugins.push(
      new webpack.DefinePlugin({
        //All your custom ENVs that you want to use in frontend
        IDENTIFIER: JSON.stringify(process.env.IDENTIFIER),
        PASSWORD: JSON.stringify(process.env.PASSWORD),
        API_URI: JSON.stringify(process.env.API_URI),
      })
    );
    // Important: return the modified config
    return config;
  },
};
