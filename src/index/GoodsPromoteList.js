import React, { Component } from "react";
import GoodsGrid from "../components/GoodsGrid";

export default class GoodsPromoteList extends Component {
  render() {
    const {
      goodsType: {
        title = "户外出行",
        subName = "OUTDOORS & AUTOMOTIVE",
        bannerImg = "//img.alicdn.com/tps/i4/TB1LrH4b.Y1gK0jSZFMSuuWcVXa.jpg"
      }
    } = this.props;
    return (
      <div>
        <p className="floor-title">
          <i className="color-mark"></i>
          {title}
          <span className="floor-sub-name">{subName}</span>
        </p>
        <div className="floor-main">
          <div className="floor-banner">
            <img src={bannerImg} />
          </div>
          <div className="floor-column-warp">
            <GoodsGrid goods />
            <GoodsGrid goods />
            <GoodsGrid goods />
            <GoodsGrid goods />
            <GoodsGrid goods />
            <GoodsGrid goods />
            <GoodsGrid goods />
            <GoodsGrid goods />
          </div>
        </div>
      </div>
    );
  }
}
