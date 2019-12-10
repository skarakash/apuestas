import transformMatchData from "./transformGameObj";

export default async function getAllById(arr){
    const promises = arr.map( async id => {
        const response = await fetch('/eventview', {
            method: 'POST',
            body: JSON.stringify({id}),
            headers: {"Content-Type": "application/json"}
        });
        return await response.json();

    });
    let res =  await Promise.all(promises);
    return res.map(match => transformMatchData(match)).filter(match => match);
}
