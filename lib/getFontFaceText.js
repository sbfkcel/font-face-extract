class GetPageFontFaceText {
    constructor(option){
        option = option || {};
        const _ts = this;
        let m = _ts.m = {
                fs:require('fs'),
                path:require('path'),
                Jsdom:require('jsdom').JSDOM,
                css:require('css')
            },
            config = _ts.config = {};

        for(let i in option){
            config[i] = option[i];
        };

        //config.src = m.path.join(config.src);
        //如果是相对路径则将文件转换成绝对路径
        if(m.path.parse(config.src).root === ''){
            config.src = m.path.join(__dirname,...(config.src.split('/')))
        };

        config.html = m.fs.readFileSync(config.src).toString();
        config.dom = new m.Jsdom(config.html);

        return new Promise((resolve,reject)=>{
           try {
                resolve({
                    status:'success',
                    data:{
                        page:config.src,
                        data:_ts.getPageText()
                    }
                });
            } catch (error) {
                reject({
                    status:'error',
                    data:error
                });
            };
        });
    }

    getPageText(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        
        let cssSelect = _ts.getCssSelect(),
            temp = [];
        for(let i in cssSelect){
            let selectors = cssSelect[i],
                oe,
                string = '';
            //遍历选择器，获取其文本
            selectors.forEach(item => {
                oe = config.dom.window.document.querySelectorAll(item);
            });
            oe.forEach(item => {
                string += item.textContent;
            });
            temp.push({
                selectors:selectors,
                fontPath:i,
                text:string
            });
        };

        //文字去重
        temp.forEach(item => {
            let text = item.text,
                string = '';
            _ts.unique([...text]).forEach(_item => {
                string +=_item;
            });
            item.text = string;
        });

        return temp;
    }

    /**
     * 获取有自定义字体的css选择器及字体路径
     */
    getCssSelect(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        
        let cssSelect = [],
        	formatFontName = (fontName)=>fontName.replace(/'|"/ig,''),
            pageCss = _ts.getPageCss();

        
        pageCss.forEach(item => {
            //遍历转换的css数据，找出自定义的字体
            let rules = item.cssParse.stylesheet.rules,
                fontFaces = [];

            rules.forEach(_item => {
                //如果类型为自定义字体，则找到自定义字体的名称和字体路径
                if(_item.type && _item.type === 'font-face'){                    
                    let fontName,
                        fontPath;
                    
                    _item.declarations.some(__item => {
                        //得到字体名称
                        if(__item.property === 'font-family' && __item.value){
                            fontName = __item.value;
                        };

                        //得到字体路径
                        if(__item.property === 'src' && __item.value){
                            fontPath = __item.value;
                            fontPath = fontPath.substr(5,fontPath.length - 10) + 'ttf';

                            fontPath = m.path.join(
                                item.cssPath === '' ? m.path.dirname(config.src) : m.path.dirname(item.cssPath),
                                ...fontPath.split('/')
                            )
                        };

                        //当已经获得名称和路径之后则不再循环
                        if(fontName != undefined && fontPath != undefined){
                            return true;
                        };
                    });
                    
                    //将页面中自定义的字体信息储存起来
                    fontFaces.push({
                        fontName:fontName,
                        fontPath:fontPath
                    });
                };
            });


            //console.log(JSON.stringify(rules,null,2))
            //遍历页面自定义字体名称，在css元素选择器中查询font-family与之相等的
            fontFaces.forEach($item => {
                let fontName = $item.fontName;

                rules.forEach(_item => {
                    if(_item.type === 'rule'){
                        _item.declarations.forEach(__item => {
                            if(__item.property === 'font-family' && formatFontName(__item.value) === formatFontName(fontName)){             
                                cssSelect.push({
                                    selectors:_item.selectors,
                                    fontPath:$item.fontPath
                                });
                            };
                        });
                    };
                });
            });
        });

        let o = {};
        //合并重复的字体文件路径为一个
        cssSelect.forEach($item => {
            let fontPath = $item.fontPath,
                selectors = $item.selectors;
            if(o[fontPath] === undefined){
                o[fontPath] = [];
            };
            o[fontPath].push(...selectors);
        });

        //合并重复的选择器
        for(let i in o){
            o[i] = _ts.unique(o[i]);
        };

        // 返回格式示例，key为字体路径，val为元素选择器
        // {
        //     'C:\Users\username\images\fontName3.ttf': [ 'div' ],        
        //     'C:\Users\username\Desktop\a\YourWebFontName.ttf': [ '.div' ]
        // }
        return o;
    }

    //数组去重
    unique(array){
        let temp = [];
        array.forEach(item => {
            if(temp.indexOf(item) === -1){
                temp.push(item);
            };
        });
        return temp;
    }
    
    /**
     * 获取html中的css内容
     */
    getPageCss(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        let css = [],
            dom = config.dom,
            obj = dom.window.document.querySelectorAll('link,style');

        obj.forEach(item => {
            let tagName = item.tagName;

            //Link标签则读取标href文件内容
            if(tagName === 'LINK' && item.rel === 'stylesheet' && item.href !== ''){
                let path = item.href.split('/'),
                    linkFilePath = m.path.join(m.path.dirname(config.src),...path),
                    fileInfo = _ts.getPathInfo(linkFilePath);
                //确保文件有效读取link css文件
                if(fileInfo.type === 'file'){
                    let linkCssContent = m.fs.readFileSync(linkFilePath).toString();
                    css.push({
                        cssPath:linkFilePath,                   //css文件路径
                        cssContent:linkCssContent,              //css文件内容
                        cssParse:m.css.parse(linkCssContent)    //css文件解析为json的数据
                    });
                };
            }
            //style样式则获取其包含的样式
            else if(tagName === 'STYLE'){
                css.push({
                    cssPath:config.src,                         //css文件路径
                    cssContent:item.textContent,                //css文件内容
                    cssParse:m.css.parse(item.textContent)      //css文件解析为json的数据
                });
            };
        });
        return css;
    }

    /**
     * 获取路径中文件信息
     * @param {*} fileOrDirPath 
     */
    getPathInfo(fileOrDirPath){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        let info = {
            'type':undefined,               //类型 'dir'|'file'
            'extension':undefined,          //扩展名 'undefined|空|.xxx'
            'name':undefined                //文件名 不包含扩展名部分
        };
    
        try {
            let stat = m.fs.statSync(fileOrDirPath);
    
            //如果路径是一个目录，则返回目录信息
            if(stat.isDirectory()){
                info.type = 'dir';
    
                let backPath = m.path.resolve(fileOrDirPath,'../'),       //跳到路径上一级目录
                    dirName = fileOrDirPath.replace(backPath,''),         //去除上级目录路径
                    re = /[/]|[\\]/g;
    
                info.name = dirName.replace(re,'');                       //去除处理路径后的/\符号
            };
    
            //如果是文件则返回文件信息
            if(stat.isFile()){
                info.type = 'file';
                info.extension = m.path.extname(fileOrDirPath);
                info.name = m.path.basename(fileOrDirPath,info.extension);
            };
        } catch (error) {
            //tip.error(error);
        };
    
        return info;
    }

};

module.exports = GetPageFontFaceText;