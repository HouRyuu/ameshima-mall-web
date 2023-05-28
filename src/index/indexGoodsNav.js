import React, {Component} from "react";
import {Link} from "react-router";
import {Row, Col, List, Icon} from "antd";
import FetchUtil from "../utils/FetchUtil";

export default class IndexGoodsNav extends Component {
    state = {
        secondCategories: [],
        childrenCategories: [],
        showChildren: false
    };

    findSecondCategories() {
        FetchUtil.get({
            url: "/goods/findSecondCategories",
            success: result => {
                const {data: secondCategories} = result;
                this.setState({secondCategories});
            }
        });
    }

    findChildren(category) {
        if (!category) return;
        if (category.children) {
            this.setState({childrenCategories: category.children});
            return;
        }
        FetchUtil.get({
            url: `/goods/${category.id}/findCategories`,
            success: result => {
                const {data: childrenCategories} = result;
                category.children = childrenCategories;
                this.setState({childrenCategories});
            }
        });
    }

    componentWillMount() {
        this.findSecondCategories();
    }

    render() {
        const {
            secondCategories,
            childrenCategories,
            showChildren
        } = this.state;
        return (
            <div className="goods-nav-warp">
                <img
                    alt="雨島で理想的な生活を"
                    src={`${window.origin}/LOGO.png`}
                    width="240"
                    style={{margin: "30px 0"}}
                />
                <div className="goods-nav-head">
                    <Icon type="unordered-list"/>
                    商品分類
                </div>
                <div className="category-warp">
                    <List
                        size="small"
                        split={false}
                        dataSource={secondCategories}
                        renderItem={item => (
                            <List.Item
                                onMouseOver={() => {
                                    this.findChildren(item);
                                    this.setState({showChildren: true});
                                }}
                            >
                                {item.name}
                            </List.Item>
                        )}
                    />
                    <div
                        className="category-content"
                        onMouseOver={() => {
                            this.setState({showChildren: true});
                        }}
                        onMouseOut={() => {
                            this.setState({showChildren: false});
                        }}
                        style={!showChildren ? {display: "none"} : null}
                    >
                        <div className="category-pannel">
                            {childrenCategories.map(({id, name, categoryList = []}) => (
                                <Row
                                    key={id}
                                    type="flex"
                                    justify="start"
                                    className="hot-word-line"
                                >
                                    <Col span={3} className="line-title">
                                        {name}
                                        <Icon type="right" style={{margin: 3}}/>
                                    </Col>
                                    <Col span={21} className="line-con">
                                        {categoryList.map(({id, name}) => (
                                            <Link
                                                key={id}
                                                to={{pathname: "/search", search: `?q=${name}`}}
                                                onlyActiveOnIndex>
                                                {name}
                                            </Link>
                                        ))}
                                    </Col>
                                </Row>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
