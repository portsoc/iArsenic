import config from "../config";

export default async function fetchRegionTranslations() {
    const response = await fetch(`${config.basePath}/region-translations.json`);
    const data = await response.json();
    return data;
}