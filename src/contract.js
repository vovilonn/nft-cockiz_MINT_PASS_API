const { ethers } = require("ethers");
const ABI = require("../etc/abi.json");
const contractAdress = "0x4eF3c9b2AE34178c11aEC32Dc30bA87C9CF739e1";
const myWallet = "0x0067aB17e1Dc650eC661685880B12331F57afA36";

const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-rinkeby.alchemyapi.io/v2/FeJ9BFIGGf3OGwRLZFIzUNyx-wPS3Rfb"
);
const contractInstance = new ethers.Contract(contractAdress, ABI, provider);

module.exports.getBirthday = async (id) => {
    try {
        const birthday = await contractInstance.getBirthday(id);
        return birthday;
    } catch (err) {
        console.error(err);
        return false;
    }
};

module.exports.tokensOfOwner = async (wallet) => {
    try {
        return await contractInstance.tokensOfOwner(wallet);
    } catch (err) {
        console.error(err);
    }
};
