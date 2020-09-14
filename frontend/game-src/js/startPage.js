var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var game;
(function (game) {
    function soundEnable(enable) {
        var val = 0;
        var sound = "0";
        if (enable)
            val = 1, sound = "1";
        ez.setBGMVolume(val);
        ez.setSFXVolume(val);
        localStorage.setItem("sound", sound);
    }
    game.soundEnable = soundEnable;
    game.ranks = [];
    function getRank(rankPage) {
        var startTime = Date.now();
        ajax("https://xwfintech.qingke.io/5f01dfe0d676280036a2e1ff/admin/openapi/pinball/list?pageSize=100", function (e, r) {
            if (e) {
                var rank = 1;
                game.ranks = r.rows.map(t => t.score || 0);
                rankPage.namedChilds.rankList.items = r.rows.map(t => {
                    return { rank: rank++, name: t.nickname, avatar: t.avatar, score: t.score || 0 };
                });
            }
        });
    }
    game.getRank = getRank;
    class StartPage extends game._StartPage {
        constructor(parent) {
            super(parent);
            const n = this.namedChilds;
            var ctx = this;
            var inStartPage = true;
            var sound = localStorage.getItem("sound");
            if (sound == null)
                sound == "1";
            n.sound.state = sound == "1" ? "check" : "uncheck";
            soundEnable(sound == "1");
            getRank(n.rankPage);
            ez.playMusic(0, "sound/bgm", true);
            function showAnimations() {
                return __awaiter(this, void 0, void 0, function* () {
                    let index = 0;
                    yield ez.delay(1600);
                    while (true) {
                        if (!inStartPage)
                            break;
                        let pigPosX = Math.floor(70 + Math.random() * 570);
                        let pigPosY = Math.floor(70 + Math.random() * 700);
                        let bossPosX = Math.floor(70 + Math.random() * 570);
                        let bossPosY = Math.floor(70 + Math.random() * 700);
                        if (index % 2 == 0) {
                            bossPosX = pigPosX;
                            bossPosY = bossPosY;
                        }
                        let pig = n.stage.stage.find("猪");
                        let boss = n.stage.stage.find("蝙蝠侠");
                        new ez.Tween(pig).move({ x: [pig.x, pigPosX], y: [pig.y, pigPosY], scale: [0.5, 0.5] }, 1000).config({ loop: false }).play();
                        new ez.Tween(boss).move({ x: [boss.x, bossPosX], y: [boss.y, bossPosY], scale: [0.5, 0.5] }, 1000).config({ loop: false }).play();
                        index++;
                        yield ez.delay(1000);
                    }
                });
            }
            new ez.Tween(n.stage.stage.find("txt猪")).move({ y: [-100, 402] }, 500).config({ loop: false }).play();
            n.stage.stage.find("txt蝙蝠侠").y = 1380;
            new ez.Tween(n.stage.stage.find("txt蝙蝠侠")).wait(500).move({ y: [1280, 538] }, 500).config({ loop: false }).play();
            new ez.Tween(n.start).wait(1000).move({ opacity: [0, 1] }, 2000).config({ loop: false }).play();
            new ez.Tween(n.help).wait(1000).move({ opacity: [0, 1] }, 2000).config({ loop: false }).play();
            new ez.Tween(n.rank).wait(1500).move({ opacity: [0, 1] }, 2000).config({ loop: false }).play();
            new ez.Tween(n.stage.stage.find("猪")).move({ x: [28, 28], y: [-100, 302], scale: [1, 0.5] }, 500).config({ loop: false }).play();
            n.stage.stage.find("蝙蝠侠").y = 1380;
            new ez.Tween(n.stage.stage.find("蝙蝠侠")).wait(500).move({ x: [570, 570], y: [1280, 670], scale: [1, 0.5] }, 500).config({ loop: false }).play();
            showAnimations();
            ez.effect.highlight(n.start.namedChilds.bk, new ez.Color(128, 100, 50), 0.1, 10, 1000, 2000, 0, [-0.3, 1.2]);
            ez.setTimer(1000, function () {
                if (ctx.disposed)
                    return;
                ez.effect.highlight(n.help.namedChilds.bk, new ez.Color(50, 100, 128), 0.1, 10, 1000, 2000, 0, [-0.3, 1.2]);
            });
            ez.effect.highlight(n.rank.namedChilds.label, new ez.Color(128, 100, 50), 0.3, 0, 1000, 1500, 0, [-0.3, 1]);
            this.addEventHandler("click", function (e) {
                switch (e.sender.id) {
                    case "help":
                        n.helpPage.visible = true;
                        n.mainPage.visible = false;
                        break;
                    case "okBtn":
                        n.helpPage.visible = false;
                        n.mainPage.visible = true;
                        break;
                    case "rank":
                        n.rankPage.visible = true;
                        break;
                    case "closeRank":
                        n.rankPage.visible = false;
                        break;
                    case "start":
                        inStartPage = false;
                        ctx.parent.createChild(game.GamePage);
                        ctx.dispose();
                        window.parent.postMessage({ msg: "gamestart" }, "*");
                        break;
                    case "sound":
                        var state = e.sender.state;
                        soundEnable(state == "check");
                        break;
                }
            });
        }
    }
    game.StartPage = StartPage;
    class RankItem extends game._RankItem {
        constructor(parent) {
            super(parent);
        }
        set dataSource(data) {
            var n = this.namedChilds;
            if (data.rank <= 3) {
                var ranks = ["", "1st", "2nd", "3rd"];
                n.rankIcon.src = "ui/icon/" + ranks[data.rank];
            }
            else {
                n.rankIcon.visible = false;
                n.rank.visible = true;
                n.rank.text = "" + data.rank;
            }
            n.name.text = data.name;
            n.avatar.src = data.avatar;
            n.score.text = data.score + "分";
        }
    }
    game.RankItem = RankItem;
})(game || (game = {}));
//# sourceMappingURL=startPage.js.map