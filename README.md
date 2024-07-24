# Videiot Monorepo

## 目录

该仓库使用 [`pnpm`](https://pnpm.io) 作为包管理工具，使用前请先安装 `pnpm`。

### Apps and Packages

这里分别存放了项目（Apps）以及依赖库（packages）:

#### Apps

- `esms`: 管理后台
- `mini-program`: 微信小程序

#### packages

无

### Build

打包**所有项目和依赖包**, 可执行一下命令:

```bash
pnpm run build
```

过滤打包，即只打包**指定的项目和依赖包**

```bash
pnpm run build --filter=<包名>
```

### Develop

预览**所有项目和依赖包**, 可执行一下命令:

```bash
pnpm run dev
```

过滤调试，即只打包**指定的项目和依赖包**

```bash
pnpm run dev --filter=<包名>
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
