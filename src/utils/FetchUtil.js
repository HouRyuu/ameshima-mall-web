import { message } from "antd";

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
    url = "//localhost" + url;
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
    fetch(url, fetchOptions)
      .then(res => {
        res.json().then(result => {
          if (result.errCode === 0) {
            success(result);
            return;
          }
          console.warn(result);
          if (error) {
            error(result);
            return;
          }
          if (result.message) {
            message.error(result.message)
          }
        });
      })
      .catch(e => {
        console.error(e);
        if (error) {
          error(undefined, e);
        }
      });
    if (complete) {
      complete();
    }
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
