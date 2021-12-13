//import fs from 'fs-extra';
//import secrets from './ftp.secret.json';
import { Buffer } from 'buffer';
import Client from 'ssh2-sftp-client';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const secrets = yargs(hideBin(process.argv)).argv;
const sftp = new Client();
const src = './public';

let privateKey = '';

// console.log(privateKey);
// privateKey = fs.readFileSync(secrets.privateKey);
// console.log('fs', privateKey);
privateKey = '-----BEGIN RSA PRIVATE KEY-----\nProc-Type: 4,ENCRYPTED\nDEK-Info: ' + secrets.privateKey.replace(/\|/g, '\n') + '\n-----END RSA PRIVATE KEY-----\n';
//console.log('bufferraw', privateKey);
privateKey = Buffer.from(privateKey, 'utf-8');
//console.log('buffer', privateKey);

if (true) {
    sftp.connect({
        host: secrets.host,
        port: secrets.port,
        username: secrets.username,
        passphrase: secrets.passphrase,
        privateKey,
    })
        .then(() => sftp.uploadDir(src, secrets.destination))
        .then(msg => {
            console.log('Upload dome:', msg);
            return sftp.end();
        })
        .catch(err => {
            console.log(err, 'catch error');
        });
}
