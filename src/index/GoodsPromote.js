import React, { Component } from "react";
import GoodsPromoteList from "./GoodsPromoteList";

export default class GoodsPromote extends Component {
  render() {
    return (
      <div className="goodsPromote-warp">
        <GoodsPromoteList goodsType />
      </div>
    );
  }
}
