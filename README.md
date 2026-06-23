# 课题组 GitHub 主页

这是一个可直接用于 GitHub Pages 的静态主页模板，包含课题组介绍、研究方向和项目仓库入口。

## 本地预览

直接打开 `index.html` 即可预览。如果希望模拟 GitHub Pages 的访问方式，也可以在当前目录启动静态服务：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 修改内容

- 主页文案：编辑 `index.html`。
- 仓库卡片：编辑 `assets/app.js` 中的 `repositories` 数组。
- 页面样式：编辑 `assets/styles.css`。
- 项目说明：在 `repos/` 下为每个项目建立对应目录。

## 发布到 GitHub Pages

1. 把这个目录推送到 GitHub 仓库。
2. 在仓库页面进入 `Settings -> Pages`。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/root`。

如果使用组织主页或用户主页，仓库名通常需要是 `<org>.github.io` 或 `<username>.github.io`。
