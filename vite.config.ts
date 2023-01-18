import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import path from 'path'
export default defineConfig({
    build: {
        lib: {
            name: 'jsx-compile',
            entry: path.resolve(__dirname, './src/index.ts'),
        },
        target: 'modules',
        outDir: 'lib',
        // TODO: 如何同时导出声明文件
    },

    plugins: [
        AutoImport({
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
            ],
            imports: [{
                'vitest': [
                    'describe', 'expect', 'it'
                ],
            }],

        }),
    ],
})