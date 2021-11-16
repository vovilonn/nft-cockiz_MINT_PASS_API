const { getBirthday } = require("./contract");
const { PATH_TO_MINT_PASS } = require("../devconfig.json");
const { checkDate } = require("./etc");

const mintPassJson = require(PATH_TO_MINT_PASS);

module.exports.initializeMintPassApi = (app) => {
    app.get("/api-mint-pass/nft/:id", async (req, res) => {
        try {
            const id = req.params.id;
            const birthday = await getBirthday(id);
            if (birthday) {
                const isBirth = checkDate(birthday);

                if (!isBirth) {
                    res.json({ error: "not burn yet" });
                }

                res.json(mintPassJson);
            } else {
                res.json({ error: "That phallus has not been make yet" });
            }
        } catch (err) {
            res.status(500);
            console.error(err);
        }
    });
};
