const removeFalsy = obj => {
    let newObj = {};
    Object.keys(obj).forEach((prop) => {
        if (obj[prop]) { newObj[prop] = obj[prop]; }
    });
    return newObj;
};


const transformEvents = arr => {
    if (arr.length > 0) {
        let events =  arr.filter(item => item.text)
            .map(event => event.text.split(" - "));
        if (events.length <= 15) {
            return []
        } else {
         return events.filter(item => item.length === 3 && item[0] !== 'Half')
                .map(item => {
                    let obj = {};
                    obj.minute = parseInt(item[0]);
                    obj.goal = parseInt(item[1]);
                    return obj;
                });
        }
    } else {
        return [];
    }

};



const getGameData = (obj, tableName) => {
    if (tableName === 'handball') {
        return {
            teams: `${obj.home.name} - ${obj.away.name}`,
            tournament: `${obj.league.name}`,
            season: `${new Date(obj.time * 1000)}`,
            'HT': obj.events && obj.events.length > 0 ? getPoint(obj.events, 30) : 0,
            '@35': obj.events && obj.events.length > 0 ? getPoint(obj.events, 35 , 30) : 0,
            '@40': obj.events && obj.events.length > 0 ? getPoint(obj.events, 40, 35) : 0,
            '@45': obj.events && obj.events.length > 0 ? getPoint(obj.events, 45, 39) : 0,
            '@50': obj.events && obj.events.length > 0 ? getPoint(obj.events, 50, 45) : 0,
            '@55': obj.events && obj.events.length > 0 ? getPoint(obj.events, 55, 50) : 0,
            'FT': obj.events && obj.events.length > 0 ? getPoint(obj.events, 62, 55) : 0,
        }
    }

    if ( tableName === 'bets') {
        return  {
            teams: `${obj.home.name} - ${obj.away.name}`,
            tournament: `${obj.league.name}`,
            season: `${new Date(obj.time * 1000)}`,
            league: obj.league.name,
            min: obj.timer? Number(obj.timer.tm) : 0,
            sec: obj.timer? Number(obj.timer.ts) : 0,
            id: obj.id,
            score: obj.ss,
            'HT': obj.events && obj.events.length > 0 ? getPoint(obj.events, 30) : 0,
            '@35': obj.events && obj.events.length > 0 ? getPoint(obj.events, 35 , 30) : 0,
            '@40': obj.events && obj.events.length > 0 ? getPoint(obj.events, 40, 35) : 0,
            '@45': obj.events && obj.events.length > 0 ? getPoint(obj.events, 45, 39) : 0,
            '@50': obj.events && obj.events.length > 0 ? getPoint(obj.events, 50, 45) : 0,
            '@55': obj.events && obj.events.length > 0 ? getPoint(obj.events, 55, 50) : 0,
            'FT': obj.events && obj.events.length > 0 ? getPoint(obj.events, 62, 55) : 0,
        }
    }
};

const getPoint = (data, n, m)  => {
    let events = transformEvents(data);
    if (events.length === 0) return [];
    let exists = events.length > 0 ? events.filter( obj => obj.minute === n).length > 0 : false;
    if (n === m) {
        return '0'
    } else {
        if (exists) {
            let temp = events.filter( obj => obj.minute === n);
            if (temp.length === 1){
                return temp[0].goal
            } else {
                return temp[temp.length - 1].goal;
            }
        } else {
            return getPoint(data, n - 1, m);
        }
    }
};

const finalview = (dataObj) => {
    let points = [30,35,40,45,50,55, 64];
    const home = dataObj.home.name;
    const away = dataObj.away.name;
    const tournament = dataObj.league.name;
    const numbers = points.map(point => getPoint(dataObj.events, point));
    const date = `${new Date(dataObj.time * 1000)}`;
    return `('${home} - ${away}', '${tournament}', '${date.substr(0,21)}', ${numbers}),`
};

const over = (arr, n) => {
    const ok = arr.filter(item => item >= Number(n)).length;
    return { probability : (ok * 100) / arr.length, total: n }
};

const under = (arr, n) => {
    const ok = arr.filter(item => item <= Number(n)).length;
    return (ok * 100) / arr.length;
};


 async function getAllById(arr){
    const promises = arr.map( async id => {
        const response = await fetch('/byId', {
            method: 'POST',
            body: JSON.stringify({id}),
            headers: {"Content-Type": "application/json"}
        });
        let data =  await response.json();
        return data.results[0];
    });
    return await Promise.all(promises);
}


async function getAllLive(){
    try {
        const response = await fetch('/live');
        const data = await response.json();
        if (data.results && data.results.length > 0){
            return data.results.filter(item =>
               item.timer && Number(item.timer.tm) >=40 &&
                Number(item.time_status) === 1 ).map(res => res.id);
        }
    }
    catch (err) {
        console.log('fetch failed', err);
    }
}

module.exports = {
    removeFalsy,
    finalview,
    getGameData,
    over, under,
    getAllById,
    getAllLive
};