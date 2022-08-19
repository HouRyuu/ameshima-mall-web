import {message} from "antd";
import {browserHistory} from "react-router";

class FetchUtil {
    send(params = {}) {
        let {
            url,
            method = "get",
            data = {},
            sendBefore,
            success,
            error,
            complete
        } = params;
        url = "//localhost:8080" + url;
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json;charset=UTF-8");
        const token = localStorage.getItem("token");
        if (token) {
            headers.append("token", token);
        }
        const fetchOptions = {
            method,
            headers
        };
        if (method !== "get") {
            fetchOptions.body = JSON.stringify(data);
        } else {
            let params = [];
            for (let key in data) {
                params.push(`${key}=${data[key]}`);
            }
            if (params.length) {
                url += `?${params.join("&")}`;
            }
        }
        if (sendBefore) {
            sendBefore();
        }
        let errorFlag = true, completeFlag = true;
        fetch(url, fetchOptions).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        }).then(result => {
            const errCode = result.errCode;
            if (errCode === 0) {
                success(result);
                if (complete) {
                    complete(result);
                }
                completeFlag = false;
                return;
            }
            console.warn(result);
            if (error) {
                error(result);
            } else if (result.errMsg) {
                if (errCode === 201 || errCode === 202) {
                    if (complete) {
                        complete(result);
                    }
                    completeFlag = false;
                    message.error(result.errMsg, () => {
                        browserHistory.push({
                            pathname: "/login",
                            search: `?redirectURL=${escape(window.location)}`
                        });
                    });
                    return;
                }
                message.error(result.errMsg);
            }
            errorFlag = false;
            if (complete) {
                complete(result);
            }
            completeFlag = false;
        }).catch(e => {
            console.error('fetch exception', e);
            if (error && errorFlag) {
                error(e);
            } else if (e.message) {
                message.error(`${url} => ${e.message}`);
            }
            if (complete && completeFlag) {
                complete(undefined, e);
            }
            browserHistory.push({pathname: "/error"})
        });
    }

    get(param) {
        this.send(param);
    }

    post(param = {}) {
        param.method = "post";
        this.send(param);
    }

    put(param = {}) {
        param.method = "put";
        this.send(param);
    }

    delete(param = {}) {
        param.method = "delete";
        this.send(param);
    }
}

export default FetchUtil = new FetchUtil();
