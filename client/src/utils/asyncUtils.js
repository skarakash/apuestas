async function getEventOdds(ids) {
    try {
        const promises = ids.map( async id => {
            const response = await fetch(`/eventodds?&event_id=${id}`);
            return await response.json();
        });
       return  await Promise.all(promises);
    } catch (error) {
        return error;
    }
}

async function findSimilar(data){
    debugger;
    try {
        const response = await fetch(`/probability?&kickoff=${data.kickoff}&midhalf=${data.midhalf}&ht=${data.ht}`);
        return await response.json();
    }
    catch (err) {
        return (`fetch failed  ${err}`);
    }
}

async function getLiveGamesIDs(){
    try {
        const response = await fetch('/inplayevents');
        const data = await response.json();
        if (data && data.length > 0){
            return data.filter(item => Number(item.time_status) === 1).map(res => res.id);
        } else {
            return [];
        }
    }
    catch (err) {
        return (`fetch failed  ${err}`);
    }
}

async function insertRows(arr){
    try {
        const response = await fetch('/insert', {
            method: 'POST',
            body: JSON.stringify(arr),
            headers: {"Content-Type": "application/json"}
        });
        return response.json();
    } catch (error) {
        return error;
    }
}

async function validateRow(id){
    try {
        const response = await fetch(`/validate?&id=${id}`);
        return response.json()
    } catch (error) {
        return error;
    }
}

async function fetchEndedMatches(date){
    try {
        const response = await fetch(`/eventsended?&day=${date}`);
        return await response.json();
    } catch (error) {
        return error;
    }
}

module.exports = {
    getEventOdds,
    findSimilar,
    getLiveGamesIDs,
    insertRows,
    validateRow,
    fetchEndedMatches
};