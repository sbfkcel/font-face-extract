# font-face-extract

Used to extract the font-face text in the html file.

## API
```bash
npm install font-face-extract
```

```javascript
const FontFaceExtract = require('font-face-extract');
let extract = new FontFaceExtract({
	src:['xxx/demo1.html','xxx/demo2.html']
});

extract.then(result => {
	console.log(JSON.stringify(result,null,2))
}).catch(error => {
	console.log('错误',error);
});
```

## License
ISC
