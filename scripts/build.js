import fs from 'fs-extra';

const copy = {
    './src/index.html': './public/index.html',
};
const cacheBuster = (new Date().getTime());
const argv = process.argv;
const isProd = argv.includes('--prod');
const copiedFiles = [];

Object.entries(copy).map(([src, dest]) => {
    let indexHTML = fs.readFileSync(src, 'utf-8');
    indexHTML = indexHTML
        // replace cachebuster at <script /> and <link />
        .replace(/\?cb=\d*"/g, `?cb=${cacheBuster}"`)
        // replace cachebuster for ajax on global window
        .replace(/(cacheBuster=')\d*(')/, `$1${cacheBuster}$2`);

    if (isProd) {
        indexHTML = indexHTML
            // activate tracking scripts
            .replace(/Xsrc/g, 'src');
    }
    fs.writeFileSync(dest, indexHTML, 'utf-8');
    copiedFiles.push(dest);
});

console.log(`updated cache bust and tracking in ${copiedFiles} isProd:${isProd}` );
