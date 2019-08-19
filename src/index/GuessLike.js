import React, { Component } from "react";
import GoodsGrid from "../components/GoodsGrid";
import { Icon } from "antd";
import FetchUtil from "../utils/FetchUtil";

export default class GuessLike extends Component {
  state = {};
  findGuessLike() {
    const likeCategory = localStorage.getItem("likeCategory");
    FetchUtil.post({
      url: "/goods/guessLike",
      data: { categories: likeCategory ? likeCategory.split(",") : [] },
      success: ({ data }) => {
        if (data && data.length > 0) {
          const goodsList = [];
          data.forEach((item, index) => {
            if (index % 5 === 0) {
              goodsList.push([]);
            }
            goodsList[goodsList.length - 1].push(item);
          });
          this.setState({ goodsList });
        }
      }
    });
  }
  componentWillMount() {
    this.findGuessLike();
  }
  render() {
    const { goodsList = [[]] } = this.state;
    return (
      <div className="guessLike-warp">
        <h2 className="wonderful-title">
          <span>
            <Icon type="heart" />
            猜你喜欢
          </span>
        </h2>
        <div>
          {goodsList.map((goodsArray, index) => {
            return (
              <ul key={index} className="wonderful-line">
                {goodsArray.map(goods => {
                  return (
                    <li key={goods.id} className="wonderful-item">
                      <GoodsGrid {...goods} />
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </div>
        <div className="wonderful-end"></div>
      </div>
    );
  }
}
