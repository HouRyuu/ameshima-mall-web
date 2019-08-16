import React, { Component } from "react";
import GoodsGrid from "../components/GoodsGrid";
import { fetchUtil } from "../utils/FetchUtil";

export default class GoodsPromoteList extends Component {
  state = {};
  findGoodsList() {
    const { id } = this.props;
    fetchUtil({
      url: `/goods/${id}/findPromoteGoods`,
      callback: ({ data: goodsList }) => {
        if (goodsList) {
          this.setState({ goodsList });
        }
      }
    });
  }
  componentWillMount() {
    this.findGoodsList();
  }
  render() {
    const {
      id,
      title = "户外出行",
      subName = "OUTDOORS & AUTOMOTIVE",
      bannerImg = "//img.alicdn.com/tps/i4/TB1LrH4b.Y1gK0jSZFMSuuWcVXa.jpg"
    } = this.props;
    const { goodsList = [] } = this.state;
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
            {goodsList.map(goods => (
              <GoodsGrid key={goods.id} {...goods} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
