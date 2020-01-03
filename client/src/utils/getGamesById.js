import transformMatchData from "./transformGameObj";

export default async function getAllById(arr){
    let promises = arr.map( async id => {
        try {
            const response = await fetch(`/eventview?&id=${id}`);
            let match = await response.json();
            return transformMatchData(match)
        } catch (error) {
            return error
        }
    });
    return await Promise.all(promises);
}
