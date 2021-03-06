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
    let EnemyType;
    (function (EnemyType) {
        EnemyType[EnemyType["Hole"] = 0] = "Hole";
        EnemyType[EnemyType["Mask"] = 1] = "Mask";
        EnemyType[EnemyType["Boom"] = 2] = "Boom";
        EnemyType[EnemyType["Batman"] = 3] = "Batman";
        EnemyType[EnemyType["BatmanKing"] = 4] = "BatmanKing";
        EnemyType[EnemyType["Logo"] = 5] = "Logo";
    })(EnemyType || (EnemyType = {}));
    const PlayerRadius = 20;
    var player;
    var bullets = [];
    var launchResovle = null;
    var score = 0;
    var endLine = 930;
    var horizonGrid = 7;
    var verticalGrid = 10;
    var gridSide = 80;
    var confirmStart = false;
    var enemiesData = [];
    var gridMap = [];
    for (let i = 0; i < horizonGrid * verticalGrid; i++) {
        gridMap[i] = null;
    }
    var enemiesGrid_Round1 = [[9, EnemyType.Batman], [11, EnemyType.BatmanKing], [13, EnemyType.Batman],
        [17, EnemyType.Batman], [23, EnemyType.Batman], [26, EnemyType.Batman]];
    var enemiesGrid_Round2 = [[1, EnemyType.Batman], [3, EnemyType.Batman], [7, EnemyType.Batman],
        [9, EnemyType.Batman], [11, EnemyType.BatmanKing], [13, EnemyType.Batman],
        [17, EnemyType.Batman], [23, EnemyType.Batman], [26, EnemyType.Batman]];
    var enemiesGrid_Round3 = [[1, EnemyType.Batman], [3, EnemyType.Batman], [7, EnemyType.BatmanKing],
        [9, EnemyType.Batman], [13, EnemyType.Batman], [17, EnemyType.Batman],
        [21, EnemyType.Batman], [23, EnemyType.Batman], [26, EnemyType.Batman],
        [29, EnemyType.Batman]];
    var enemiesGrid_Round4 = [[1, EnemyType.Batman], [3, EnemyType.Batman], [4, EnemyType.BatmanKing],
        [9, EnemyType.Batman], [11, EnemyType.Batman], [13, EnemyType.Batman],
        [17, EnemyType.Batman], [23, EnemyType.Batman], [26, EnemyType.Batman],
        [29, EnemyType.Batman], [30, EnemyType.Batman]];
    var enemiesGrid_Round5 = [[1, EnemyType.Batman], [3, EnemyType.Batman], [7, EnemyType.Batman],
        [9, EnemyType.Batman], [11, EnemyType.BatmanKing], [13, EnemyType.Batman],
        [17, EnemyType.Batman], [23, EnemyType.Batman], [26, EnemyType.Batman],
        [29, EnemyType.Batman], [30, EnemyType.Batman], [32, EnemyType.Batman],];
    var walls = {
        left: { x: 60, y: 570, data: { w: 30, h: 1280 } },
        right: { x: 650, y: 570, data: { w: 30, h: 1280 } },
        up: { x: 355, y: 55, data: { w: 710, h: 30 } },
    };
    function createEnemiesData(gridInfo) {
        let enemiesInfo = [];
        for (let i = 0; i < gridInfo.length; i++) {
            let gridIdx = gridInfo[i][0];
            let w = gridIdx % horizonGrid;
            let h = Math.floor(gridIdx / horizonGrid);
            let enemy = {};
            enemy.type = gridInfo[i][1];
            enemy.idx = gridIdx;
            if (gridInfo[i][1] == EnemyType.BatmanKing) {
                enemy.life = 10;
                enemy.x = 75 + w * gridSide + gridSide;
                enemy.y = 70 + h * gridSide + gridSide;
                enemy.w = gridSide * 2;
                enemy.h = gridSide * 2;
            }
            else {
                enemy.life = 5;
                enemy.x = 75 + w * 80 + gridSide / 2;
                enemy.y = 70 + h * 80 + gridSide / 2;
                enemy.w = gridSide;
                enemy.h = gridSide;
            }
            enemiesInfo[i] = enemy;
        }
        return enemiesInfo;
    }
    function calPos2gridMapIdx(x, y) {
        let w = x - 75;
        let h = y - 70;
        w = Math.floor(w / gridSide);
        h = Math.floor(h / gridSide);
        return h * horizonGrid + w;
    }
    function get9GridIndexes(idx) {
        let indexList = [];
        let left = idx % horizonGrid > 0;
        let right = idx % horizonGrid < horizonGrid - 1;
        let up = Math.floor(idx / horizonGrid) > 0;
        let down = Math.floor(idx / horizonGrid) < verticalGrid - 1;
        indexList.push(idx);
        if (left)
            indexList.push(idx - 1);
        if (right)
            indexList.push(idx + 1);
        if (up)
            indexList.push(idx - horizonGrid);
        if (down)
            indexList.push(idx + horizonGrid);
        if (left && up)
            indexList.push(idx - 1 - horizonGrid);
        if (left && down)
            indexList.push(idx - 1 - horizonGrid);
        if (right && up)
            indexList.push(idx + 1 + horizonGrid);
        if (right && down)
            indexList.push(idx + 1 + horizonGrid);
        return indexList;
    }
    function createPlayer(stage) {
        var sprite = new ez.SubStageSprite(stage);
        var p1 = new ez.ImageSprite(sprite);
        var p2 = new ez.ImageSprite(sprite);
        p1.src = "game/playerlight";
        p2.src = "game/player";
        p1.anchorX = 0.5;
        p2.anchorX = 0.5;
        p1.anchorY = 0.66;
        p1.scale = 0.9;
        p2.anchorY = 0.7;
        sprite.scale = 1.4;
        new ez.Tween(p1).move({ opacity: [0.5, 1] }, 1000).to({ opacity: 0.5 }, 1000).config({ loop: true }).play();
        return sprite;
    }
    function createEnemyBullet(stage) {
        var sprite = new ez.SubStageSprite(stage);
        var p1 = new ez.ImageSprite(sprite);
        var p2 = new ez.ImageSprite(sprite);
        p1.src = "game/clock";
        p2.src = "game/boom";
        p1.anchorX = 0.5;
        p1.anchorY = 0.66;
        p1.scale = 0.9;
        p2.anchorX = 0.28;
        p2.anchorY = 0.72;
        sprite.scale = 0.9;
        new ez.Tween(p1).move({ opacity: [0.5, 1] }, 1000).to({ opacity: 0.5 }, 1000).config({ loop: true }).play();
        return sprite;
    }
    function createBullet(stage) {
        var sprite = new ez.SubStageSprite(stage);
        var p1 = new ez.ImageSprite(sprite);
        var p2 = new ez.ImageSprite(sprite);
        p1.src = "game/clock";
        p2.src = "game/boom";
        p1.anchorX = 0.5;
        p1.anchorY = 0.66;
        p1.scale = 0.7;
        p2.anchorX = 0.28;
        p2.anchorY = 0.72;
        sprite.scale = 0.7;
        new ez.Tween(p1).move({ opacity: [0.5, 1] }, 1000).to({ opacity: 0.5 }, 1000).config({ loop: true }).play();
        return sprite;
    }
    function createEnemy(e, stage) {
        var enemySub = new ez.SubStageSprite(stage);
        var back = new ez.ImageSprite(enemySub);
        var s = new ez.ImageSprite(enemySub);
        let ready = new ez.LabelSprite(enemySub);
        ready.align = ez.AlignMode.Center;
        ready.anchorX = 0.5;
        ready.anchorY = 0.5;
        ready.width = 200;
        ready.height = 30;
        ready.y = -30;
        ready.font = "Arial 30px";
        ready.text = "准备攻击";
        ready.gradient = { y1: 30, colors: ["#f80", "#8af"] };
        ready.scale = 0.5;
        ready.visible = false;
        back.src = "share/rect";
        back.anchorX = 0.5;
        back.anchorY = 0.5;
        back.scaleX = 1.2;
        back.scaleY = 1.3;
        s.anchorX = 0.5;
        s.anchorY = 0.6;
        s.scaleX = 1.3;
        s.scaleY = 1.3;
        enemySub.x = e.x;
        enemySub.y = e.y;
        let data = {};
        enemySub["data"] = data;
        data.type = e.type;
        data.life = e.life;
        data.w = e.w;
        data.h = e.h;
        data.idx = e.idx;
        data.ready = ready;
        gridMap[e.idx] = enemySub;
        switch (e.type) {
            case EnemyType.Hole:
                s.src = "game/hole";
                data.radius = 60;
                break;
            case EnemyType.Mask:
                s.src = "game/mask";
                data.score = 30;
                data.radius = 20;
                ez.setTimer(Math.random() * 1000, () => ez.Tween.add(s).move({ scale: [0.9, 1.1] }, 1000).to({ scale: 0.9 }, 1000).config({ loop: true }).play());
                break;
            case EnemyType.Boom:
                s.src = "game/boom";
                data.score = -10;
                data.radius = 20;
                break;
            case EnemyType.Logo:
                s.src = "game/logo";
                data.score = 20;
                data.radius = 13;
                break;
            case EnemyType.Batman:
                s.src = "game/batman";
                s.scale = 1;
                data.score = 10;
                data.radius = 13;
                ez.setTimer(Math.random() * 1000, () => ez.Tween.add(s).move({ scale: [1, 1.2] }, 2000).to({ scale: 1 }, 2000).config({ loop: true }).play());
                ez.setTimer(Math.random() * 1000, () => ez.Tween.add(s).move({ y: [s.y, s.y + 5 * Math.random() + 5] }, 3000).to({ y: s.y }, 3000).config({ loop: true }).play());
                break;
            case EnemyType.BatmanKing:
                s.src = "game/batman";
                s.scale = 2;
                back.scale = 2;
                data.score = 100;
                data.radius = 36;
                ready.y = -60;
                ready.scale = 1;
                ready.visible = true;
                gridMap[e.idx + 1] = enemySub;
                gridMap[e.idx + horizonGrid] = enemySub;
                gridMap[e.idx + horizonGrid + 1] = enemySub;
                ez.Tween.add(s).move({ scale: [1.8, 2.1] }, 2000).to({ scale: 1.8 }, 1000).config({ loop: true }).play();
                break;
        }
        return enemySub;
    }
    function clampNumber(num, a, b) {
        if (num < a)
            return a;
        if (num > b)
            return b;
        return num;
    }
    function isInArray(list, obj) {
        for (let i = 0; i < list.length; i++) {
            if (obj == list[i])
                return true;
        }
        return false;
    }
    function checkCollision(src, tar, dx, dy) {
        let data = tar.data;
        let disX = src.x - tar.x;
        let disY = src.y - tar.y;
        let horizon = false;
        if (Math.abs(disX) > data.w / 2 || Math.abs(disY) > data.h / 2) {
            disX = clampNumber(disX, -data.w / 2, data.w / 2);
            disY = clampNumber(disY, -data.h / 2, data.h / 2);
            let hitX = src.x - (tar.x + disX);
            let hitY = src.y - (tar.y + disY);
            if (hitX * hitX + hitY * hitY < PlayerRadius * PlayerRadius) {
                horizon = Math.abs(disX) >= data.w / 2;
                if (horizon && Math.sign(disX) == Math.sign(dx)) {
                    horizon = false;
                }
                else if (!horizon && Math.sign(disY) == Math.sign(dy)) {
                    horizon = true;
                }
                return [[tar.x + disX, tar.y + disY], horizon];
            }
            return null;
        }
        else {
            let xper = Math.abs(disX) / data.w / 2;
            let yper = Math.abs(disY) / data.h / 2;
            if (xper > yper) {
                if (Math.sign(disX) == Math.sign(dx))
                    return [[tar.x + Math.sign(disX) * data.w / 2, tar.y + disY / xper], false];
                return [[tar.x + Math.sign(disX) * data.w / 2, tar.y + disY / xper], true];
            }
            else {
                if (Math.sign(disY) == Math.sign(dy))
                    return [[tar.x + disX / yper, tar.y + Math.sign(disY) * data.h / 2], true];
                return [[tar.x + disX / yper, tar.y + Math.sign(disY) * data.h / 2], false];
            }
        }
    }
    function shulffle(arr) {
        var seed = Date.now();
        function rand(max) {
            seed = (seed * 22695477 + 1) & 0x7ffffff;
            return (seed >> 16) % (max + 1);
        }
        for (var i = 0; i < arr.length; i++) {
            var idx = rand(arr.length - 1);
            var t = arr[i];
            arr[i] = arr[idx];
            arr[idx] = t;
        }
    }
    function addScore(s, n) {
        return __awaiter(this, void 0, void 0, function* () {
            var s1 = score;
            score += s;
            var d = (s / 10) | 0;
            for (let i = 0; i < 10; i++) {
                s1 += d;
                n.score.text = `得分 ${s1}`;
                yield ez.delay(30);
            }
            n.score.text = `得分 ${score}`;
        });
    }
    function startGame(stage, n, gameOver) {
        return __awaiter(this, void 0, void 0, function* () {
            function showClock() {
                return __awaiter(this, void 0, void 0, function* () {
                    n.clock.visible = true;
                    var time = 20;
                    n.time.text = `${time}s`;
                    while (time > 0 && !allReset) {
                        n.time.text = `${time}s`;
                        yield ez.delay(1000);
                        time--;
                    }
                    n.clock.visible = false;
                    getMask = false;
                    leftTime = false;
                });
            }
            function resetBullets() {
                for (let i = 0; i < bulletNum; i++) {
                    bullets[i].x = startPos[0];
                    bullets[i].y = startPos[1];
                    bulletDPos[i] = [0, 0];
                    allReset = true;
                }
            }
            function resetBulletByIdx(i) {
                bullets[i].x = startPos[0];
                bullets[i].y = startPos[1];
                bulletDPos[i] = [0, 0];
                resets[i] = 1;
                let resetCount = 0;
                for (let n = 0; n < bulletNum; n++)
                    resetCount += resets[n];
                if (resetCount >= bulletNum)
                    allReset = true;
            }
            function findBoss() {
                for (let i = 0; i < gridMap.length; i++) {
                    let findEnemy = gridMap[i];
                    if (findEnemy && findEnemy.data.type == EnemyType.BatmanKing) {
                        return findEnemy;
                    }
                }
                return null;
            }
            function findEnemies(count) {
                let tempEnemies = [];
                let selectedEnemies = [];
                for (let i = 0; i < gridMap.length; i++) {
                    if (gridMap[i] && !isInArray(selectedEnemies, gridMap[i]) && gridMap[i].data.type != EnemyType.BatmanKing)
                        tempEnemies.push([i, gridMap[i]]);
                }
                for (let i = 0; i < count; i++) {
                    if (tempEnemies.length == 0)
                        return selectedEnemies;
                    let index = Math.floor((Math.random() * tempEnemies.length));
                    selectedEnemies.push(tempEnemies[index]);
                    tempEnemies.splice(index, 1);
                }
                return selectedEnemies;
            }
            function showSubHp(subHp) {
                let s = new ez.LabelSprite(stage);
                s.align = ez.AlignMode.Center;
                s.anchorX = 0.5;
                s.anchorY = 1;
                s.width = 200;
                s.height = 30;
                s.x = player.x;
                s.font = "Arial 30px";
                s.text = "-" + subHp;
                s.gradient = { y1: 30, colors: ["#8ff", "#8af"] };
                ez.Tween.add(s).move({ y: [player.y, player.y - 30], opacity: [0.5, 1] }, 300, ez.Ease.bounceOut).move({ opacity: [1, 0] }, 2000).disposeTarget().play();
            }
            function showRound(round) {
                let s = new ez.LabelSprite(stage);
                s.align = ez.AlignMode.Center;
                s.anchorX = 0.5;
                s.anchorY = 1;
                s.width = 200;
                s.height = 30;
                s.x = player.x;
                s.font = "Arial 60px";
                s.text = "第" + round + "回合";
                s.gradient = { y1: 60, colors: ["#ff8", "#fa8"] };
                ez.Tween.add(s).move({ y: [player.y - 200, player.y - 260], opacity: [0.5, 1] }, 300, ez.Ease.bounceOut).move({ opacity: [1, 0] }, 2000).disposeTarget().play();
            }
            function showHit(x, y, reflectAngle) {
                let hitSprite = new ez.SubStageSprite(stage);
                let hitIcon = new ez.ImageSprite(hitSprite);
                hitIcon.src = "ui/btn/喇叭check";
                hitIcon.anchorX = 0.5;
                hitIcon.anchorY = 0.5;
                hitIcon.scale = 1;
                hitSprite.scale = 1;
                hitSprite.x = x;
                hitSprite.y = y;
                hitSprite.width = 50;
                hitSprite.height = 20;
                hitSprite.angle = reflectAngle;
                ez.Tween.add(hitSprite).move({ scale: [1, 2], opacity: [0.5, 1] }, 300, ez.Ease.bounceOut).move({ scale: [2, 1], opacity: [1, 0] }, 500).disposeTarget().play();
            }
            function killedAllEnmeies() {
                let killedAll = true;
                for (let i = 0; i < gridMap.length; i++) {
                    if (gridMap[i])
                        killedAll = false;
                }
                return killedAll;
            }
            function shakeAll(shakeBoss) {
                let shakeDis = 5;
                new ez.Tween(player).move({ x: [player.x, player.x - shakeDis], y: [player.y, player.y + shakeDis], opacity: [1, 0.7] }, 50, ez.Ease.bounceOut).to({ x: player.x, y: player.y, opacity: 1 }, 50).play();
                for (let i = 0; i < gridMap.length; i++) {
                    if (!gridMap[i] || (!shakeBoss && gridMap[i].data.type == EnemyType.BatmanKing))
                        continue;
                    let enemy = gridMap[i];
                    new ez.Tween(enemy).move({ x: [enemy.x, enemy.x - shakeDis], y: [enemy.y, enemy.y + shakeDis], opacity: [1, 0.7] }, 50, ez.Ease.bounceOut).to({ x: enemy.x, y: enemy.y, opacity: 1 }, 50).play();
                }
                for (let j = 1; j < 6; j++) {
                    let wall = n.game.find("wall" + j);
                    new ez.Tween(wall).move({ x: [wall.x, wall.x - shakeDis], y: [wall.y, wall.y + shakeDis], opacity: [1, 0.7] }, 50, ez.Ease.bounceOut).to({ x: wall.x, y: wall.y, opacity: 1 }, 50).play();
                }
            }
            var getMask = false;
            var leftTime = true;
            var allReset = false;
            var resets = [];
            enemiesData = createEnemiesData(enemiesGrid_Round1);
            for (let i = 0; i < enemiesData.length; i++) {
                createEnemy(enemiesData[i], stage);
            }
            var startPos = [385, 1010];
            player = createPlayer(stage);
            player.x = startPos[0] - 30;
            player.y = startPos[1] + 10;
            var bulletNum = 5;
            var chance = 100;
            n.chance.text = `体力 ${chance}`;
            var bulletDPos = [];
            var enemyBullets = [];
            for (let i = 0; i < 5; i++) {
                enemyBullets[i] = createEnemyBullet(stage);
                enemyBullets[i].visible = false;
            }
            for (let i = 0; i < bulletNum; i++) {
                bullets[i] = createBullet(stage);
                bullets[i].x = startPos[0];
                bullets[i].y = startPos[1];
                bulletDPos[i] = [0, 0];
                resets[i] = 0;
            }
            var circle = new ez.ImageSprite(stage);
            circle.src = "game/circle";
            circle.anchorX = circle.anchorY = 0.5;
            circle.x = startPos[0];
            circle.y = startPos[1];
            new ez.Tween(circle).move({ scale: [0.4, 1.2], opacity: [0.1, 0.6] }, 800).config({ loop: true }).play();
            var nextRound = false;
            var curRound = 1;
            showRound(curRound);
            function mainLoop() {
                return __awaiter(this, void 0, void 0, function* () {
                    nextRound = false;
                    while (true) {
                        let launch = new Promise((r) => {
                            launchResovle = r;
                        });
                        let attackNum = Math.floor(1 + Math.random() * 3);
                        let attackEnemies = findEnemies(attackNum);
                        for (let i = 0; i < attackEnemies.length; i++) {
                            let readyEnemy = attackEnemies[i][1];
                            if (readyEnemy)
                                readyEnemy.data.ready.visible = true;
                        }
                        let r = yield launch;
                        if (circle) {
                            circle.dispose();
                            circle = null;
                        }
                        leftTime = true;
                        allReset = false;
                        showClock();
                        n.chance.text = `体力 ${chance}`;
                        launchResovle = null;
                        let frameIdx = 0;
                        let hitMaxes = [];
                        let hitEnemies = [];
                        let hasHits = [];
                        let startLine = [];
                        for (let i = 0; i < bulletNum; i++) {
                            bulletDPos[i][0] = r[0] * 0.25;
                            bulletDPos[i][1] = r[1] * 0.25;
                            hitMaxes[i] = 20;
                            hitEnemies[i] = null;
                            hasHits[i] = false;
                            startLine[i] = true;
                            resets[i] = 0;
                        }
                        while (true) {
                            frameIdx++;
                            let allHits = 0;
                            for (let i = 0; i < bulletNum; i++)
                                allHits += hitMaxes[i];
                            if (allHits <= 0) {
                                resetBullets();
                                break;
                            }
                            if (!leftTime || allReset) {
                                resetBullets();
                                n.clock.visible = false;
                                break;
                            }
                            for (let bulletIdx = 0; bulletIdx < bulletNum; bulletIdx++) {
                                if (frameIdx < bulletIdx * 10) {
                                    continue;
                                }
                                let bullet = bullets[bulletIdx];
                                bullet.x += bulletDPos[bulletIdx][0];
                                bullet.y += bulletDPos[bulletIdx][1];
                                hasHits[bulletIdx] = false;
                                if (bullet.x < 0 || bullet.x > 710 || bullet.y < 0) {
                                    resetBulletByIdx(bulletIdx);
                                    continue;
                                }
                                if (hitMaxes[bulletIdx] <= 0 || (frameIdx > bulletIdx * 30 && bullet.y > startPos[1] + 5)) {
                                    resetBulletByIdx(bulletIdx);
                                    continue;
                                }
                                let enemiesIndexes = get9GridIndexes(calPos2gridMapIdx(bullet.x, bullet.y));
                                for (let i = 0; i < enemiesIndexes.length; i++) {
                                    let e = gridMap[enemiesIndexes[i]];
                                    if (e == null)
                                        continue;
                                    let hitInfo = checkCollision(bullet, e, bulletDPos[bulletIdx][0], bulletDPos[bulletIdx][1]);
                                    if (hitInfo == null)
                                        continue;
                                    let hitPos = hitInfo[0];
                                    let horizon = hitInfo[1];
                                    let data = e.data;
                                    hasHits[bulletIdx] = true;
                                    hitMaxes[bulletIdx]--;
                                    if (hitEnemies[bulletIdx] == e) {
                                        continue;
                                    }
                                    else {
                                        hitEnemies[bulletIdx] = e;
                                    }
                                    let score = data.score;
                                    let s = new ez.LabelSprite(stage);
                                    s.align = ez.AlignMode.Center;
                                    s.anchorX = 0.5;
                                    s.anchorY = 1;
                                    s.width = 200;
                                    s.height = 30;
                                    s.x = e.x;
                                    s.font = "Arial 30px";
                                    if (data.type == EnemyType.BatmanKing)
                                        score = 30;
                                    if (score > 0) {
                                        s.text = "+" + score;
                                        s.gradient = { y1: 30, colors: ["#ff8", "#fa8"] };
                                    }
                                    else {
                                        s.text = "" + score;
                                        s.gradient = { y1: 30, colors: ["#8ff", "#8af"] };
                                    }
                                    ez.Tween.add(s).move({ y: [e.y, e.y - 30], opacity: [0.5, 1] }, 300, ez.Ease.bounceOut).move({ opacity: [1, 0] }, 2000).disposeTarget().play();
                                    addScore(score, n);
                                    ez.playSFX(score > 0 ? "sound/add" : "sound/lose");
                                    data.life--;
                                    if (data.life <= 0) {
                                        let isKing = data.type == EnemyType.BatmanKing;
                                        e.dispose();
                                        gridMap[data.idx] = null;
                                        if (isKing) {
                                            gridMap[data.idx + 1] = null;
                                            gridMap[data.idx + horizonGrid] = null;
                                            gridMap[data.idx + horizonGrid + 1] = null;
                                        }
                                        for (let i = 0; i < attackEnemies.length; i++) {
                                            if (data.idx == attackEnemies[i][0])
                                                attackEnemies[i][1] = null;
                                        }
                                    }
                                    let reflectAngle = 0;
                                    if (horizon) {
                                        bulletDPos[bulletIdx][0] = -bulletDPos[bulletIdx][0];
                                        if (bulletDPos[bulletIdx][0] > 0)
                                            reflectAngle = 0;
                                        else
                                            reflectAngle = 180;
                                    }
                                    else {
                                        bulletDPos[bulletIdx][1] = -bulletDPos[bulletIdx][1];
                                        if (bulletDPos[bulletIdx][1] > 0)
                                            reflectAngle = 90;
                                        else
                                            reflectAngle = 270;
                                    }
                                    showHit(hitPos[0], hitPos[1], reflectAngle);
                                    break;
                                }
                                if (!hasHits[bulletIdx])
                                    hitEnemies[bulletIdx] = null;
                                if (startLine[bulletIdx] && bullet.y < endLine - PlayerRadius * 5)
                                    startLine[bulletIdx] = false;
                                if (!startLine[bulletIdx] && bullet.y >= endLine) {
                                    resetBulletByIdx(bulletIdx);
                                    continue;
                                }
                                let posIndex = calPos2gridMapIdx(bullet.x, bullet.y);
                                let checkWalls = [];
                                if (posIndex % horizonGrid == 0 || bullet.x < walls.left.x + walls.left.data.w / 2)
                                    checkWalls.push(walls.left);
                                if (posIndex % horizonGrid == horizonGrid - 1 || bullet.x > walls.right.x - walls.right.data.w / 2)
                                    checkWalls.push(walls.right);
                                if (Math.floor(posIndex / horizonGrid) == 0 || bullet.y < walls.up.y + walls.up.data.h / 2)
                                    checkWalls.push(walls.up);
                                for (let i = 0; i < checkWalls.length; i++) {
                                    let wall = checkWalls[i];
                                    let hitInfo = checkCollision(bullet, wall, bulletDPos[bulletIdx][0], bulletDPos[bulletIdx][1]);
                                    if (hitInfo == null)
                                        continue;
                                    let hitPos = hitInfo[0];
                                    let horizon = hitInfo[1];
                                    if (horizon) {
                                        bulletDPos[bulletIdx][0] = -bulletDPos[bulletIdx][0];
                                    }
                                    else {
                                        bulletDPos[bulletIdx][1] = -bulletDPos[bulletIdx][1];
                                    }
                                    break;
                                }
                            }
                            yield ez.nextFrame();
                        }
                        let bigBoss = findBoss();
                        if (bigBoss) {
                            let bossPos = [bigBoss.x, bigBoss.y];
                            new ez.Tween(bigBoss).move({ x: [bigBoss.x, player.x], y: [bigBoss.y, player.y - 30] }, 800).config({ loop: false }).play();
                            yield ez.delay(800);
                            new ez.Tween(bigBoss).move({ x: [bigBoss.x, bossPos[0]], y: [bigBoss.y, bossPos[1]] }, 800).config({ loop: false }).play();
                            let curSubHp = 9 * curRound;
                            showSubHp(curSubHp);
                            chance -= curSubHp;
                            shakeAll(false);
                            if (chance <= 0) {
                                n.chance.text = `体力 0`;
                                break;
                            }
                            n.chance.text = `体力 ${chance}`;
                            yield ez.delay(1000);
                        }
                        for (let i = 0; i < attackEnemies.length; i++) {
                            if (!gridMap[attackEnemies[i][0]])
                                continue;
                            let attackEnemy = attackEnemies[i][1];
                            enemyBullets[i].visible = true;
                            new ez.Tween(enemyBullets[i]).move({ x: [attackEnemy.x, player.x], y: [attackEnemy.y, player.y] }, 800).config({ loop: false }).play();
                            yield ez.delay(800);
                            let curSubHp = 3 * curRound;
                            showSubHp(curSubHp);
                            chance -= curSubHp;
                            shakeAll(true);
                            if (chance <= 0)
                                chance = 0;
                            n.chance.text = `体力 ${chance}`;
                            enemyBullets[i].visible = false;
                        }
                        for (let i = 0; i < attackEnemies.length; i++) {
                            let readyEnemy = attackEnemies[i][1];
                            if (readyEnemy)
                                readyEnemy.data.ready.visible = false;
                        }
                        if (chance <= 0) {
                            n.chance.text = `体力 0`;
                            break;
                        }
                        if (killedAllEnmeies()) {
                            nextRound = true;
                            curRound += 1;
                            break;
                        }
                        yield ez.delay(1000);
                    }
                });
            }
            yield mainLoop();
            while (nextRound && curRound <= 5) {
                showRound(curRound);
                yield ez.delay(1500);
                bulletNum += 1;
                leftTime = true;
                allReset = false;
                resets = [];
                switch (curRound) {
                    case 1: enemiesData = createEnemiesData(enemiesGrid_Round1);
                    case 2: enemiesData = createEnemiesData(enemiesGrid_Round2);
                    case 3: enemiesData = createEnemiesData(enemiesGrid_Round3);
                    case 4: enemiesData = createEnemiesData(enemiesGrid_Round4);
                    case 5: enemiesData = createEnemiesData(enemiesGrid_Round5);
                }
                for (let i = 0; i < horizonGrid * verticalGrid; i++) {
                    gridMap[i] = null;
                }
                for (let i = 0; i < enemiesData.length; i++) {
                    createEnemy(enemiesData[i], stage);
                }
                chance = 100;
                n.chance.text = `体力 ${chance}`;
                for (let i = 0; i < bulletNum; i++) {
                    bullets[i] = createBullet(stage);
                    bullets[i].x = startPos[0];
                    bullets[i].y = startPos[1];
                    bulletDPos[i] = [0, 0];
                    resets[i] = 0;
                }
                yield mainLoop();
            }
            gameOver();
        });
    }
    function showResult(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            function commitScore(score) {
                return new Promise((resolver, reject) => {
                    var key = "zxdqw";
                    var timestamp = Date.now();
                    var sign = md5.hex(`${key}openid${PlayerInfo.openid}score${score}${timestamp}`);
                    ajax(`https://xwfintech.qingke.io/5f01dfe0d676280036a2e1ff/admin/openapi/pinball/add/measy?key=${key}&sign=${sign}&openid=${PlayerInfo.openid}&score=${score}&timestamp=${timestamp}`, function (e, r) {
                        if (r.code) {
                            reject();
                        }
                        else
                            resolver(r.data);
                    });
                });
            }
            var page = ctx.parent.createChild(game.ResultPage);
            var n = page.namedChilds;
            n.score.text = "" + score;
            var data = yield commitScore(score);
            game.getRank(n.rankPage);
            if (data)
                n.info.text = `超过了${data}的玩家`;
            page.addEventHandler("click", function (e) {
                switch (e.sender.id) {
                    case "rank":
                        n.rankPage.visible = true;
                        break;
                    case "closeRank":
                        n.rankPage.visible = false;
                        break;
                    case "replay":
                        page.parent.createChild(game.GamePage);
                        page.dispose();
                        break;
                    case "result":
                        var share = page.parent.createChild(game.SharePage);
                        page.dispose();
                        var n1 = share.namedChilds;
                        if (data)
                            n1.info.text = `超过了${data}的玩家`;
                        n1.name.text = "姓名：" + PlayerInfo.nickname;
                        n1.score.text = "成绩：" + score;
                        ez.setTimer(100, function () {
                            var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                            var div = document.getElementById("game");
                            var canvas = div.getElementsByTagName("canvas")[0];
                            var png = canvas.toDataURL("image/png");
                            window.parent.postMessage({ msg: "show", src: png }, "*");
                        });
                        break;
                }
            });
            ctx.dispose();
        });
    }
    function length(sprite, x, y) {
        var dx = sprite.x - x;
        var dy = sprite.y - y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    var RAD = 180 / Math.PI;
    class GamePage extends game._GamePage {
        constructor(parent) {
            super(parent);
            score = 0;
            const n = this.namedChilds;
            var sound = localStorage.getItem("sound");
            if (sound == null)
                sound = "1";
            n.sound.state = sound == "1" ? "check" : "uncheck";
            var stage = n.game.stage;
            n.touch.hitTest = function () { return true; };
            var arrow = new ez.ImageSprite(stage);
            arrow.src = "game/arrow";
            arrow.anchorY = 0.5;
            arrow.visible = false;
            arrow.zIndex = 1;
            var arrowWidth = arrow.width;
            var ctx = this;
            var lastPt;
            if (PlayerInfo) {
                n.name.text = PlayerInfo.nickname;
                n.avatar.src = PlayerInfo.headimgurl;
            }
            n.touch.onTouchBegin = function (e) {
                if (!launchResovle)
                    return;
                var x = e.screenX;
                var y = e.screenY;
                lastPt = [x, y];
                n.disk.x = x;
                n.disk.y = y;
                n.disk.visible = true;
                e.capture();
            };
            n.touch.onTouchMove = function (e) {
                if (!lastPt)
                    return;
                var dx = e.screenX - lastPt[0];
                var dy = e.screenY - lastPt[1];
                var r = Math.sqrt(dx * dx + dy * dy);
                var len = Math.max(12, Math.min(60, r));
                arrow.width = arrowWidth * len / 60;
                arrow.visible = true;
                arrow.x = bullets[0].x;
                arrow.y = bullets[0].y;
                if (dy >= 0)
                    arrow.angle = Math.acos(dx / r) * RAD + 180;
                else
                    arrow.angle = 180 - Math.acos(dx / r) * RAD;
            };
            n.touch.onTouchEnd = function (e) {
                if (!lastPt)
                    return;
                var dx = e.screenX - lastPt[0];
                var dy = e.screenY - lastPt[1];
                var r = Math.sqrt(dx * dx + dy * dy) + 0.01;
                var len = Math.max(10, Math.min(60, r));
                arrow.visible = false;
                var angle = arrow.angle;
                lastPt = null;
                n.disk.visible = false;
                if (r < 10)
                    return;
                if (launchResovle)
                    launchResovle([-dx * len / r, -dy * len / r]);
            };
            startGame(stage, n, function () {
                showResult(ctx);
            });
            this.addEventHandler("click", function (e) {
                switch (e.sender.id) {
                    case "help":
                        n.helpPage.visible = true;
                        break;
                    case "okBtn":
                        n.helpPage.visible = false;
                        break;
                    case "ok2Btn":
                        confirmStart = true;
                        n.intro.visible = false;
                        break;
                    case "sound":
                        var state = e.sender.state;
                        game.soundEnable(state == "check");
                        break;
                }
            });
        }
    }
    game.GamePage = GamePage;
})(game || (game = {}));
//# sourceMappingURL=gamePage.js.map