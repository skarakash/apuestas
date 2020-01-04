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

  let mid = data['78_3'].filter(item => /^15/.test(item.time_str)).map(item => Number(item.handicap));
  let ht = data['78_3'].filter(item => /^30/.test(item.time_str)).map(item => Number(item.handicap));
  let minMid = Math.min.apply(null, mid);
  let minHt = Math.min.apply(null, ht);
  return {minMid, minHt}
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

module.exports = {
  transformOddsArray, 
  getNumberOfPages,
  filterGames
};