import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory } from "react-router";
import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import Index from "./index/";
import Login from "./login/";
import ForgetPwd from "./login/ForgetPwd";
import AliPayLogin from "./login/alipay";
import Register from "./register/";
import StoreIndex from "./store/";
import GoodsIndex from "./goods/";
import SearchIndex from "./search/";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <Router history={browserHistory}>
      <Route path="/" component={Index} />
      <Route path="/store" component={StoreIndex} />
      <Route path="/goods" component={GoodsIndex} />
      <Route path="/forgetPwd" component={ForgetPwd} />
      <Route path="/login" component={Login} />
      <Route path="/alipayLogin" component={AliPayLogin} />
      <Route path="/register" component={Register} />
      <Route path="/search" component={SearchIndex} />
    </Router>
  </LocaleProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
