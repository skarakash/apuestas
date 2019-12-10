async function getOdds(ids){
    const promises = ids.map( async id => {
        const response = await fetch('/eventodds', {
            method: 'POST',
            body: JSON.stringify({id}),
            headers: {"Content-Type": "application/json"}
        });
        let data = await response.json();
        data = Object.assign({}, data, {matchId: id});
        return data;
    });

    return await Promise.all(promises);
}


async function insertbet(obj){
        const response = await fetch('/insertbet', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {"Content-Type": "application/json"}
        });
        return await response.json();
}

async function findSimilar(data){
    try {
        const response = await fetch('/probability', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"}
        });
        return await response.json();
    }
    catch (err) {
        console.log('fetch failed', err);
    }
}


module.exports = {
    getOdds,
    insertbet,
    findSimilar
};