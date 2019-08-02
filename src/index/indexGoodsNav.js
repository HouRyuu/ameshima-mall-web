import React, {Component} from 'react';
import {List, Icon} from 'antd';

const goodsNavTypeList = [
  '女装 /内衣',
  '男装 /运动户外',
  '女鞋 /男鞋 /箱包',
  '美妆 /个人护理',
  '腕表 /眼镜 /珠宝饰品',
  '手机 /数码 /电脑办公',
  '母婴玩具',
  '零食 /茶酒 /进口食品',
  '生鲜水果',
  '大家电 /生活电器',
  '家具建材',
  '汽车 /配件 /用品',
  '家纺 /家饰 /鲜花',
  '医药保健',
  '厨具 /收纳 /宠物',
  '图书音像'
];
export default class IndexGoodsNav extends Component {
	render() {
		return (
			<div className="goods-nav-warp">
				<List
					size="small"
					split={false}
					header={<div><Icon type="unordered-list" />商品分类</div>}
					dataSource={goodsNavTypeList}
					renderItem={item => <List.Item>{item}</List.Item>}
				/>
			</div>
		)
	}
}