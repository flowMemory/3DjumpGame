// ui 交互
$('.start-btn').on('click', function(){
	$('.start-page').hide();
	$('.score-panel').addClass('disShow').removeClass('disHidden');
    $('#touchEle').show();
});
// 排行
$('.rank-btn').on('click', function(){
	$('.rank-group').show();
});