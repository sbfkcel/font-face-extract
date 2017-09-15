const path = require('path'),
	FontCatch = require('../main');

let fontCatch = new FontCatch({
	src:[path.join(__dirname,'demo.html'),path.join(__dirname,'demo1.html')]
});

fontCatch.then(result => {
	console.log(JSON.stringify(result,null,2))
}).catch(error => {
	console.log('错误',error);
});