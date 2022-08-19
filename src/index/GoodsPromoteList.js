import React, {Component} from "react";
import GoodsGrid from "../components/GoodsGrid";
import FetchUtil from "../utils/FetchUtil";

export default class GoodsPromoteList extends Component {
    state = {goodsList: []};

    findGoodsList() {
        const {id} = this.props;
        FetchUtil.get({
            url: `/goods/${id}/findPromoteGoods`,
            success: ({data: goodsList}) => {
                if (goodsList) {
                    this.setState({goodsList});
                }
            }
        });
    }

    componentWillMount() {
        this.findGoodsList();
    }

    render() {
        const {title, subName, bannerImg} = this.props;
        const {goodsList} = this.state;
        return (
            <div>
                <p className="floor-title">
                    <i className="color-mark"/>
                    {title}
                    <span className="floor-sub-name">{subName}</span>
                </p>
                <div className="floor-main">
                    <div className="floor-banner">
                        <img alt="" src={bannerImg}/>
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
