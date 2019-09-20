import React, { Component } from "react";
import { Link } from "react-router";
import { Card, Icon } from "antd";
import FetchUtil from "../utils/FetchUtil";

export default class BrandPromote extends Component {
  state = {};
  findBrands() {
    FetchUtil.get({
      url: "/store/index/brand",
      success: ({ data: brands }) => {
        if (brands) {
          this.setState({ brands });
        }
      }
    });
  }
  changeBrands(brands, curPage) {
    const totalPage = Math.ceil(brands.length / 29);
    curPage++;
    if (curPage > totalPage) {
      curPage = 1;
    }
    this.setState({ curPage });
  }
  componentWillMount() {
    this.findBrands();
  }
  render() {
    const { brands = [{}], curPage = 1 } = this.state;
    return (
      <Card className="brandPromote-warp">
        {brands.map(({ storeId, brandName, logoUrl }, index) => {
          if (index < (curPage - 1) * 29 || index >= curPage * 29) return null;
          return (
            <Card.Grid key={brandName} className="brand-item">
              <div className="brand-img">
                <img alt="" src={logoUrl} />
              </div>
              <Link
                className="brand-mask"
                target="_blank"
                to={`/store?id=${storeId}`}
              >
                <div className="brandName">
                  <span>{brandName}</span>
                </div>
                <div className="enter">点击进入</div>
              </Link>
            </Card.Grid>
          );
        })}
        <Card.Grid
          className="brand-item refresh-btn"
          onClick={() => this.changeBrands(brands, curPage)}
        >
          <Icon type="sync" />
          <span>换一批</span>
        </Card.Grid>
      </Card>
    );
  }
}
