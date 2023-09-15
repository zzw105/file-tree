# file-tree  

输出带注释的项目文件树

## 输出效果

```markdown
F:\project\tree
├─file-tree --------------------------- fileTree目录
|  ├─config.json ---------------------- 配置文件
|  ├─fileComment.json ----------------- 文件注释缓存
|  └─fileTree.md ---------------------- 输出文件
├─test -------------------------------- 测试
|  ├─a -------------------------------- a
|  |  ├─d ----------------------------- d
|  |  |  └─e.js ----------------------- e
|  ├─b -------------------------------- b
|  |  └─f.ts -------------------------- 啊实打实大
|  └─c.txt ---------------------------- c
├─util
|  ├─defaultConfig.json --------------- 默认配置
|  ├─index.ts
|  └─type.ts
├─.gitignore
├─README.md
├─index.ts ---------------------------- 入口文件
├─package-lock.json
├─package.json
└─tsconfig.json
```

## 安装依赖

请在项目中安装，请勿全局安装

```shell
npm i @zzw_105/file-tree
```

## 使用

1. 运行`file-tree --init`初始化项目

2. 编辑`config.json`添加需要忽略的文件或者文件

   ```json
   {
     "ignore": [
       "node_modules",
       ".git",
       "dist",
       "yarn.lock"
     ],
     "dashLength": 40
   }
   ```

3. 命令行运行`file-tree`

4. 更具提示输入响应需要的注释

5. 输出文件地址为`\file-tree\fileTree.md`

## 终端参数

- -i,--init 初始化项目
- -s,--skip 跳过标注

## config配制

- ignore：string[] 忽略的文件和目录
- dashLength：number 输出文件的破折号长度
- ignoreExtension：string[] 忽略的扩展名
- ignoreFolder：string[] 忽略特定目录下的所有文件
- ignoreFilesInFolder：string[] 只显示特定目录下的目录注释

***ignoreFolder内的目录依然会在最终的树中显示，但目录下的所以文件将被忽略***

## 问题

1. 修改已经写好的注释

   可以在`fileComment.json`文件中找到对应的文件路径修改

## 计划更新

- [ ] 支持全局使用以及命令参数
- [x] 路径改为项目根目录为起始
- [x] 更好的视觉显示效果
- [x] 增加init功能

## 感谢

部分代码借鉴了treer包

[treer npm](https://www.npmjs.com/package/treer)

[treer github](https://github.com/derycktse/treer)
