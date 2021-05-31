const path = require('path');

const isProd = process.env.NODE_ENV === 'prod';

require('dotenv').config({
  path: path.resolve(__dirname, isProd ? 'prod.env' : 'dev.env'),
});

const Dotenv = require('dotenv-webpack')
const withImages = require('next-images')

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");


const configureWebpack = (config, { dev }) => {
	config.plugins = config.plugins || []

	config.plugins.push(
		// Read the .env file
		new Dotenv({
			path: path.resolve(__dirname, isProd ? 'prod.env' : 'dev.env'),
			systemvars: true
		})
  );
	
	
	if (config.resolve.plugins) {
		config.resolve.plugins.push(new TsconfigPathsPlugin());
	} else {
		config.resolve.plugins = [new TsconfigPathsPlugin()];
	}
	
	config.module.rules.push({
		test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
		use: {
			loader: 'url-loader',
			options: {
				limit: 100000,
				name: '[name].[ext]'
			}
		}
	})

  return config;
};


module.exports = withImages({ webpack: configureWebpack	})
