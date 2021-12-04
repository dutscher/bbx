import fs from 'fs-extra';
import Client from 'ssh2-sftp-client';
import secrets from './ftp.secret.json';

const sftp = new Client();
const src = './public';

sftp.connect({
    host: secrets.host,
    port: secrets.port,
    username: secrets.bbx,
    passphrase: secrets.passphrase,
    privateKey: fs.readFileSync(secrets.privateKey), // Buffer or string that contains
})
    .then(() => sftp.uploadDir(src, secrets.destination))
    .then(msg => {
        console.log(msg);
        return sftp.end();
    })
    .catch(err => {
        console.log(err, 'catch error');
    });
