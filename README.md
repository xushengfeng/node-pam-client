# pam-client

Linux PAM 的 Node.js 原生绑定（Neon）。

npm 包包含 linux-x64 与 linux-arm64 预编译模块，运行时按 `process.arch` 自动选择，无需在目标机器上编译。

## 构建

```bash
npm install
npm run build
```

需要系统安装 `libpam0g-dev`（Debian/Ubuntu）。
