# Vue 3 + TypeScript + Vite

# 技术栈
vue3 + typescript + vite + pnpm + ant-design-vue + unocss

# 完整的打包流程
pnpm run build:go

这个命令会：
1. 编译TypeScript（vue-tsc -b）
2. 构建前端资源到dist目录（vite build）
3. 嵌入Windows资源（go-winres）
4. 编译Go程序并打包成exe

生成的exe会：
- 在8000端口启动服务器
- 内嵌最新的dist静态资源
- 支持SPA路由刷新不会404
- 禁用浏览器缓存，确保显示最新内容

