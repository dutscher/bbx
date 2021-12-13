//import fs from 'fs-extra';
//import secrets from './ftp.secret.json';
import { Buffer } from 'buffer';
import Client from 'ssh2-sftp-client';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const secrets = yargs(hideBin(process.argv)).argv;
const sftp = new Client();
const src = './public';

console.log(secrets)
const privateKey = Buffer.from('-----BEGIN RSA PRIVATE KEY-----\n'+secrets.privateKey+'\n-----END RSA PRIVATE KEY-----', 'utf-8');
//privateKey: fs.readFileSync(secrets.privateKey),
console.log(privateKey)

sftp.connect({
    host: secrets.host,
    port: secrets.port,
    username: secrets.username,
    passphrase: secrets.passphrase,
    privateKey,

})
    .then(() => sftp.uploadDir(src, secrets.destination))
    .then(msg => {
        console.log(msg);
        return sftp.end();
    })
    .catch(err => {
        console.log(err, 'catch error');
    });
