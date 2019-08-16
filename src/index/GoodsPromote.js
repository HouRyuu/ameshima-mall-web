import React, { Component } from "react";
import GoodsPromoteList from "./GoodsPromoteList";
import { fetchUtil } from "../utils/FetchUtil";

export default class GoodsPromote extends Component {
  state = {};
  findPromoteList() {
    fetchUtil({
      url: "/goods/indexPromotePlate",
      callback: ({ data: promoList }) => {
        if (promoList) {
          this.setState({ promoList });
        }
      }
    });
  }
  componentWillMount() {
    this.findPromoteList();
  }
  render() {
    const { promoList = [] } = this.state;
    return (
      <div className="goodsPromote-warp">
        {promoList.map(promoPlate => (
          <GoodsPromoteList key={promoPlate.id} {...promoPlate} />
        ))}
      </div>
    );
  }
}
