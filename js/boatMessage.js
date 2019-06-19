// boatBM 0
var BoatMessage = {
	sailor: 50,
	goods: 200,
	gold: 1000,
	navigationReputation: 0,
	exploreReputation: 0,
	pirateReputation: 0,
	nobility: null
}
// boatRank
var boatRank = {
	reputationRankVal: [50, 100, 200, 300, 500, 1000],
	reputationNobility: [false, false, false, false, false, false],
	reputationNobility2: [false, false, false, false, false, false],
	reputationNobility3: [false, false, false, false, false, false],
	navigationRank: ['西班牙爵士', '西班牙子爵', '西班牙男爵', '西班牙伯爵', '西班牙侯爵', '西班牙公爵'],
	exploreRank: ['协会会员', '协会委员', '协会理事', '协会秘书长', '协会荣誉会长', '共和国名誉执政'],
	pirateRank: ['英格兰爵士', '英格兰子爵', '英格兰男爵', '英格兰伯爵', '英格兰侯爵', '英格兰公爵']
}
// 获取成长值 10, 5, 20, 100  0.1 0
var proBaseVal = 0.1;
var proCommonVal = 0;
var getGrowVal = {
	perjectState: {
		reputatioVal: 10,
		valArr: [
			{growVal: BoatMessage.sailor * proBaseVal},
			{growVal: BoatMessage.goods * proBaseVal},
			{growVal: BoatMessage.gold * proBaseVal}
		]
	},
	commonState: {
		reputatioVal: 1,
		valArr: [
			{growVal: proCommonVal},
			{growVal: proCommonVal},
			{growVal: proCommonVal}
		]
	},
	weakState: {
		reputatioVal: 0,
		valArr: [
			{growVal: -BoatMessage.sailor * 0.1},
			{growVal: -BoatMessage.goods * 0.05},
			{growVal: -BoatMessage.gold * 0.05}
		]
	}
}
// 登陆点
var dropEvent = ['port', 'island', 'boat'];
// 称号接受状态
var acceptFlagArr = {
	portFlag: true,
	islandFlag: true,
	boatFlag: true,
	lastFlag: false
};
// 事件文案
var eventText = {
	port: {
		state: [
			"成功到XXX港口，面见港口总督，签署贸易谈判协定，XXX增加XXX，大幅度增加海商声望",
			"顺利到XXX港口，面见港口总督，成功购入特产品，微弱增加海商声望",
			"到达XXX港口，遭遇税务官突击检查，被罚没XXXXXXX"
		]
	},
	island: {
		state: [
			"成功到XXX岛屿，获取大量探险经验，XXX增加XXX，大幅度增加海商声望",
			"顺利到XXX岛屿，微弱增加海商声望",
			"到达XXX岛屿，遭遇风暴袭击，被处罚XXXXXX"
		]
	},
	boat: {
		state: [
			"成功掠夺XXX敌对海船，签署贸易谈判协定，XXX增加XXX，大幅度增加海商声望",
			"顺利会务路过的XXX舰船，会见船长，微弱增加海商声望",
			"不低敌方XXX海船，惨遭搜刮，被罚没XXXXXX"
		]
	}
}
// name  12
var dropSiteName = {
	port: ['哈瓦特','哈瓦那','委拉克路斯','美利达','特卢希优','波多韦罗','牙买加','圣多明尼加','圣约翰','马拉开波','卡恩内','伯南布哥'],
	island: ['安提瓜','夏威夷群岛','圣基茨','圣马丁','巴巴多斯','特立尼达','多巴哥','圣托马斯','牙买加','圣卢西亚','古巴','波多黎各'],
	boat:['黑胡子','基德','安妮-鲍利','黑萨姆','巴沙洛缪-罗伯茨','摩根','棉布杰克','德雷克','红胡子兄弟','安·东尼','丹彼尔','托马斯']
}