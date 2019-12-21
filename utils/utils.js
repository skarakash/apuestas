const getMatchMinute = (str) => {
  return Number(str.split(":")[0]);
};

const getMatchTotal = (str) => {
    return Number(str.split("-").reduce((a, c) => Number(a) + Number(c)));
};

module.exports = {
  transformOddsArray: function(arr){
      if(arr.length > 0){
          arr =  arr.filter(odd => odd.time_str !== null && odd.ss !== "00:00");
          let allOdds =  arr.map(odd => Object.assign({}, {matchTotal: getMatchTotal(odd.ss)}, {bookieTotal: Number(odd.handicap)}, {time: getMatchMinute(odd.time_str)}));
          let ht = allOdds.filter(odd => odd.time === 30);
          ht = ht[ht.length - 1];

          let pre = allOdds[allOdds.length - 1];
          return {ht, pre}
      } else {
          return {}
      }
  }
};