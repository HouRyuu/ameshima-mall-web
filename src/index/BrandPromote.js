import React, {Component} from "react";
import {Link} from "react-router";
import {Card, Icon} from "antd";
import FetchUtil from "../utils/FetchUtil";

export default class BrandPromote extends Component {
    state = {
        brands: [],
        curPage: 1
    }

    findBrands() {
        FetchUtil.get({
            url: "/store/index/brand",
            success: ({data: brands}) => {
                if (brands) {
                    this.setState({brands});
                }
            }
        });
    }

    changeBrands(brands, curPage) {
        const totalPage = Math.ceil(brands.length / 29);
        curPage++;
        if (curPage > totalPage) {
            curPage = 1;
        }
        this.setState({curPage});
    }

    componentWillMount() {
        this.findBrands();
    }

    render() {
        const {brands, curPage} = this.state;
        return (
            <Card className="brandPromote-warp">
                {brands.map(({storeId, brandName, logoUrl}, index) => {
                    if (index < (curPage - 1) * 29 || index >= curPage * 29) return null;
                    return (
                        <Card.Grid key={index} className="brand-item">
                            <div className="brand-img">
                                <img alt="" src={logoUrl}/>
                            </div>
                            <Link
                                className="brand-mask"
                                target="_blank"
                                to={`/store?id=${storeId}`}
                                onlyActiveOnIndex>
                                <div className="brandName">
                                    <span>{brandName}</span>
                                </div>
                                <div className="enter">お店に入る</div>
                            </Link>
                        </Card.Grid>
                    );
                })}
                <Card.Grid
                    className="brand-item refresh-btn"
                    onClick={() => this.changeBrands(brands, curPage)}
                >
                    <Icon type="sync"/>
                    <span>チェンジ</span>
                </Card.Grid>
            </Card>
        );
    }
}
