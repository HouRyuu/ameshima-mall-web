import React, {Component} from "react";
import GoodsList from "../components/GoodsList";
import {Icon} from "antd";
import FetchUtil from "../utils/FetchUtil";

export default class GuessLike extends Component {
    state = {goodsList: []};

    findGuessLike() {
        const likeCategory = localStorage.getItem("likeCategory");
        FetchUtil.post({
            url: "/goods/guessLike",
            data: {categories: likeCategory ? likeCategory.split(",") : []},
            success: ({data: goodsList}) => this.setState({goodsList})
        });
    }

    componentWillMount() {
        this.findGuessLike();
    }

    render() {
        return (
            <div className="guessLike-warp">
                <h2 className="wonderful-title">
          <span>
            <Icon type="heart"/>
            おすすめ
          </span>
                </h2>
                <GoodsList {...this.state} />
                <div className="wonderful-end"/>
            </div>
        );
    }
}
