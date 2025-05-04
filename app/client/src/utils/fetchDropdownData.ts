export default async function() {
    const response = await fetch(`/model6/dropdown-data.json`);
    const data = await response.json();
    return data;
}