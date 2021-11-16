const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const { SSL, PORT, HOST } = require("./devconfig.json");

const { initializeAPI } = require("./src/api");
const { initializeMintPassApi } = require("./src/api-mint-pass");

const app = express();

const httpsServer = https.createServer(
    {
        key: fs.readFileSync(SSL.key),
        cert: fs.readFileSync(SSL.cert),
    },
    app
);

app.use(express.json());
app.use(cors());

// =========================

app.get("/", (req, res) => {
    res.json({ status: "ok" });
});

initializeAPI(app);
initializeMintPassApi(app);

// FUNCTIONS

httpsServer.listen(PORT, HOST, () => console.log(`Server has been succesfully started!`));

`{
#    listen 443 ssl;

    server_tokens off;

#   root /var/www/html/public/nft-cockiz.com;
   root /home/webmaster/my-awesome-site/public;
   index index.php index.html index.htm;

   server_name nft-cockiz.com www.nft-cockiz.com;

#  =======================================================================
   if ($request_uri ~ ^(.*)/index.(html|php)) { return 301 $1/$is_args$args; }
   set $i "index@";

   location  ~ ^/api/(.*)$ {
            proxy_pass https://89.108.71.161:3201;
            proxy_redirect     off;
            proxy_set_header   Host             $host;
            proxy_set_header   X-Real-IP        $remote_addr;
            proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        }
ls

   location ~* @.*\.html$ { internal; }
#  =======================================================================

   client_max_body_size 100m;


    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/nft-cockiz.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/nft-cockiz.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}`;
