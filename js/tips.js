var Tips = function (el, consEl, autoH){
	this.el = el;
	this.consEl = consEl;
	this.autoH = autoH;
}
Tips.prototype.show = function(cons){
	var _this = this;
	_this.consEl.html(cons);
	_this.el.show(300, function(){
		setTimeout(function(){
			if(_this.autoH && _this.el.css('display') === 'block'){
				_this.autoHide();
			}
		}, 1000);
	});
}
Tips.prototype.hide = function(){
	this.el.hide(300);
}
Tips.prototype.autoHide = function(){
	var _this = this;
	setTimeout(function(){
		_this.hide();
	}, 1600);
}

/*
	bug 
		自动隐藏设计的 bug
			1.开启自动隐藏
			2.立刻手动关闭  -- auto = false
			3.show -- auto = true
			4.等到下一个元素出现时引起了秒退的bug

			_this.el.attr('display') === 'block'

			粗糙的修复方式：
			
				分成两个时段完成自动隐藏功能

				如果是3000毫秒：用户秒关弹层，在下一轮出现时，上一次的延迟执行还是符合两个条件，所以出现bug

				如果是1000毫秒：在进度，跳跃一些列操作中，1000毫秒完成不了，下一轮弹层不会出现，上一轮延迟执行条件不会成立
					如果卡点1500 毫秒执行，后面的autoH 也已经快要执行所以操作的是一次弹层

				如果是500毫秒：照样存在如果秒退在方法执行之后，会引起bug


 */ 