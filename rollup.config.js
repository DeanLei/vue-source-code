import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  input: './src/index.js', // 以哪个文件作为打包的入口
  output: {
    file: 'dist/umd/vue.js', // 最终打包到dist文件夹下umd目录下的vue.js
    name: 'Vue', // 指定打包后全局变量的名字
    format: 'umd', // 统一模块规范
    sourcemap: true, // es6->es5 开启源码调试，可以找到源代码报错位置
  },
  plugins: [
    babel({ // babel转化
      exclude: "node_modules/**", // 忽略node_modules下面的任何文件
    }),
    // 如果是开发环境就配置这个模式，否则就不配置
    process.env.ENV === 'development' ?
    serve({
      open: true, // 自动打开网页
      openPage: '/public/index.html', // 默认打开html的路径
      port: 3000, // 启动的端口号
      // 静态文件的位置 - 通过当前启动的服务，默认路径为空，表示以当前文件夹的路径来启动服务，这样就可以找到public下的index.html
      contentBase: '', 
    }) : null
  ]
}

