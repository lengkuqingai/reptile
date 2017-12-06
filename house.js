var superagent = require('superagent');
var cheerio =require('cheerio');
var async =require('async');
console.log("一只爬虫正在袭来。。。");

superagent
    .post('http://www.gaokaopai.com/rank-index.html')
    .send({
        start:1,
        otype:2,
        city:0,
        cate:2,
        batch_type:0
    })
    .set('Accept',"*/*")
    .set('Content-Type','application/x-www-form-urlencoded; charset=UTF-8')
    .end(function(err,res){
        var Infos = JSON.parse(res.text).data.ranks;
        async.mapLimit(Infos,1,
            function(info,callback){
                var id =info.uni_id;
                fetchInfo(id,callback);
            },
            function(err,result){
                console.log("一共抓取了"+Infos.length+"条数据")
            }
        )
    })

var count=0;
var fetchInfo=function(id,callback){
    count++;
    superagent
    .get('http://www.gaokaopai.com/daxue-jianjie-'+id+'.html')
    .end(function(err,res){
        var $ =cheerio.load(res.text,{decodeEntities: false});
        console.log($('.schoolName strong').text()+"\t"+"创建时间"+"\t"+$('.biItem .c').first().text());
        count--;
        callback(null,id)
    })
}
