const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const { SSL, PORT, HOST } = require("./config.json");

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
