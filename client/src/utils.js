const removeFalsy = obj => {
    let newObj = {};
    Object.keys(obj).forEach((prop) => {
        if (obj[prop]) { newObj[prop] = obj[prop]; }
    });
    return newObj;
};


const transformEvents = arr => {
    return arr.filter(item => item.text)
        .map(event => event.text.split(" - "))
        .filter(item => item.length === 3 && item[0] !== 'Half')
        .map(item => {
            let obj = {};
            obj.minute = parseInt(item[0]);
            obj.goal = parseInt(item[1]);
            return obj;
        });
};

const getGameData = (obj) => {
    return  {
        teams: `${obj.home.name} - ${obj.away.name}`,
        tournament: `${obj.league.name}`,
        season: `${new Date(obj.time * 1000)}`,
        'HT': obj.events && obj.events.length > 0 ? getPoint(obj.events, 30) : 0,
        '@35': obj.events && obj.events.length > 0 ? getPoint(obj.events, 35) : 0,
        '@40': obj.events && obj.events.length > 0 ? getPoint(obj.events, 40) : 0,
        '@45': obj.events && obj.events.length > 0 ? getPoint(obj.events, 45) : 0,
        '@50': obj.events && obj.events.length > 0 ? getPoint(obj.events, 50) : 0,
        '@55': obj.events && obj.events.length > 0 ? getPoint(obj.events, 55) : 0,
        'FT': obj.events && obj.events.length > 0 ? getPoint(obj.events, 65) : 0,
    }
};

const getPoint = (data, n)  => {
    let events = transformEvents(data);
    let exists = events.filter( obj => obj.minute === n).length > 0;
    if (n === 0) {
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
            return getPoint(data, n - 1);
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
    return (ok * 100) / arr.length;
};

const under = (arr, n) => {
    const ok = arr.filter(item => item <= Number(n)).length;
    return (ok * 100) / arr.length;
};

module.exports = {
    removeFalsy,
    finalview,
    getGameData,
    over, under
};