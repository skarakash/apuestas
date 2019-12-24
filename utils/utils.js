const ids = require('./ids');

const getMatchMinute = (str) => {
  return str ? Number(str.split(":")[0]) : 0;
};

const getMatchTotal = (str) => {
    return str ? Number(str.split("-").reduce((a, c) => Number(a) + Number(c))) : 0;
};

const removeDuplicates = (myArr, prop) => {
  return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

const transformOddsArray = data => {
  if (!data.hasOwnProperty('78_3') || data['78_3'].length < 10){
    return []
  }

  let odds = data['78_3'].map( odd => {
    return Object.assign({}, {time: getMatchMinute(odd['time_str'])}, {total: getMatchTotal(odd['ss'])}, {bookieTotal: Number(odd['handicap'])})
  })

  odds = removeDuplicates(odds, 'time');
  return odds = odds.map(odd => Object.assign({}, {[odd.time]: odd}));
  
}

getNumberOfPages = total => {
  if (total > 50 && (total % 50 === 0)){
    return Math.round(total / 50)
  } 

  if (total > 50 && (total % 50 > 0)){
    return Math.round((total / 50)) + 1
  } 

  return 1
}

filterGames = arr => {
  return arr = arr.filter( item => !item.league.name.includes('Women'))
} 

module.exports = {
  transformOddsArray, 
  getNumberOfPages,
  filterGames
};