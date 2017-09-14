const FontCatch = require('../main');
new FontCatch({
	src:__dirname+'/demo.html'
}).then(result => {
	console.log('status:'+result.status);
	let resultData = result.data;
	resultData.forEach(item => {
		console.log('selectors:',item.selectors)
		console.log('text:',item.text);
		console.log('fontPath:',item.fontPath);
		console.log('------------------------')
	});
}).catch(err => {
	console.log(err);
});