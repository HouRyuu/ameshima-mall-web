import FetchUtil from './FetchUtil';

class Region {
    provinceList = [];
    cityList = [];
    districtList = [];
    constructor() {
        this.initRegion(this.setProvinceList);
    }
    setProvinceList = (region, provinceList) => {
        region.children = provinceList;
        this.provinceList = provinceList;
    }
    setCityList = (region, cityList) => {
        region.children = cityList;
        this.cityList = cityList;
    }
    setDistrictList = (region, districtList) => {
        region.children = districtList;
        this.districtList = districtList;
    }
    initRegion(callback, region = { regionCode: 999999 }, level = 1) {
        if (level < 4) {
            FetchUtil.get({
                url: `/basic/region/${region.regionCode}/findByParent`,
                success: ({ data }) => {
                    if (callback)
                        callback(region, data);
                    level++;
                    this.initRegion(
                        level === 2 ? this.setCityList : this.setDistrictList, data[0], level);
                }
            })
        }
    }
}

export default Region = new Region();