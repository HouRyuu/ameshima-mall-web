import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, browserHistory, IndexRoute} from "react-router";
import {LocaleProvider} from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import Index from "./index/";
import Error from "./error/Error";
import Login from "./login/";
import ForgetPwd from "./login/ForgetPwd";
import AliPayLogin from "./login/alipay";
import Register from "./register/";
import StoreIndex from "./store/";
import GoodsIndex from "./goods/";
import SearchIndex from "./search/";
import CartIndex from "./cart/";
import Manage from "./manage/";
import PersonalInfo from "./manage/personalInfo/";
import Order from "./manage/order/";
import Address from "./manage/address/";
import OrderSubmit from "./order/";
import OrderConfirm from "./order/confirm";
import OrderConfirmDone from "./order/confirmDone";
import OrderPay from "./order/pay";
import OrderReceiveConfirm from "./order/receiveConfirm";
import OrderComment from "./order/comment";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
    <LocaleProvider locale={zh_CN}>
        <Router history={browserHistory}>
            <Route path="/" component={Index}/>
            <Route path="/error" component={Error}/>
            <Route path="/store" component={StoreIndex}/>
            <Route path="/goods" component={GoodsIndex}/>
            <Route path="/forgetPwd" component={ForgetPwd}/>
            <Route path="/login" component={Login}/>
            <Route path="/alipayLogin" component={AliPayLogin}/>
            <Route path="/register" component={Register}/>
            <Route path="/search" component={SearchIndex}/>
            <Route path="/shoppingCart" component={CartIndex}/>
            <Route path="/manage" component={Manage}>
                <IndexRoute component={PersonalInfo}/>
                <Route path="/manage/personalInfo" component={PersonalInfo}/>
                <Route path="/manage/order" component={Order}/>
                <Route path="/manage/address" component={Address}/>
            </Route>
            <Route path="/order" component={OrderSubmit}>
                <Route path="/order/confirm" component={OrderConfirm} key='confirm'/>
                <Route path="/order/confirmDone" component={OrderConfirmDone}/>
                <Route path="/order/pay" component={OrderPay}/>
                <Route path="/order/receiveConfirm" component={OrderReceiveConfirm}/>
                <Route path="/order/comment" component={OrderComment}/>
            </Route>
        </Router>
    </LocaleProvider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
