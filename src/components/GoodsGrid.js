import React, { Component } from "react";
import "./goodsGrid.css";

export default class GoodsGrid extends Component {
  render() {
    const {
      goods: {
        id = 1,
        imgUrl = "//gw.alicdn.com/bao/uploaded/i4/2118680248/O1CN01xzNZAZ1Dhcm4rkcyg_!!2118680248.jpg",
        title = "本汀夏季超薄冰丝T恤短袖速干垂钓服 防晒服男款防蚊钓鱼服装衣服",
        price = 58
      }
    } = this.props;
    return (
      <a className="goodsGrid-link" rel="noopener noreferrer" href={`/goods/detail?id=${id}`}>
        <div className="goodsGrid-warp">
          <img className="goodsGrid-img" src={imgUrl} />
          <div className="goodsGrid-title">{title}</div>
          <div className="goodsGrid-price">￥{price}</div>
        </div>
      </a>
    );
  }
}
