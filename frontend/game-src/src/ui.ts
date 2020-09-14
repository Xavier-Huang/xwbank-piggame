namespace game{
	import ui = ez.ui;
	
	ui.registerTextStyle([
		{ id:"normal", font:"28px", color:"#bbadfb" },
		{ id:"normalCenter", font:"28px", color:"#bbadfb", align:1 },
		{ id:"rankPage", font:"28px", color:"#757981" },
		{ id:"gameHead", font:"28px", color:"#fff" },
	]);
	
	var Templates = {
		GamePage:{
			name: "game.GamePage",
			init: function(control) {
				
			},
			childs:[
				{ class: "UIStage", id: "game", left:0, width:710, top:0, height:1280, _childs:[
					{ type: "Image", src:"image/bg" },
					{ type: "Image", id:"wall1", src:"game/wall2", anchorX:0.5, anchorY:0.5, x:150, y:1085 },
					{ type: "Image", id:"wall2", src:"game/wall2", anchorX:0.5, anchorY:0.5, x:560, y:1085 },
					{ type: "Image", id:"wall3", src:"game/wall", angle:90, x:40, y:570, anchorX:0.5, anchorY:0.5, width:1000 },
					{ type: "Image", id:"wall4", src:"game/wall", angle:90, x:670, y:570, anchorX:0.5, anchorY:0.5, width:1000 },
					{ type: "Image", id:"wall5", src:"game/wall", x:355, y:930, anchorX:0.5, anchorY:0.5, width:600, height:10, opacity:0.3 },
				] },
				{ class: "Control", id: "touch", width:"100%", height:"100%" },
				{ class: "Group", id: "intro", width:"100%", height:"100%", _childs:[
					{ class: "RectFill", color:"#000", opacity:0.3, width:"100%", height:"100%" },
					{ class: "Group", width:"100%", height:600, y:"50%", _childs:[
						{ class: "Image", src:"image/说明", x:"50%" },
						{ class: "game.Button", id: "ok2Btn", label:"确定", x:"50%", width:195, height:70, top:400 },
					] },
				] },
				{ class: "Group", id: "helpPage", width:"100%", height:"100%", visible:false, _childs:[
					{ class: "RectFill", color:"#000", opacity:0.3, width:"100%", height:"100%" },
					{ class: "Image", src:"image/活动规则", x:"50%", top:160 },
					{ class: "Group", width:"100%", top:900, bottom:0, _childs:[
						{ class: "game.Button", id: "okBtn", label:"已知晓", x:"50%", width:195, height:70, top:"30%" },
					] },
				] },
				{ class: "Group", id: "clock", width:66, height:66, x:611, y:1027, visible:false, _childs:[
					{ class: "Image", src:"game/clock" },
					{ class: "Label", id: "time", font:"34px", color:"#fff", width:"100%", height:"100%", align:5 },
				] },
				{ class: "Image", id: "disk", src:"game/disk", visible:false },
				{ class: "Group", width:"100%", height:70, textStyle:"gameHead", _childs:[
					{ class: "RectFill", width:"100%", height:70, color:"#2c296e" },
					{ class: "RectFill", width:"100%", top:70, height:2, color:"#6854aa" },
					{ class: "Image", id: "avatar", left:28, width:50, top:13, height:50 },
					{ class: "Label", id: "name", left:87, width:200, top:24, height:27, format:8 },
					{ class: "Label", id: "score", left:290, width:140, top:24, height:27, text:"得分 0" },
					{ class: "Label", id: "chance", left:430, width:120, top:24, height:27, text:"机会 5" },
					{ class: "game.Button", id: "help", left:510, width:130, top:24, height:30, label:"说明", childsProperty:{ bk:{ src: "" },label:{ color: "#5186ff" } } },
					{ class: "game.Checkbox", id: "sound", left:630, width:56, top:8, childsProperty:{ icon:{ src: "ui/btn/喇叭" },checkImg:{ src: "ui/btn/喇叭check" } } },
				] },
			]
		},
	}
	ui.registerTemplates(Templates);
	export class Button extends ui.Control {
		static ClassName = "game.Button";
		static instance: game.Button;
		static Styles = {
			blue:{ childsProperty:{ bk:{ src: "ui/btn/blue" } } },
			purple:{ childsProperty:{ bk:{ src: "ui/btn/purple" } } },
			yellow:{ childsProperty:{ bk:{ src: "ui/btn/yellow" },label:{ gradient: { y0:0, y1:30, colors: ['#a54800', '#ce7300'] } } } }
		};
		static Properties: ui.PropDefine[] = [
			{ name: "label", type: "string" },
			{ name: "style", type: "string", customProperty: true }
		];
		static States = {
			normal: {  },
			down: {  }
		};
		private static _childs = [
			{ class: "Image", id: "bk", src:"ui/btn/blue", width:"100%", height:"100%" },
			{ class: "Label", id: "label", font:"30px", color:"#fff", width:"100%", height:30, y:"50%", align:1 }
		];
		constructor(parent: ui.Container, template?:ui.Template){
			super(parent);
			this._init(Button);
			if(template){
				this._createChilds(template.childs)
				template.init(this);
			}
			else
				this._createChilds(Button._childs);
			const n = this.namedChilds;
			this._initStates("normal", Button.States);
			this.bind("label", n.label, "text");
			this.width = 194;
			this.height = 70;
		}
		public label:string;
		public style:"blue"|"purple"|"yellow"|string;
		public get namedChilds(): { 
			bk: ui.Image,
			label: ui.Label }
		{ return <any>this._namedChilds; }
	}
	ui.initUIClass(Button, ui.Control);
	ui.addButtonEventHandler(Button, 0.8);
	
	export class Checkbox extends ui.Control {
		static ClassName = "game.Checkbox";
		static instance: game.Checkbox;
		static States = {
			check: { props: { childsProperty:{ checkImg:{ visible: true } } } },
			uncheck: { props: { childsProperty:{ checkImg:{ visible: false } } } }
		};
		private static _childs = [
			{ class: "Image", id: "icon", width:"100%", height:"100%" },
			{ class: "Image", id: "checkImg", width:"100%", height:"100%" }
		];
		constructor(parent: ui.Container, template?:ui.Template){
			super(parent);
			if(template){
				this._createChilds(template.childs)
				template.init(this);
			}
			else
				this._createChilds(Checkbox._childs);
			const n = this.namedChilds;
			this._initStates("uncheck", Checkbox.States);
		}
		public get namedChilds(): { 
			icon: ui.Image,
			checkImg: ui.Image }
		{ return <any>this._namedChilds; }
	}
	ui.initUIClass(Checkbox, ui.Control);
	ui.addCheckboxEventHandler(Checkbox, 0.8);
	
	export class templates extends ui.Container {
		static ClassName = "game.templates";
		static instance: game.templates;
		constructor(parent: ui.Container, template?:ui.Template){
			super(parent);
			if(template){
				this._createChilds(template.childs)
				template.init(this);
			}
		}
	}
	ui.initUIClass(templates, ui.Container);
	
	export class _GamePage extends ui.Container {
		static ClassName = "game.GamePage";
		static instance: game.GamePage;
		private static _childs = [
			{ class: "UIStage", id: "game", left:0, width:710, top:0, height:1280, _childs:[
				{ type: "Image", src:"image/bg" },
				{ type: "Image", id:"wall1", src:"game/wall2", anchorX:0.5, anchorY:0.5, x:150, y:1085 },
				{ type: "Image", id:"wall2", src:"game/wall2", anchorX:0.5, anchorY:0.5, x:560, y:1085 },
				{ type: "Image", id:"wall3", src:"game/wall", angle:90, x:60, y:570, anchorX:0.5, anchorY:0.5, width:1000 },
				{ type: "Image", id:"wall4", src:"game/wall", angle:90, x:650, y:570, anchorX:0.5, anchorY:0.5, width:1000 },
				{ type: "Image", id:"wall5", src:"game/wall", x:355, y:930, anchorX:0.5, anchorY:0.5, width:600, height:10, opacity:0.3 },
			] },
			{ class: "Control", id: "touch", width:"100%", height:"100%" },
			{ class: "Group", id: "intro", width:"100%", height:"100%", _childs:[
				{ class: "RectFill", color:"#000", opacity:0.3, width:"100%", height:"100%" },
				{ class: "Group", width:"100%", height:600, y:"50%", _childs:[
					{ class: "Image", src:"image/说明", x:"50%" },
					{ class: "game.Button", id: "ok2Btn", label:"确定", x:"50%", width:195, height:70, top:400 },
				] },
			] },
			{ class: "Group", id: "helpPage", width:"100%", height:"100%", visible:false, _childs:[
				{ class: "RectFill", color:"#000", opacity:0.3, width:"100%", height:"100%" },
				{ class: "Image", src:"image/活动规则", x:"50%", top:160 },
				{ class: "Group", width:"100%", top:900, bottom:0, _childs:[
					{ class: "game.Button", id: "okBtn", label:"已知晓", x:"50%", width:195, height:70, top:"30%" },
				] },
			] },
			{ class: "Group", id: "clock", width:66, height:66, x:611, y:127, visible:false, _childs:[
				{ class: "Image", src:"game/clock" },
				{ class: "Label", id: "time", font:"34px", color:"#fff", width:"100%", height:"100%", align:5 },
			] },
			{ class: "Image", id: "disk", src:"game/disk", visible:false },
			{ class: "Group", width:"100%", height:70, textStyle:"gameHead", _childs:[
				{ class: "RectFill", width:"100%", height:70, color:"#2c296e" },
				{ class: "RectFill", width:"100%", top:70, height:2, color:"#6854aa" },
				{ class: "Image", id: "avatar", left:28, width:50, top:13, height:50 },
				{ class: "Label", id: "name", left:87, width:200, top:24, height:27, format:8 },
				{ class: "Label", id: "score", left:290, width:140, top:24, height:27, text:"得分 0" },
				{ class: "Label", id: "chance", left:430, width:120, top:24, height:27, text:"机会 5" },
				{ class: "game.Button", id: "help", left:510, width:130, top:24, height:30, label:"说明", childsProperty:{ bk:{ src: "" },label:{ color: "#5186ff" } } },
				{ class: "game.Checkbox", id: "sound", left:630, width:56, top:8, childsProperty:{ icon:{ src: "ui/btn/喇叭" },checkImg:{ src: "ui/btn/喇叭check" } } },
			] }
		];
		constructor(parent: ui.Container, template?:ui.Template){
			super(parent);
			template = template || Templates.GamePage;
			if(template){
				this._createChilds(template.childs)
				template.init(this);
			}
			else
				this._createChilds(_GamePage._childs);
			const n = this.namedChilds;
			this.width = "100%";
			this.height = "100%";
		}
		public get namedChilds(): { 
			game: ui.UIStage,
			touch: ui.Control,
			intro: ui.Group,
			ok2Btn: game.Button,
			helpPage: ui.Group,
			okBtn: game.Button,
			clock: ui.Group,
			time: ui.Label,
			disk: ui.Image,
			avatar: ui.Image,
			name: ui.Label,
			score: ui.Label,
			chance: ui.Label,
			help: game.Button,
			sound: game.Checkbox }
		{ return <any>this._namedChilds; }
			
		
	}
	ez.initCall(() => { ui.initUIClass(game.GamePage, ui.Container) });
	
	export class MainFrame extends ui.Container {
		static ClassName = "game.MainFrame";
		static instance: game.MainFrame;
		private static _childs = [
			{ class: "RectFill", id: "bg", gradient:{ y1: 1280, colors:['#010036', '#4e004f'] }, width:"100%", height:"100%" },
			{ class: "Group", id: "frame", width:"100%", height:"100%", _childs:[
				{ class: "game.StartPage" },
			] }
		];
		constructor(parent: ui.Container, template?:ui.Template){
			super(parent);
			if(template){
				this._createChilds(template.childs)
				template.init(this);
			}
			else
				this._createChilds(MainFrame._childs);
			const n = this.namedChilds;
			this.width = "100%";
			this.height = "100%";
		}
		public get namedChilds(): { 
			bg: ui.RectFill,
			frame: ui.Group }
		{ return <any>this._namedChilds; }
	}
	ui.initUIClass(MainFrame, ui.Container);
	
	export class ResultPage extends ui.Container {
		static ClassName = "game.ResultPage";
		static instance: game.ResultPage;
		private static _childs = [
			{ class: "Image", src:"ui/img/奖杯", left:198, width:336, top:77, height:322 },
			{ class: "Label", text:"本局得分", x:"50%", align:1, width:119, top:462, height:29 },
			{ class: "Label", id: "score", text:"1000", x:"50%", strokeWidth:4, strokeColor:"#9b8ddd", width:280, top:395, height:58, font:"50px", gradient:{y1:50, colors:['#a995ff', '#8670f4']} },
			{ class: "Label", id: "info", x:"50%", width:283, top:530, height:32 },
			{ class: "Image", src:"ui/img/line", left:177, width:360, top:503, height:2 },
			{ class: "Image", src:"ui/img/line", left:177, width:360, top:579, height:2 },
			{ class: "game.Button", id: "rank", label:"查看排行榜", style:"blue", x:"50%", width:195, top:669, height:70 },
			{ class: "game.Button", id: "result", label:"生成成绩单", style:"blue", x:"50%", width:195, top:769, height:70 },
			{ class: "Group", top:840, bottom:0, width:"100%", _childs:[
				{ class: "game.Button", id: "replay", label:"再玩一次", style:"purple", x:"50%", width:195, y:"50%", height:70 },
			] },
			{ class: "game.RankPage", id: "rankPage", visible:false }
		];
		constructor(parent: ui.Container, template?:ui.Template){
			super(parent);
			if(template){
				this._createChilds(template.childs)
				template.init(this);
			}
			else
				this._createChilds(ResultPage._childs);
			const n = this.namedChilds;
			this.width = "100%";
			this.height = "100%";
			this.textStyle = "normalCenter";
		}
		public get namedChilds(): { 
			score: ui.Label,
			info: ui.Label,
			rank: game.Button,
			result: game.Button,
			replay: game.Button,
			rankPage: game.RankPage }
		{ return <any>this._namedChilds; }
	}
	ui.initUIClass(ResultPage, ui.Container);
	
	export class SharePage extends ui.Container {
		static ClassName = "game.SharePage";
		static instance: game.SharePage;
		private static _childs = [
			{ class: "RectFill", id: "bg", gradient:{ y1: 1280, colors:['#010036', '#4e004f'] }, width:"100%", height:"100%" },
			{ class: "Image", src:"share/logo", left:64, width:323, top:92, height:46 },
			{ class: "Image", src:"share/rect", left:81, width:522, top:300, height:231 },
			{ class: "Label", id: "name", left:114, width:383, top:337, height:37, text:"姓名：" },
			{ class: "Label", id: "score", left:114, width:383, top:387, height:37, text:"成绩：10000" },
			{ class: "Label", id: "info", left:114, width:383, top:439, height:37 },
			{ class: "Image", src:"share/text猪望仔大战蝙蝠侠", left:65, top:165 },
			{ class: "Label", font:"28px", color:"#bbadfb", lineHeight:48, format:2, left:68, width:585, top:575, height:137, text:"2020“创青春 交子杯”新网银行金融科技挑战赛\n47万奖金池，最高 10 万奖金等你来拿！\n是时候展现你真正的技术了！" },
			{ class: "Group", width:300, top:700, bottom:0, x:"50%", _childs:[
				{ class: "Group", height:332, width:300, y:"50%", _childs:[
					{ class: "Image", id: "share", src:"share/二维码", height:332, width:300 },
				] },
			] }
		];
		constructor(parent: ui.Container, template?:ui.Template){
			super(parent);
			if(template){
				this._createChilds(template.childs)
				template.init(this);
			}
			else
				this._createChilds(SharePage._childs);
			const n = this.namedChilds;
			this.width = "100%";
			this.height = "100%";
			this.textStyle = "normal";
			this.ownerBuffer = true;
		}
		public get namedChilds(): { 
			bg: ui.RectFill,
			name: ui.Label,
			score: ui.Label,
			info: ui.Label,
			share: ui.Image }
		{ return <any>this._namedChilds; }
	}
	ui.initUIClass(SharePage, ui.Container);
	
	export class Splash extends ui.Container {
		static ClassName = "game.Splash";
		static instance: game.Splash;
		private static _childs = [
			{ class: "Image", src:"logo", x:"50%", y:"50%" }
		];
		constructor(parent: ui.Container, template?:ui.Template){
			super(parent);
			if(template){
				this._createChilds(template.childs)
				template.init(this);
			}
			else
				this._createChilds(Splash._childs);
			this.width = "100%";
			this.height = "100%";
		}
	}
	ui.initUIClass(Splash, ui.Container);
	
	export class _RankItem extends ui.Container {
		static ClassName = "game.RankItem";
		static instance: game.RankItem;
		private static _childs = [
			{ class: "Label", id: "name", color:"#42464d", left:217, width:180, top:24, height:25, align:1, format:8 },
			{ class: "Label", id: "rank", color:"#42464d", left:20, width:50, top:23, height:17, visible:false, align:1 },
			{ class: "Label", id: "score", color:"#e04f00", left:409, width:112, top:24, height:25, align:1 },
			{ class: "Image", id: "avatar", left:127, width:74, top:7, height:74, effect:"mask", effectParams:{mask: 'mask'} },
			{ class: "RectFill", color:"#F0F0F0", left:0, width:530, top:86, height:2 },
			{ class: "Image", id: "rankIcon", left:27, width:44, top:15, height:48, src:"ui/icon/1st" }
		];
		constructor(parent: ui.Container, template?:ui.Template){
			super(parent);
			if(template){
				this._createChilds(template.childs)
				template.init(this);
			}
			else
				this._createChilds(_RankItem._childs);
			const n = this.namedChilds;
			this.width = 530;
			this.height = 88;
		}
		public get namedChilds(): { 
			name: ui.Label,
			rank: ui.Label,
			score: ui.Label,
			avatar: ui.Image,
			rankIcon: ui.Image }
		{ return <any>this._namedChilds; }
	}
	ez.initCall(() => { ui.initUIClass(game.RankItem, ui.Container) });
	
	export class RankPage extends ui.Container {
		static ClassName = "game.RankPage";
		static instance: game.RankPage;
		private static _childs = [
			{ class: "Image", src:"ui/img/rectbk", left:0, width:640, top:0, height:1300 },
			{ class: "Image", src:"ui/img/rectwh", left:45, width:540, top:219, height:806 },
			{ class: "game.Button", id: "closeRank", left:566, width:39, top:200, height:38, childsProperty:{ bk:{ src: "ui/btn/close" } } },
			{ class: "RectFill", color:"#F2F2F4", left:45, width:540, top:319, height:78 },
			{ class: "Label", text:"排行", left:74, width:58, top:344, height:28 },
			{ class: "Label", text:"头像", left:190, width:58, top:344, height:28 },
			{ class: "Label", text:"昵称", left:334, width:58, top:344, height:28 },
			{ class: "Label", text:"成绩", left:478, width:58, top:344, height:28 },
			{ class: "Label", font:"32px", text:"排行榜TOP100", color:"#494b59", left:246, width:220, top:253, height:34 },
			{ class: "Image", src:"ui/icon/cup", left:187, width:44, top:246, height:49 },
			{ class: "ScrollView", left:50, width:532, top:402, height:617, scrollMode:2, _childs:[
				{ class: "ListView", id: "rankList", width:532, itemClass:"game.RankItem", culling:true },
			] }
		];
		constructor(parent: ui.Container, template?:ui.Template){
			super(parent);
			if(template){
				this._createChilds(template.childs)
				template.init(this);
			}
			else
				this._createChilds(RankPage._childs);
			const n = this.namedChilds;
			this.width = 640;
			this.height = 1300;
			this.left = 33;
			this.top = 0;
			this.textStyle = "rankPage";
		}
		public get namedChilds(): { 
			closeRank: game.Button,
			rankList: ui.ListView }
		{ return <any>this._namedChilds; }
	}
	ui.initUIClass(RankPage, ui.Container);
	
	export class _StartPage extends ui.Container {
		static ClassName = "game.StartPage";
		static instance: game.StartPage;
		private static _childs = [
			{ class: "Image", src:"image/bg" },
			{ class: "Group", width:"100%", height:"100%", id: "mainPage", _childs:[
				{ class: "UIStage", id: "stage", width:"100%", height:1280, y:"50%", _childs:[
					{ type: "Image", id:"蝙蝠侠", src:"start/蝙蝠侠", x:515, y:812, anchorX:0.5, anchorY:0.5 },
					{ type: "Image", id:"猪", src:"start/猪", x:38, y:112 },
					{ type: "Image", id:"txt蝙蝠侠", src:"start/txt蝙蝠侠", x:132, y:538 },
					{ type: "Image", id:"txt猪", src:"start/txt猪望仔", x:103, y:402 },
				] },
				{ class: "Image", src:"start/logo", bottom:"10%", x:"50%", width:237, height:34 },
				{ class: "game.Button", id: "help", bottom:"15%", left:80, width:218, height:85, opacity:0, childsProperty:{ bk:{ src: "start/活动规则" } } },
				{ class: "game.Button", id: "start", bottom:"15%", right:80, width:218, height:85, opacity:0, childsProperty:{ bk:{ src: "start/开始游戏" } } },
				{ class: "game.Button", id: "rank", style:"yellow", label:"排行榜", left:44, width:146, top:92, height:54, opacity:0 },
			] },
			{ class: "game.Checkbox", id: "sound", left:570, width:56, top:92, height:59, childsProperty:{ icon:{ src: "ui/btn/喇叭" },checkImg:{ src: "ui/btn/喇叭check" } } },
			{ class: "Group", id: "helpPage", width:"100%", height:"100%", visible:false, _childs:[
				{ class: "Image", src:"image/活动规则", x:"50%", top:160 },
				{ class: "Group", width:"100%", top:900, bottom:0, _childs:[
					{ class: "game.Button", id: "okBtn", label:"已知晓", x:"50%", width:195, height:70, top:"30%" },
				] },
			] },
			{ class: "game.RankPage", id: "rankPage", visible:false }
		];
		constructor(parent: ui.Container, template?:ui.Template){
			super(parent);
			if(template){
				this._createChilds(template.childs)
				template.init(this);
			}
			else
				this._createChilds(_StartPage._childs);
			const n = this.namedChilds;
			this.width = "100%";
			this.height = "100%";
		}
		public get namedChilds(): { 
			mainPage: ui.Group,
			stage: ui.UIStage,
			help: game.Button,
			start: game.Button,
			rank: game.Button,
			sound: game.Checkbox,
			helpPage: ui.Group,
			okBtn: game.Button,
			rankPage: game.RankPage }
		{ return <any>this._namedChilds; }
	}
	ez.initCall(() => { ui.initUIClass(game.StartPage, ui.Container) });
	
}
