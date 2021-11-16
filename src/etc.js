module.exports.checkDate = (birthday) => {
    birthday = birthday.toNumber();
    if (birthday === 0) {
        return false;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime > birthday + 518400; // current time > birthday + two weeks
};
