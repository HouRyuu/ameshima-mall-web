import {Result, Button} from 'antd';
import React, {Component} from "react";
import {Link} from "react-router";

export default class NotFound extends Component {
    render() {
        return <Result
            status="404"
            title="404"
            subTitle="申し訳ない。ページが見つかりません。"
            extra={<Link to="/" onlyActiveOnIndex><Button type="primary">ホームに帰る</Button></Link>}
        />
    }
}