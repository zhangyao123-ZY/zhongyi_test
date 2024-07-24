import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import path from 'path';
import { fileURLToPath, URL } from "node:url";

//自动导入 Composition API
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

/** svg 转 icon */
import IconsSvg from "unplugin-icons/vite";
import iconsResolver from "unplugin-icons/resolver";
// 本地 svg 转换
import { FileSystemIconLoader } from "unplugin-icons/loaders";

// gzip/br 压缩
import CompressionGzip from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://openapi.videiot.cn:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  plugins: [
    vue(),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
          // directives: true,
          // version: "2.1.5",
        }),
        iconsResolver({
          //@iconify-json/ep 是 Element Plus 的图标库，所以 IconsResolver 配置了 enabledCollections: ['ep']
          enabledCollections: ["ep"],
          // 标识自定义图标集
          customCollections: ["custom"],
        }),
      ],
    }),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [
        // 自动导入element相关函数，如：ElMessage, ElMessageBox..
        ElementPlusResolver({
          importStyle: "sass",
        }),
        // 自动导入图标组件
        iconsResolver({
          prefix: "icon",
        }),
      ],
      eslintrc: {
        // 已存在文件设置默认 false，需要更新时再打开，防止每次更新都重新生成
        enabled: false,
        // 生成文件地址和名称
        filepath: path.resolve(__dirname, "./.eslintrc-auto-import.json"),
        globalsPropValue: true,
      },
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
    }),
    IconsSvg({
      compiler: "vue3",
      autoInstall: true,
      // 自定义图标加载
      customCollections: {
        // font 图标集
        // 给svg文件设置fill="currentColor"属性，使图标的颜色具有适应性
        custom: FileSystemIconLoader("src/assets/icon-svg", (svg) =>
          svg.replace(/^<svg /, '<svg fill="currentColor" ')
        ),
      },
    }),
    // gzip 格式
    CompressionGzip({
      threshold: 1024 * 500, // 体积大于 threshold 才会被压缩,单位 b
      ext: ".gz", // 压缩文件格式
      deleteOriginFile: false, // 是否删除源文件
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/assets/style/element/index.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
