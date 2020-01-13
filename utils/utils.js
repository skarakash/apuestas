const getMatchTotal = (str) => {
    return str ? Number(str.split("-").reduce((a, c) => Number(a) + Number(c))) : 0;
};

const getOddsAtMinute = (data, minute) => {
  const re = new RegExp(`^${minute}`);
  let arrayOfMinutes = data.filter(item => re.test(item.time_str))
  if (arrayOfMinutes.length === 0) {
    return null
  } else if (arrayOfMinutes.length === 1) { 
    return arrayOfMinutes[0].handicap
  }
  if (minute === '29'){
    return arrayOfMinutes.reduce((acc, current) => current.add_time < acc.add_time ? acc : current).handicap;
  }
  return arrayOfMinutes.reduce((acc, current) => current.add_time > acc.add_time ? acc : current).handicap;
}

const transformOddsArray = data => {
  if (!data.hasOwnProperty('78_3') || data['78_3'].length < 10){
    return {}
  }
    let start = getOddsAtMinute(data['78_3'], '00');
    let mid = getOddsAtMinute(data['78_3'], '15');
    let ht = getOddsAtMinute(data['78_3'], '30');
  return {start, mid, ht}
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
  arr = arr.map(item => Object.assign({}, 
    {id: item.id},
     {time: item.time}, 
     {league: item.league}, 
     {home: item.home},
     {away: item.away}, 
     {ss: getMatchTotal(item.ss)})).filter( item => !item.league.name.includes('Women') && !item.league.name.includes('Friendlies') )
  return arr;
} 

const getNestedObject = (nestedObj, pathArr) => {
  return pathArr.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, nestedObj);
}

const getPercentage = (arr, odd) => {
  const n = arr.filter(res => res > odd).length;
  if (n === 0 ) return 0;
  return (n / arr.length) * 100
}

const getDesirable = (arrOfResults, currentOdd) => {
  if (arrOfResults.length <= 10) return 'Not enough data';
  const probWithCurr = getPercentage(arrOfResults, currentOdd);
  if (probWithCurr >= 80) return currentOdd

 return  getDesirable(arrOfResults, currentOdd - 1)
}

module.exports = {
  transformOddsArray, 
  getNumberOfPages,
  filterGames,
  getNestedObject,
  getDesirable
};