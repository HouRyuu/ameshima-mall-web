import React, { Component } from "react";
import { Link } from "react-router";
import "./goodsGrid.css";

export default class GoodsGrid extends Component {
  addLikeCategory(categoryId) {
    if (!categoryId) return;
    // 向本地缓存添加浏览商品类型，最多10个，超出时移除最老的类型
    const likeCategory = localStorage.getItem("likeCategory");
    const likeArray = likeCategory ? likeCategory.split(",") : [];
    if (likeArray.indexOf(categoryId + "") < 0) {
      if (likeArray.length === 10) {
        likeArray.shift();
      }
      likeArray.push(categoryId);
      localStorage.setItem("likeCategory", likeArray.join(","));
    }
  }
  render() {
    const {
      id = 1,
      imgUrl = "//gw.alicdn.com/bao/uploaded/i4/2118680248/O1CN01xzNZAZ1Dhcm4rkcyg_!!2118680248.jpg",
      name = "本汀夏季超薄冰丝T恤短袖速干垂钓服 防晒服男款防蚊钓鱼服装衣服",
      price = 58,
      categoryId
    } = this.props;
    return (
      <Link
        className="goodsGrid-link"
        target="_blank"
        to={`/goods?id=${id}`}
        onClick={() => {
          this.addLikeCategory(categoryId);
        }}
      >
        <div className="goodsGrid-warp">
          <img alt="" className="goodsGrid-img" src={imgUrl} />
          <div className="goodsGrid-title">{name}</div>
          <div className="goodsGrid-price">¥{price}</div>
        </div>
      </Link>
    );
  }
}
