import React, { Component } from "react";
import { Link } from "react-router";
import { Card, Icon } from "antd";
import { fetchUtil } from "../utils/FetchUtil";

export default class BrandPromote extends Component {
  state = {};
  findBrands() {
    fetchUtil({
      url: "/goods/brand/index",
      callback: ({ data: brands }) => {
        if (brands) {
          this.setState({ brands });
        }
      }
    });
  }
  changeBrands(brands, curPage) {
    const count = brands.length;
    const totalPage = Math.ceil(brands.length / 29);
    curPage++;
    if (curPage > totalPage) {
      curPage = 1;
    }
    this.setState({ curPage, changeStyle: "flip" });
  }
  componentWillMount() {
    this.findBrands();
  }
  render() {
    const { brands = [{}], curPage = 1, changeStyle = null } = this.state;
    return (
      <Card className={`brandPromote-warp ${changeStyle}`}>
        {brands.map(({ storeId, brandName, logoUrl }, index) => {
          if (index < (curPage - 1) * 29 || index >= curPage * 29) return;
          return (
            <Card.Grid key={brandName} className="brand-item">
              <div className="brand-img">
                <img src={logoUrl} />
              </div>
              <Link className="brand-mask" to={`/store/${storeId}`}>
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
