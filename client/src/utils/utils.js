module.exports = {
    getMatchScore: (str) => {
        return str ? Number(str.split("-").reduce((a, c) => Number(a) + Number(c))) : 0;
    },
}