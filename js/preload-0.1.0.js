// 预加载
var progressText = $('.progress-text');
var proBar = $('#proBar');
var proIcon = $('#proIcon');
var Preload = function(){};
Preload.prototype.preload = function(callback){
    this.queue = new createjs.LoadQueue();  
    this.callback = callback;
    if(this.callback){   //加载完成
        this.queue.on("complete", this.callback, this);    
    }
    this.queue.on("progress", function(event){   
        var progress = Math.round(event.progress*100);
        progressText.html(progress + " %");   
        proIcon.css('left',(progress*0.85) + '%');
        proBar.css('left',(progress-100)  + '%');
    })
    //this.queue.loadFile({id:"sound", src:"music/bg.mp3"});  
    this.queue.loadManifest([    //加载全部项目资源
        {id: "img0", src:"images/bg.png"},
        {id: "img1", src:"images/sprite-sheet.png"},
        {id: "img2", src:"images/game-bg.jpg"},
        {id: "obj1", src:"images/3D/boat.mtl"},
        {id: "obj2", src:"images/3D/boat.obj"},
        {id: "img3", src:"images/ui/game-pic.png"},
        {id: "img4", src:"images/ui/game-title.png"},
        {id: "img5", src:"images/ui/progress-bar.png"},
        {id: "img6", src:"images/ui/progress-bg.png"},
        {id: "img7", src:"images/ui/progress-icon.png"},
        {id: "img9", src:"images/ui/notice/accept-btn.png"},
        {id: "img10", src:"images/ui/notice/again-btn.png"},
        {id: "img11", src:"images/ui/notice/close-btn.png"},
        {id: "img12", src:"images/ui/notice/home-btn.png"},
        {id: "img13", src:"images/ui/notice/notice-bg.png"},
        {id: "img14", src:"images/ui/notice/reject-btn.png"},
        {id: "img15", src:"images/ui/scoring/explore-icon.png"},
        {id: "img16", src:"images/ui/scoring/gold-icon.png"},
        {id: "img17", src:"images/ui/scoring/goods-icon.png"},
        {id: "img18", src:"images/ui/scoring/navigation-icon.png"},
        {id: "img19", src:"images/ui/scoring/nick-pic.jpg"},
        {id: "img20", src:"images/ui/scoring/pic-border.png"},
        {id: "img21", src:"images/ui/scoring/pirate-icon.png"},
        {id: "img22", src:"images/ui/scoring/sailor-icon.png"},
        {id: "img23", src:"images/ui/start/bg.jpg"},
        {id: "img24", src:"images/ui/start/rank-btn.png"},
        {id: "img25", src:"images/ui/start/rule-btn.png"},
        {id: "img26", src:"images/ui/start/start-btn.png"},
        {id: "obj3", src:"images/3D/dao.obj"},
    ]);
};
var PreloadFn = new Preload();
PreloadFn.preload(function(){
    // 加载完成的回调
    console.log('加载完毕！！');
    $('#load').fadeOut(500, function(){

    });
});