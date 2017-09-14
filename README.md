# font-catch

Used to extract the font-face text in the html file.

## USE
```bash
npm install font-catch
```

```javascript
const FontCatch = require('font-catch');
new FontCatch({
	src:'./test/index.html'
}).then(result => {
	console.log(result);
}).catch(err => {
	console.log(err);
});
```
