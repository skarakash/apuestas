import transformMatchData from "./transformGameObj";

export default async function getAllById(arr){
    const promises = arr.map( async id => {
        const response = await fetch('/byId', {
            method: 'POST',
            body: JSON.stringify({id}),
            headers: {"Content-Type": "application/json"}
        });
        let data =  await response.json();
        return data.results[0];
    });
    let res =  await Promise.all(promises);
    res =  res.map(match => transformMatchData(match)).filter(match => match);
    return res;
}
