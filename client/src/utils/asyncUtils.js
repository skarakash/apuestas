async function getEventOdds(id) {
    try {
        const response = await fetch(`/eventodds?event_id=${id}`);
        return await response.json();
    } catch (error) {
        return error;
    }
}

async function getEventView(id) {
    try {
        const response = await fetch(`/eventview?event_id=${id}`);
        return await response.json();
    } catch (error) {
        return error;
    }
}

async function getEventPreGameOdds(id) {
    try {
        const response = await fetch(`/eventoddssummary?event_id=${id}`);
        const res =  await response.json();
        return res;
    } catch (error) {
        return error;
    }
}

async function findSimilar(data){
     try {
        const response = await fetch(`/probability?&start=${data.start}&mid=${data.mid}&ht=${data.ht}&current=${data.current}`);
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
        if (data && data.length){
            return data.filter(item => Number(item.time_status) === 1).map(res => res.id);
        } else {
            return [];
        }
    }
    catch (err) {
        return (err);
    }
}

async function insertMatch(obj){
    try {
        const response = await fetch('/insert', {
            method: 'POST',
            body: JSON.stringify(obj),
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

async function getLatestOdds(id){
    try {
        const response = await fetch(`/latestodds?&event_id=${id}`);
        return response.json()
    } catch (error) {
        return error;
    }
}

module.exports = {
    getEventOdds,
    getEventPreGameOdds,
    findSimilar,
    getLiveGamesIDs,
    insertMatch,
    validateRow,
    fetchEndedMatches,
    getLatestOdds,
    getEventView,
};