export default class UrlUtil {
  url = null;
  searchParam = {};
  constructor(url) {
    this.url = url;
    this.analysisSearchParam();
  }
  analysisSearchParam() {
    let { search } = this.url;
    if (search) {
      search = search.replace(/\?/, '"');
      search = search.replace(/=/g, '":"');
      search = search.replace(/&/g, '","');
      this.searchParam = JSON.parse(`{${search}"}`);
    }
  }
}
