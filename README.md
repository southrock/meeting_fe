## 目录结构

```bash
├── src
│   ├── assets               # 本地静态资源
│   ├── components           # 业务通用组件
│   └── pages                # 页面
├── public
│   └── index.html           # html模板文件
├── README.md
├── tsconfig.json            # typescript配置文件
├── webpack.common.config.js # webpack通用配置文件
├── webpack.dev.config.js    # webpack开发环境配置文件
├── webpack.prod.config.js   # webpack生产环境配置文件
├── package.json
└── package-lock.json
```

## 开发说明

本项目采用 `react` && `typescript` && `es6+` 进行开发。
使用 React 16.8 的新增特性 Hook 管理状态以及操作副作用

动效方面使用`animejs`与`lottie-web`实现

相关文档地址:
  * [React](https://doc.react-china.org/) 
  * [TypeScript](https://www.tslang.cn/docs/)
  * [es6](http://es6.ruanyifeng.com/)
  * [animejs](https://www.animejs.cn/)

开发流程:

```bash
  git clone ssh://git@git.ncuos.com:8082/southrock/hr2019_fe_to_fresher.git # 克隆项目到本地
  npm install     # 安装相关依赖
  npm start       # 启动本地开发，在 http://localhost:3000可以预览效果
  npm run analyze # 启动打包分析
```

## 代码规范

采用团队代码风格。请务必遵守规范，提升团队效率与可维护性。 [NCUHOME Code Guide](http://ncuhome.github.io/frontend-guide/)

## git提交

采用统一的git提交规范，请务必详细阅读 [家园git提交规范](http://yanshuo.io/assets/player/?deck=58f7703ba22b9d006c15edee#/)

## 兼容性

现代浏览器及 IE11。
