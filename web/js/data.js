var xls_json = require('xls-to-json');

xls_json(
    {
        input: "././doc/data.xls",
        output : "./web/data/data.json"
    }, 
    function(err, result) {
        if(err) {
            console.error(err);
        } 
        else {
           // console.log(result);
            console.log("数据导出成功！");
        }
    }
);