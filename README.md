# font-face-extract

Used to extract the font-face text in the html file.

## USE
```bash
npm install font-face-extract
```

```javascript
const FontFaceExtract = require('font-face-extract');
let extract = new FontCatch({
	src:'./test/index.html'
});
extract.then(result => {
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
