export default async function fetchRegionTranslations() {
    const response = await fetch(`/region-translations.json`);
    const data = await response.json();
    return data;
}