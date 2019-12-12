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
    try {
        const response = await fetch('/insertbet', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {"Content-Type": "application/json"}
        });
        return await response.json();
    }
    catch (err) {
        console.log('fetch failed', err);
    }
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

async function getAllLive(){
    try {
        const response = await fetch('/inplayevents');
        const data = await response.json();
        if (data && data.length > 0){
            return data.filter(item => Number(item.time_status) === 1).map(res => res.id);
        }
    }
    catch (err) {
        console.log('fetch failed', err);
    }
}


module.exports = {
    getOdds,
    insertbet,
    findSimilar,
    getAllLive
};