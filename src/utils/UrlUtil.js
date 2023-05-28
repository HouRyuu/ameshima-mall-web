export default class UrlUtil {
    url = null;
    searchParam = {};
    pathname = [];

    constructor() {
        this.url = window.location;
        this.analyzeSearchParam();
    }

    analyzeSearchParam() {
        let {search, pathname} = this.url;
        this.pathname = pathname.split('/').filter(path => !!path);
        search = decodeURI(search);
        if (search) {
            search = search.replace(/\?/, '"');
            search = search.replace(/=/g, '":"');
            search = search.replace(/&/g, '","');
            try{
                this.searchParam = JSON.parse(`{${search}"}`);
            }catch (e) {
                console.error('不法url')
            }
        }
    }
}
