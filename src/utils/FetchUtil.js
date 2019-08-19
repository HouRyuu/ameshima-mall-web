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
    url = "http://localhost" + url;
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
          if (result.errCode !== undefined) {
            success(result);
            return;
          }
          console.error(result);
          if (error) {
            error();
          }
        });
      })
      .catch(e => {
        console.error(e);
        if (error) {
          error();
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
}

export default FetchUtil = new FetchUtil();
