var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var PlayerInfo = {};
function ajax(url, cb) {
    var x = new XMLHttpRequest();
    x.open("GET", url);
    x.onload = function () {
        var is_error = x.status >= 400 || (!x.status && !x.responseText);
        if (is_error) {
            alert(`failed: ${x.status} ${x.responseText}`);
            cb(false);
        }
        else
            cb(true, JSON.parse(x.responseText));
    };
    try {
        x.send();
    }
    catch (_a) {
        cb(false);
    }
}
var mainFrame;
window.onmessage = function (ev) {
    var data = ev.data;
    if (data.msg == "login" && data.info)
        PlayerInfo = JSON.parse(data.info);
    if (data.msg == "back") {
        mainFrame.clearChilds();
        mainFrame.createChild(game.GamePage);
    }
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        window.parent.postMessage({ msg: "login" }, "*");
        ez.initialize({
            width: 710,
            height: 1280,
            minHeight: 1100,
            maxHeight: 1400,
            highDPI: true,
            wglOptions: { preserveDrawingBuffer: true },
            scaleMode: 3,
            fps: 120
        });
        ez.loadEZMDecoder(typeof (WebAssembly) === "undefined" ? "ezm.asm.js" : "ezm.wasm.js", 1);
        if (PUBLISH) {
            ez.loadResPackage(game.resData, "res/", game.resGroups);
            ez.loadGroup(["ui", "start", "image/bg"], function (progress, total) {
                if (progress >= total) {
                    var t = Date.now() - startTime;
                    mainFrame = ez.getRoot().createChild(game.MainFrame);
                    var loading = document.getElementById("loading");
                    if (loading)
                        document.body.removeChild(loading);
                    ez.loadGroup(["game", "image/活动规则", "image/说明", "share"]);
                }
            });
        }
        else {
            yield ez.loadJSONPackageAsync("assets/resource.json", "assets/res/");
            ez.loadGroup(["ui", "start", "image/bg"], function (progress, total) {
                if (progress >= total) {
                    var t = Date.now() - startTime;
                    mainFrame = ez.getRoot().createChild(game.MainFrame);
                    var loading = document.getElementById("loading");
                    if (loading)
                        document.body.removeChild(loading);
                    ez.loadGroup(["game", "image/活动规则", "image/说明", "share"]);
                }
            });
        }
    });
}
//# sourceMappingURL=main.js.map