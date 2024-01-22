import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

import path from 'path'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    // 项目插件
    plugins: [
      AutoImport({
        include: [
          /\.[tj]sx?$/, 
          /\.vue$/, 
          /\.vue\?vue/, 
          /\.md$/,
        ],
  
        imports: [
          'vue',
          'vue-router',
          'pinia',
          {
            '@vueuse/core': [
              // named imports
              'useMouse', // import { useMouse } from '@vueuse/core',
              'onClickOutside',
              // alias
              ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
            ],
            'axios': [
              // default imports
              ['default', 'axios'], // import { default as axios } from 'axios',
            ],
          },
        ],
        eslintrc: {
          enabled: false, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },

        dts: './auto-imports.d.ts',
      }),
      vue(),
    ],
    // 基础配置
    base: './',
    publicDir: 'public',
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            '@border-color-base': '#dce3e8',
          },
          javascriptEnabled: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      brotliSize: false,
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境去除console及debug
          drop_console: false,
          drop_debugger: true,
        },
      },
    },
    server: {
      proxy: {
        '/task': {
          target: 'https://echo-whisper.shasoapp.com',   // 实际请求的目标地址
          changeOrigin: true,                // 允许跨域
          // rewrite: (path) => path.replace(/^\/api/, '')  // 重写路径：去掉路径中的 `/api`
        },
        // 使用代理
        '/auth': {
          target: 'https://echo-whisper.shasoapp.com',   // 实际请求的目标地址
          changeOrigin: true,                // 允许跨域
          // rewrite: (path) => path.replace(/^\/api/, '')  // 重写路径：去掉路径中的 `/api`
        },
        '/user': {
          target: 'https://echo-whisper.shasoapp.com',   // 实际请求的目标地址
          changeOrigin: true,                // 允许跨域
          // rewrite: (path) => path.replace(/^\/api/, '')  // 重写路径：去掉路径中的 `/api`
        },
      }
    }
  }
})


