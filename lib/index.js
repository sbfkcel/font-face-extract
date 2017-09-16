class getPagesFontFaceText{
    constructor(option){
        option = option || {};
        const _ts = this;
        let m = _ts.m = {
            GetFontFaceText:require('./getFontFaceText')
        },
        config = _ts.config = {};

        for(let i in option){
            config[i] = option[i];
        };

        return _ts.init();

    }
    taskList(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;
        let tasks = [];

        config.src.forEach(item => {
            tasks.push(()=>{
                return new m.GetFontFaceText({
                    src:item
                });
            });
        });

        return tasks;
    }
    init(){
        const _ts = this,
            m = _ts.m,
            config = _ts.config;

        let result = {
            status:'success',
            data:{
                result:{},
                detail:{}
            }
        },
        taskList = _ts.taskList(),
        
        f = async()=>{
            for(let i=0,len=taskList.length; i<len; i++){
                let task = await taskList[i]();
                
                for(let _i in task){
                    if(task[_i] === 'success'){
                        //将所有的html font-face使用到的相同字体进行汇总
                        let data = task.data.data;
                        data.forEach(item => {
                            let fontPath = item.fontPath,
                                text = item.text;
                            if(fontPath && result.data.result[fontPath] === undefined){
                                result.data.result[fontPath] = '';
                            };
                            if(fontPath && text){
                                result.data.result[fontPath] = result.data.result[fontPath]+=text;
                            };
                        });


                        //将解析出的结果整理加入到result.data.detail['htmlUrl']
                        //示意：
                        // result.data.detail['htmlUrl'] = [
                        //     {
                        //         'selectors':['.div1'],
                        //         'fontPath':'/hd/.../xx.ttf',
                        //         'text':'提取出的文字'
                        //     },
                        //     ...
                        // ]
                        result.data.detail[task.data.page] = data;
                    };
                };
            };

            //剔除页面中同一个字体共用的文字，如果字符为空的则整个删除。
            for(let i in result.data.result){
                let text = result.data.result[i],
                    string = '';

                [...text].forEach(item => {
                    if(string.indexOf(item) === -1){
                        string += item;
                    };
                });

                if(string !== ''){
                    result.data.result[i] = string;
                }else{
                    delete result.data.result[i];                    
                };                
            };
            
            return result;
        };

        return f();
        
    }
};


module.exports = getPagesFontFaceText;