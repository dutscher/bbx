import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';

// https://www.bluebrixx.com/data/files/manuals/104/104000_Mittelalter_Kirche%20Teil%201.pdf

const app = express();
const port = 3000;

// header("Content-type:application/pdf");
// header("Content-Disposition:attachment;filename='downloaded.pdf'");

/*
_header: 'GET /data/files/manuals/pdf/103/103297%204%20Seasons%20Winter%204%20-%20BI.pdf HTTP/1.1\r\n'
'accept-language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7,fi;q=0.6,it;q=0.5,ru;q=0.4\r\n' +
'accept-encoding: gzip, deflate, br\r\n' +
'sec-fetch-dest: document\r\n' +
'sec-fetch-user: ?1\r\n' +
'sec-fetch-mode: navigate\r\n' +
'sec-fetch-site: none\r\n' +
'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*
=0.8,application/signed-exchange;v=b3;q=0.9\r\n' +
'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/
97.0.4692.99 Safari/537.36\r\n' +
'upgrade-insecure-requests: 1\r\n' +
'sec-ch-ua-platform: "Windows"\r\n' +
'sec-ch-ua-mobile: ?0\r\n' +
'sec-ch-ua: " Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"\r\n' +
'cache-control: max-age=0\r\n' +
'connection: close\r\n' +
'host: www.bluebrixx.com\r\n' +

*/

app.use(
  createProxyMiddleware({
    target: `https://www.bluebrixx.com/data/files/manuals/`,
    changeOrigin: true,
    //logLevel: 'silent',
    onProxyReq: function (proxyReq, req, res) {
      console.log(req);
      proxyReq.setHeader('content-type', 'application/pdf');
      proxyReq.setHeader('content-disposition', "attachment;filename='downloaded.pdf'");
    },
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers['content-type'] = 'application/pdf';
      proxyRes.headers['content-disposition'] = "attachment;filename='downloaded.pdf'";
      console.log(proxyRes.headers);
    },
  })
);

app.listen(port, () => {
  console.log('proxy is listen');
});
