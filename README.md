# font-catch

Used to extract the font-face text in the html file.

## USE
```bash
npm install font-prune
```

```javascript
const FontCatch = require('font-catch');
new FontCatch({
	src:'./test/index.html'
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
```
