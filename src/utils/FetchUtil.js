export const fetchUtil = (params = {}) => {
	let {
		url,
		callback,
		method = 'get',
		body = {},
		sendBefore,
		complete
	} = params;
	url = 'http://localhost' + url;
	const headers = new Headers();
	headers.append('Accept', 'application/json');
	headers.append('Content-Type', 'application/json;charset=UTF-8');
	const token = sessionStorage.getItem('token');
	if (token) {
		headers.append('token', token);
	}
	const fetchOptions = {
		method,
		headers,
	};
	if (method !== 'get') {
		fetchOptions.body = JSON.stringify(body);
	} else {
		let params = [];
		for (let key in body) {
			params.push(`${key}=${body[key]}`)
		}
		if (params.length) {
			url += `?${params.join('&')}`
		}
	}
	// const request = new Request(url, fetchOptions);
	if (sendBefore) {
		sendBefore();
	}
	fetch(url, fetchOptions).then(res => {
		res.json().then(result => {
			callback(result)
		});
	});
	if (complete) {
		complete();
	}
}
