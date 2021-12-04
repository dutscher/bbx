import fs from 'fs-extra';

const srcPath = './src/index.html';
const destPath = './public/index.html';
const cacheBuster = (new Date().getTime());
const argv = process.argv;
const isDev = argv.includes('--dev');
let indexHTML = fs.readFileSync(srcPath, 'utf-8');

indexHTML = indexHTML
    // replace cachebuster at <script /> and <link />
    .replace(/\?cb=\d*"/g, `?cb=${cacheBuster}"`)
    // replace cachebuster for ajax on global window
    .replace(/(cacheBuster = ')\d*(')/, `$1${cacheBuster}$2`);

if (!isDev) {
    indexHTML = indexHTML
        // activate tracking scripts
        .replace(/Xsrc/g, 'src');
}

fs.writeFileSync(destPath, indexHTML, 'utf-8');

console.log('updated cache bust and tracking in ' + destPath)
