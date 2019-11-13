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

const finalview = (dataObj, date) => {
    let points = [30,35,40,45,50,55, 64];
    const home = dataObj.home.name;
    const away = dataObj.away.name;
    const tournament = dataObj.league.name;
    const numbers = points.map(point => getPoint(dataObj.events, point));
    return `('${home} - ${away}', '${tournament}', '${date}', ${numbers}),`
};

module.exports = {
    removeFalsy,
    finalview
};