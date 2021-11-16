const { tokensOfOwner, getBirthday } = require("./contract");
const { ROOT_URL, PATH_TO_JSON } = require("../devconfig.json");
const { checkDate } = require("./etc");

const bigJson = require(PATH_TO_JSON);

module.exports.initializeAPI = (app) => {
    app.get("/api/nft/:id", async (req, res) => {
        try {
            const id = req.params.id;
            const birthday = await getBirthday(id);
            if (birthday) {
                const isBirth = checkDate(birthday);

                if (!isBirth && birthday.toNumber() > 0) {
                    res.json(makeEmbrionData(id));
                } else if (!isBirth) {
                    res.json({ error: "not burn yet" });
                }

                res.json(formatData(bigJson[id]));
            } else {
                res.status(500).json({ error: "That phallus has not been make yet" });
            }
        } catch (err) {
            res.status(500);
            console.error(err);
        }
    });

    app.get("/api/tokens/:wallet", async (req, res) => {
        res.json(await getTokensOfOwner(req.params.wallet));
    });

    app.get("/api/pages", (req, res) => {
        const page = req.query.page;
        const limit = req.query.limit || 9;

        const filters = [
            { type: "Background", value: req.query.background },
            { type: "Skin", value: req.query.skin },
            { type: "Mouth", value: req.query.mouth },
            { type: "Eyes", value: req.query.eyes },
            { type: "Head", value: req.query.head },
            { type: "Accessory", value: req.query.accessory },
        ];

        const makeLimitedResponse = (data) => {
            if (page * limit > data.length) {
                return [...data].splice(page * limit).map((nft) => formatData(nft));
            } else {
                return [...data].splice(page * limit, limit).map((nft, i) => formatData(nft));
            }
        };

        if (filters.every((filter) => !filter.value)) {
            // if there are no filters
            res.json(makeLimitedResponse(bigJson));
        } else if (page && limit) {
            const filtredJSON = bigJson.filter((nft) => {
                return filters.every((filter) => {
                    if (filter.value) {
                        return nft.details[filter.type].itemName === filter.value;
                    }
                    return true;
                });
            });
            res.json(makeLimitedResponse(filtredJSON));
        } else if (page && !limit) {
            res.status(400).json({ error: "missing params: limit" });
        } else if (!page && limit) {
            res.status(400).json({ error: "missing params: page" });
        } else res.status(400).json({ error: "missing params: page, limit" });

        res.status(500);
    });
};

//  FUNCTIONS

function makeEmbrionData(nftId) {
    return {
        image: "https://ipfs.io/ipfs/bafybeig66tejqvxespqzvbshpksclybgbzicrsfbgyjitqwc5ordky5xde/Phallus-fetus.png",
        external_url: ROOT_URL + `nft/${nftId}`,
        attributes: [
            { value: "empty", trait_type: "Background" },
            { value: "empty", trait_type: "Skin" },
            { value: "empty", trait_type: "Mouth" },
            { value: "empty", trait_type: "Eyes" },
            { value: "empty", trait_type: "Head" },
            { value: "empty", trait_type: "Accessory" },
        ],
        name: "empty",
    };
}

function formatData(jsonObject) {
    if (!jsonObject) {
        return {};
    }
    const nftId = jsonObject.fileName.split("#")[1];
    const getLiteImagePath = (ipfsPath) => {
        return ROOT_URL + "images/lite/" + ipfsPath.split("ipfs")[2].split("/")[1] + ".png";
    };
    const data = {
        image: jsonObject.image,
        lite_image: getLiteImagePath(jsonObject.image),
        external_url: ROOT_URL + `nft/${nftId}`,
        attributes: [
            { value: jsonObject.details.Background.itemName, trait_type: "Background" },
            { value: jsonObject.details.Skin.itemName, trait_type: "Skin" },
            { value: jsonObject.details.Mouth.itemName, trait_type: "Mouth" },
            { value: jsonObject.details.Eyes.itemName, trait_type: "Eyes" },
            { value: jsonObject.details.Head.itemName, trait_type: "Head" },
            { value: jsonObject.details.Accessory.itemName, trait_type: "Accessory" },
        ],
        name: jsonObject.fileName.split(".png")[0],
        id: nftId,
    };
    return data;
}

async function getTokensOfOwner(wallet) {
    const tokensID = await tokensOfOwner(wallet);

    return tokensID.map((id) => formatData(bigJson[id.toNumber()]));
}
