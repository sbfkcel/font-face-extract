# font-face-extract

[![npm version](https://badge.fury.io/js/font-face-extract.svg)](https://badge.fury.io/js/font-face-extract)

用于提取html文件中有使用自定义字体 (WebFont) 的文字及对应字体的文件路径。
可以结合字体提取工具 (例如：fontmin) 来压缩精简自定义字体。

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

## 相关

[https://github.com/sbfkcel/fws](fws)

`fws`是一个前端脚手架工具，其中字体精简部分就有使用到`font-face-extract`

## License
ISC
