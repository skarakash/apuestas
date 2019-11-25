
async function getOdds(id){
    try {
        const response = await fetch('/odds', {
            method: 'POST',
            body: JSON.stringify({id}),
            headers: {"Content-Type": "application/json"}
        });
        return await response.json();
    }
    catch (err) {
        console.log('fetch failed', err);
    }
}


async function fetchDataFromDB(formData){
    try {
        const response = await fetch(`/allData`, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {"Content-Type": "application/json"}
        });
        return await response.json();
    }
    catch (err) {
        console.log('fetch failed', err);
    }
}


async function insertRows(obj){
        const response = await fetch('/insertBet', {
            method: 'POST',
            body: JSON.stringify({obj}),
            headers: {"Content-Type": "application/json"}
        });
        return await response.json();
}

module.exports = {
    getOdds,
    fetchDataFromDB,
    insertRows
};