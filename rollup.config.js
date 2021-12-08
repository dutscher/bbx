import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import assetsPreprocessor from 'svelte-assets-preprocessor'
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url'
import { svelteSVG } from 'rollup-plugin-svelte-svg';
import replace from 'rollup-plugin-replace';

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require('child_process').spawn('npm', ['run', 'start-by-rollup', '--', '--dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true
            });

            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        }
    };
}

export default {
    input: 'src/main.ts',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'public/build/bundle.js'
    },
    external: ['react'],
    plugins: [
        url({ destDir: 'public' }),
        json({
            // All JSON files will be parsed by default,
            // but you can also specifically include/exclude files
            include: 'data/**',
            exclude: ['node_modules/**'],

            // for tree-shaking, properties will be declared as
            // variables, using either `var` or `const`
            preferConst: true, // Default: false

            // specify indentation for the generated default export —
            // defaults to '\t'
            indent: '  ',

            // ignores indent and generates the smallest code
            compact: true, // Default: false

            // generate a named export for every property of the JSON object
            namedExports: true // Default: true
        }),
        svelteSVG(),
        svelte({
            preprocess: [
                assetsPreprocessor(),
                sveltePreprocess({ sourceMap: !production }),
            ],
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production
            },
            onwarn: (warning, handler) => {
                const { code, frame } = warning;
                if (code === "css-unused-selector")
                    return;

                handler(warning);
            },
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify( production ? 'production' : 'development' )
        }),
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css({ output: 'bundle.css' }),
        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production
        }),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('public'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};
