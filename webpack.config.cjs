const path = require('path');
const {styles} = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
  mode: 'development',

  devtool: 'inline-source-map',

  entry: ['./src/index.ts', './src/dev/main.ts'],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules/
      },
      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
        use: ['raw-loader']
      },
      {
        test: [/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/, /\.css$/],
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag',
              attributes: {
                'data-cke': true
              }
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: styles.getPostCssConfig({
                themeImporter: {
                  themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                },
                minify: true
              })
            }
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    extensionAlias: {
      '.js': ['.ts', '.js']
    }
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },

  devServer: {
    static: path.resolve(__dirname, 'dev'),
    hot: true,
    port: 8000,
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    allowedHosts: ['localhost']
  }
};
