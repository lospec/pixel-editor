//GET:  ajax(String url, Function success [,timeout])
//POST: ajax(String url, Object postData, Function success [,timeout])
Util.ajax = function (url, arg2, arg3, arg4) {
	if (typeof arg2 == 'function') {
		var success = arg2;
		var timeout = arg3 || 10000;
	}
	else {
		var postData = arg2;
		var success = arg3;
		var timeout = arg4 || 10000;
	}

	var start = new Date();
	console.log('AJAX - STARTING REQUEST', url, '(' + timeout + ')');

	//start new request
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var result;

			//try to parse as json
			try {
				result = JSON.parse(this.response);
				console.log('AJAX - COMPLETE ('+(new Date()-start)+'ms) - json:', result);
			}
			catch (e) {
				result = this.response;
				console.log('AJAX - COMPLETE ('+(new Date()-start)+'ms) - string:', this.response, e);
			}

			//return result
			success(result);

			xhr = null;
		}
		else if (this.readyState == 4) {
			console.log('ajax failed', this.readyState, this.status);
			success({ error: 'failure' });
		}
	};

	xhr.ontimeout = function(e) {
		console.log('ajax request timed out')
		success({ error: 'timeout' });
	};

	if (postData) {
		//post request
		console.log('post data: ', postData instanceof FormData, postData);

		//the the input isn't already formdata, convert it to form data
		if (!(postData instanceof FormData)) {
			console.log('converting to form data');

			var formData = new FormData();

			for (var key in postData) {
				formData.append(key, postData[key]);
			}

			postData = formData;
		}

		//send to server
		xhr.open("POST", url, true);
		xhr.timeout = timeout;
		xhr.send(postData);
	}
	else {
		//get request
		xhr.open("GET", url, true);
		xhr.timeout = timeout;
		xhr.send();
	}

	return xhr;
}