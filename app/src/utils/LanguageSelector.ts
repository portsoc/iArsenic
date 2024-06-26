export default class LanguageSelector {
    static dataKey: string = 'language';

    static init = () => {
        const language = LanguageSelector.get();
        document.body.className = language;
    };

    static get = (): 'english' | 'bengali' => {
        const language = localStorage.getItem(this.dataKey) || 'english';

        if (language !== 'english' && language !== 'bengali') {
            throw new Error(`Invalid language in local storage ${language}`);
        }

        return language;
    };

    static set = (language: 'english' | 'bengali') => {
        localStorage.setItem(LanguageSelector.dataKey, language);

        document.body.className = language;
    };
}