const transformEvents = arr => {
    if (arr && arr.length > 0) {
        let events =  arr.filter(item => item.text)
            .map(event => event.text.split(" - "));
        if (events.length <= 15) {
            return []
        }
        return events.filter(item => item.length === 3 && item[0] !== 'Half')
            .map(item => {
                let obj = {};
                obj.minute = parseInt(item[0]);
                obj.goal = parseInt(item[1]);
                return obj;
            });
    } else {
        return [];
    }

};


const formObjectWithMins = obj => {
    for(let x in obj){
        if (Number(x) === 1 && !obj[x]) {
            obj[x] = 0
        } else if (!obj[x]){
            obj[x] = obj[x - 1]
        }
    }
    return obj
};

const getFulltimeScore = obj => {
    if (obj.ss) {
        let { ss } = obj;
        ss = ss.split('-');
        return Number(ss[0]) + Number(ss[1])
    }

    return 0;
};

const getHalftimeScore = obj => {
    if (obj.scores) {
        const { scores } = obj;
        return Number(scores['1'].home) + Number(scores['1'].away)
    } else {
        return 0
    }
};

const getStats = obj => {
    if(obj.stats){
        return {last_10_mins_score: obj.stats["last_10_mins_score"].map(score => Number(score))}
    } else {
        return [0,0]
    }
};

const transformMatchData = obj => {
    let events = transformEvents(obj.events);
    let propsToDelete = ['has_lineup', 'has_lineup', 'inplay_created_at', 'inplay_updated_at', 'bet365_id', 'confirmed_at'];
    let tempObj = {};
    let finalObj = {};
    if (events.length > 0){
        for (let i = 1; i <= events[events.length -1]['minute']; i++) {
            tempObj[i] = null;
        }

        for(let prop in tempObj){
            events.map(item => {
                if (item.minute === Number(prop)){
                    tempObj[prop] = item.goal
                }
            });
        }

        finalObj = Object.assign({}, obj,
                {events: formObjectWithMins(tempObj)},
                {ft: getFulltimeScore(obj)},
                {ht: getHalftimeScore(obj)},
                {time: `${new Date(obj.time * 1000)}`},
                {stats: getStats(obj)}
            );
        propsToDelete.map(prop => delete finalObj[prop]);
        return finalObj;
    }
};


export default transformMatchData;