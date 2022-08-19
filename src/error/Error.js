import {Result, Button} from 'antd';
import React, {Component} from "react";
import {Link} from "react-router";

export default class Error extends Component {
    render() {
        return <Result
            status="500"
            title="500"
            subTitle="申し訳ない。サーバはエラーが発生してしまいました。"
            extra={<Link to="/" onlyActiveOnIndex><Button type="primary">ホームに帰る</Button></Link>}
        />
    }
}