const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

<<<<<<< Updated upstream
module.exports = {
    entry: {
        index: {
            import: "./src/index.ts",
            dependOn: 'shared',
        },

        shared: 'lodash',
    },
=======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
>>>>>>> Stashed changes
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    devtool: false,
    output: {
		path: path.join(__dirname, "build"),
		filename: "[name].bundle.js",
		publicPath: "/"
	},
    mode: process.env.NODE_ENV || "development",
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: {
            "fs": false,
            "tls": false,
            "net": false,
            "path": false,
            "zlib": false,
            "http": false,
            "https": false,
            "stream": false,
            "crypto": false
        }
    },
    module: {
        unknownContextCritical: false,
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ["ts-loader"],
            },
            {
                test: /\.(css|scss)$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                use: ["file-loader"],
            },
        ],
    },
	devServer: {
		historyApiFallback: true,
        static: path.join(__dirname, "src")
	},
    optimization: {
        runtimeChunk: 'single',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src/html", "index.html"),
            favicon: "./src/html/favicon.ico",
        }),
    ]
};
