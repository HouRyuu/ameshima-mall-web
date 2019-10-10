export default class UrlUtil {
  url = null;
  searchParam = {};
  constructor(url) {
    this.url = url;
    this.analyzeSearchParam();
  }
  analyzeSearchParam() {
    let { search } = this.url;
    search = decodeURI(search);
    if (search) {
      search = search.replace(/\?/, '"');
      search = search.replace(/=/g, '":"');
      search = search.replace(/&/g, '","');
      this.searchParam = JSON.parse(`{${search}"}`);
    }
  }
}
