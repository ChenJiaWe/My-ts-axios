const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
module.exports = {
    mode: "development",
    /**
     * 会在examples目录下建多个子目录
     * 把不同章节的demo放到不同的子目录
     * 每个子目录下会创建一个app.ts
     * entries收集多目录人口文件，并且每个入口还引入了一个用于热更新的文件
     * entries是一个对象，key为目录名
     */
    entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
        const fullDir = path.join(__dirname, dir);
        const entry = path.join(fullDir, "app.ts");
        // 目录存在 文件存在
        if (fs.statSync(fullDir) && fs.existsSync(entry)) {
            entries[dir] = ["webpack-hot-middleware/client", entry]
        }
        return entries;
    }, {}),
    // 根据不同的目录名称，打包生产目标js，名称和目录名一直
    output: {
        path: path.join(__dirname, "__build__"),
        filename: "[name].js",
        publicPath: "/__build__/"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: "pre",
                use: [
                    {
                        loader: "tslint-loader"
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}