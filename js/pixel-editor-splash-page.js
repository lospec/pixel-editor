

ajax('https://api.github.com/repos/lospec/pixel-editor/contributors', response => {
	console.log(response)

	if (Array.isArray(response)) {

		var html = '';

		response.forEach(c => {
			//skip lospec
			if (c.login == 'lospec') return;

			//add to html
			html+='<a target="_blank" href="'+c.html_url+'"><img src="'+c.avatar_url+'&s=60" /> '+c.login+'</a>'
		});

		document.querySelector('.contributors').innerHTML = html;
	}
});