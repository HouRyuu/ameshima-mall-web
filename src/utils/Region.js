import FetchUtil from './FetchUtil';

class Region {
    provinceList = [];
    cityList = [];
    districtList = [];
    constructor() {
        this.initRegion(this.setProvinceList);
    }
    setProvinceList = (code, parentCode, provinceList) => {
        this.provinceList = provinceList;
    }
    setCityList = (provinceCode, parentCode, cityList) => {
        this.provinceList.find(({ regionCode }) => regionCode == provinceCode).children = cityList;
        this.cityList = cityList;
    }
    setDistrictList = (code, parentCode, districtList, outCallback) => {
        this.provinceList.find(({ regionCode }) => regionCode == parentCode)
            .children.find(({ regionCode }) => regionCode == code).children = districtList;
        this.districtList = districtList;
        if (outCallback) outCallback();
    }
    hasChildren(code, parentCode, level) {
        if (level < 2) {
            return false;
        }
        const province = this.provinceList.find(({ regionCode }) => regionCode == (level === 2 ? code : parentCode));
        let result = !!province && !!province.children;
        if (!result || level === 2) {
            if (result) {
                this.cityList = province.children;
                this.districtList = this.cityList[0].children;
            }
            return result;
        }
        const city = province.children.find(({ regionCode }) => regionCode == code);
        result = !!city && !!city.children;
        if (result) this.districtList = city.children;
        return result;
    }
    initRegion(inCallback, code = 999999, parentCode, level = 1, outCallback) {
        if (level < 4) {
            if (this.hasChildren(code, parentCode, level)) {
                if (outCallback) outCallback();
                return;
            }
            FetchUtil.get({
                url: `/basic/region/${code}/findByParent`,
                success: ({ data }) => {
                    if (inCallback)
                        inCallback(code, parentCode, data, outCallback);
                    level++;
                    this.initRegion(
                        level === 2 ? this.setCityList : this.setDistrictList,
                        data[0].regionCode,
                        data[0].parentCode,
                        level,
                        outCallback
                    );
                }
            })
        }
    }
}

export default Region = new Region();