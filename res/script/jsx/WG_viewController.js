function VC_changeBG(bg_name) {
    document.getElementById('mainBackground').style.backgroundImage = "url('game/background/" + bg_name + "')";
}

function VC_changeP(P_name, pos) {
    if (pos === 'center') {
        if (P_name === 'none') {
            ReactDOM.render(React.createElement("div", null), document.getElementById('figureImage'));
            currentInfo["fig_Name"] = 'none';
        } else {
            var pUrl = "game/figure/" + P_name;
            var changedP = React.createElement("img", { src: pUrl, alt: "figure", className: "p_center" });
            // console.log('now changing person');
            ReactDOM.render(changedP, document.getElementById('figureImage'));
            currentInfo["fig_Name"] = P_name;
        }
    } else if (pos === 'left') {
        if (P_name === 'none') {
            ReactDOM.render(React.createElement("div", null), document.getElementById('figureImage_left'));
            currentInfo["fig_Name_left"] = 'none';
        } else {
            var _pUrl = "game/figure/" + P_name;
            var _changedP = React.createElement("img", { src: _pUrl, alt: "figure", className: "p_center" });
            // console.log('now changing person');
            ReactDOM.render(_changedP, document.getElementById('figureImage_left'));
            currentInfo["fig_Name_left"] = P_name;
        }
    } else if (pos === 'right') {
        if (P_name === 'none') {
            ReactDOM.render(React.createElement("div", null), document.getElementById('figureImage_right'));
            currentInfo["fig_Name_right"] = 'none';
        } else {
            var _pUrl2 = "game/figure/" + P_name;
            var _changedP2 = React.createElement("img", { src: _pUrl2, alt: "figure", className: "p_center" });
            // console.log('now changing person');
            ReactDOM.render(_changedP2, document.getElementById('figureImage_right'));
            currentInfo["fig_Name_right"] = P_name;
        }
    }
}

function VC_choose(selection, mode) {
    if (mode === 'scene') {
        document.getElementById('chooseBox').style.display = 'flex';
        var elements = [];

        var _loop = function _loop(i) {
            var temp = React.createElement(
                "div",
                { className: "singleChoose", key: i, onClick: function onClick() {
                        chooseScene(selection[i][1]);
                    } },
                selection[i][0]
            );
            elements.push(temp);
        };

        for (var i = 0; i < selection.length; i++) {
            _loop(i);
        }
        ReactDOM.render(React.createElement(
            "div",
            null,
            elements
        ), document.getElementById('chooseBox'));
    }
    if (mode === 'label') {
        document.getElementById('chooseBox').style.display = 'flex';
        var _elements = [];

        var _loop2 = function _loop2(i) {
            var temp = React.createElement(
                "div",
                { className: "singleChoose", key: i, onClick: function onClick() {
                        chooseJumpFun(selection[i][1]);
                    } },
                selection[i][0]
            );
            _elements.push(temp);
        };

        for (var i = 0; i < selection.length; i++) {
            _loop2(i);
        }
        ReactDOM.render(React.createElement(
            "div",
            null,
            _elements
        ), document.getElementById('chooseBox'));
    }
}

function VC_textShow(name, text) {
    var changedName = React.createElement(
        "span",
        null,
        name
    );
    var textArray = text.split("");
    ReactDOM.render(changedName, document.getElementById('pName'));
    showTextArray(textArray);
}

function VC_restoreStatus(savedStatus) {
    var command = savedStatus["command"];
    if (savedStatus["bg_Name"] !== '') document.getElementById('mainBackground').style.backgroundImage = "url('game/background/" + savedStatus["bg_Name"] + "')";
    if (savedStatus["fig_Name"] === '' || savedStatus["fig_Name"] === 'none') {
        ReactDOM.render(React.createElement("div", null), document.getElementById('figureImage'));
    } else {
        var pUrl = "game/figure/" + savedStatus["fig_Name"];
        var changedP = React.createElement("img", { src: pUrl, alt: "figure", className: "p_center" });
        // console.log('now changing person');
        ReactDOM.render(changedP, document.getElementById('figureImage'));
    }
    if (savedStatus["fig_Name_left"] === '' || savedStatus["fig_Name_left"] === 'none') {
        ReactDOM.render(React.createElement("div", null), document.getElementById('figureImage_left'));
    } else {
        var _pUrl3 = "game/figure/" + savedStatus["fig_Name_left"];
        var _changedP3 = React.createElement("img", { src: _pUrl3, alt: "figure", className: "p_center" });
        // console.log('now changing person');
        ReactDOM.render(_changedP3, document.getElementById('figureImage_left'));
    }
    if (savedStatus["fig_Name_right"] === '' || savedStatus["fig_Name_right"] === 'none') {
        ReactDOM.render(React.createElement("div", null), document.getElementById('figureImage_right'));
    } else {
        var _pUrl4 = "game/figure/" + savedStatus["fig_Name_right"];
        var _changedP4 = React.createElement("img", { src: _pUrl4, alt: "figure", className: "p_center" });
        // console.log('now changing person');
        ReactDOM.render(_changedP4, document.getElementById('figureImage_right'));
    }
    if (command === 'choose' || command === 'choose_label') {
        var chooseItems = savedStatus["choose"];
        chooseItems = chooseItems.split("}")[0];
        chooseItems = chooseItems.split("{")[1];
        var selection = chooseItems.split(',');
        for (var i = 0; i < selection.length; i++) {
            selection[i] = selection[i].split(":");
        }
        var choose_mode = '';
        switch (command) {
            case 'choose':
                choose_mode = 'scene';
                break;
            case 'choose_label':
                choose_mode = 'label';
                break;
        }
        VC_choose(selection, choose_mode);
    }
    var changedName = React.createElement(
        "span",
        null,
        savedStatus["showName"]
    );
    var textArray = savedStatus["showText"].split("");
    ReactDOM.render(changedName, document.getElementById('pName'));
    SyncCurrentStatus('vocal', savedStatus['vocal']);
    if (getStatus('bgm') !== savedStatus['bgm']) {
        currentInfo['bgm'] = savedStatus['bgm'];
        loadBGM();
    }
    playVocal();
    showTextArray(textArray);
}

function VC_showSettings() {
    var settingInterface = React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            { className: "singleSettingItem" },
            React.createElement(SettingButtons_font, null),
            React.createElement(SettingButtons_speed, null),
            React.createElement(
                "div",
                { className: "deleteCookie", onClick: function onClick() {
                        showMesModel('你确定要清除缓存吗', '要', '不要', clearCookie);
                    } },
                "\u6E05\u9664\u6240\u6709\u8BBE\u7F6E\u9009\u9879\u4EE5\u53CA\u5B58\u6863"
            ),
            React.createElement(ImporterExporter, null),
            React.createElement(
                "div",
                null,
                "\u672C\u4F5C\u54C1\u7531 WebGAL \u5F3A\u529B\u9A71\u52A8\uFF0C",
                React.createElement(
                    "a",
                    { href: "https://github.com/MakinoharaShoko/WebGAL" },
                    "\u4E86\u89E3 WebGAL"
                ),
                "\u3002"
            ),
            React.createElement("br", null),
            React.createElement(
                "div",
                { className: "settingItemTitle" },
                "\u6548\u679C\u9884\u89C8"
            )
        )
    );
    document.getElementById("settings").style.display = "flex";
    document.getElementById("bottomBox").style.display = "none";
    ReactDOM.render(settingInterface, document.getElementById("settingItems"));
    ReactDOM.render(React.createElement("div", { id: "previewDiv" }), document.getElementById('textPreview'));
    showTextPreview('现在预览的是文本框字体大小和播放速度的情况，您可以根据您的观感调整上面的选项。');
}

function VC_showSave_Load(mode) {
    if (mode === 'save') {
        ReactDOM.render(React.createElement(SaveMainModel, { PageQty: 15 }), document.getElementById('SaveItems'));
    } else {
        ReactDOM.render(React.createElement(LoadMainModel, { PageQty: 15 }), document.getElementById('LoadItems'));
    }
}

function VC_resetStage() {
    // document.getElementById('mainBackground').style.backgroundImage = 'none';
    ReactDOM.render(React.createElement("div", null), document.getElementById('figureImage'));
    ReactDOM.render(React.createElement("div", null), document.getElementById('figureImage_left'));
    ReactDOM.render(React.createElement("div", null), document.getElementById('figureImage_right'));
}

function loadBGM() {
    var bgmName = currentInfo["bgm"];
    if (bgmName === '' || bgmName === 'none') {
        ReactDOM.render(React.createElement("div", null), document.getElementById("bgm"));
        return;
    }
    var url = "./game/bgm/" + bgmName;
    var audio = React.createElement("audio", { src: url, id: "currentBGM", loop: "loop" });
    ReactDOM.render(audio, document.getElementById("bgm"));
    var playControl = document.getElementById("currentBGM");
    playControl.currentTime = 0;
    playControl.volume = 0.25;
    playControl.play();
}

function playVocal() {
    var vocalName = currentInfo["vocal"];
    var url = './game/vocal/' + vocalName;
    var vocal = React.createElement("audio", { src: url, id: "currentVocal" });
    ReactDOM.render(vocal, document.getElementById('vocal'));
    var VocalControl = document.getElementById("currentVocal");
    VocalControl.currentTime = 0;
    VocalControl.play();
}

function showIntro(text) {
    var i = 0;
    var IntroView = React.createElement(
        "div",
        null,
        React.createElement("div", { id: "textShowArea", className: "textShowArea_styl" })
    );
    ReactDOM.render(IntroView, document.getElementById("intro"));
    ReactDOM.render(React.createElement(
        "div",
        null,
        " "
    ), document.getElementById("textShowArea"));
    document.getElementById("intro").style.display = 'block';
    var textArray = text.split(',');
    var introInterval = setInterval(textShow, 1500);
    var introAll = [];
    function textShow() {
        var singleRow = React.createElement(
            "div",
            { className: "introSingleRow", key: i },
            textArray[i]
        );
        introAll.push(singleRow);
        i = i + 1;
        ReactDOM.render(React.createElement(
            "div",
            null,
            introAll
        ), document.getElementById("textShowArea"));
        if (i >= textArray.length) {
            clearInterval(introInterval);
            setTimeout(clearIntro, 3500);
        }
    }
}

// 渐显文字
function showTextArray(textArray) {
    showingText = false;
    ReactDOM.render(React.createElement(
        "span",
        null,
        " "
    ), document.getElementById('SceneText'));
    var elementArray = [];
    var i = 0;
    clearInterval(interval);
    var interval = setInterval(showSingle, textShowWatiTime);
    showingText = true;
    function showSingle() {
        if (!showingText) {
            var textFull = '';
            for (var j = 0; j < textArray.length; j++) {
                textFull = textFull + textArray[j];
            }
            ReactDOM.render(React.createElement(
                "div",
                null,
                textFull
            ), document.getElementById('SceneText'));
            if (auto === 1) {
                if (i < textArray.length + 1) {
                    i = textArray.length + 1;
                } else {
                    i = i + 1;
                }
            } else {
                i = textArray.length + 1 + autoWaitTime / 35;
            }
        } else {
            var tempElement = React.createElement(
                "span",
                { key: i, className: "singleWord" },
                textArray[i]
            );
            elementArray.push(tempElement);
            ReactDOM.render(React.createElement(
                "div",
                null,
                elementArray
            ), document.getElementById('SceneText'));
            i = i + 1;
        }
        if (i > textArray.length && auto !== 1) {
            showingText = false;
        }
        if (i > textArray.length + autoWaitTime / 35) {

            if (auto === 1) {
                if (document.getElementById('currentVocal') && fast === 0) {
                    if (document.getElementById('currentVocal').ended) {
                        clearInterval(interval);
                        showingText = false;
                        nextSentenceProcessor();
                    }
                } else {
                    clearInterval(interval);
                    showingText = false;
                    nextSentenceProcessor();
                }
            } else {
                showingText = false;
                clearInterval(interval);
            }
        }
    }
}

function showTextPreview(text) {
    onTextPreview = onTextPreview + 1;
    var textArray = text.split("");
    if (Settings["font_size"] === 'small') {
        document.getElementById('previewDiv').style.fontSize = '150%';
    } else if (Settings["font_size"] === 'medium') {
        document.getElementById('previewDiv').style.fontSize = '200%';
    } else if (Settings["font_size"] === 'large') {
        document.getElementById('previewDiv').style.fontSize = '250%';
    }
    ReactDOM.render(React.createElement(
        "span",
        null,
        " "
    ), document.getElementById('previewDiv'));
    var elementArray = [];
    var i = 0;
    clearInterval(interval2);
    var interval2 = setInterval(showSingle, textShowWatiTime);
    function showSingle() {
        if (onTextPreview > 1) {
            onTextPreview = onTextPreview - 1;
            clearInterval(interval2);
            return;
        }
        var tempElement = React.createElement(
            "span",
            { key: i, className: "singleWord" },
            textArray[i]
        );
        elementArray.push(tempElement);
        ReactDOM.render(React.createElement(
            "div",
            null,
            elementArray
        ), document.getElementById('previewDiv'));
        i = i + 1;
        if (i > textArray.length + 1000 / 35) {
            clearInterval(interval2);
            interval2 = setInterval(showSingle, textShowWatiTime);
            i = 0;
            elementArray = [];
            if (Settings["font_size"] === 'small') {
                document.getElementById('previewDiv').style.fontSize = '150%';
            } else if (Settings["font_size"] === 'medium') {
                document.getElementById('previewDiv').style.fontSize = '200%';
            } else if (Settings["font_size"] === 'large') {
                document.getElementById('previewDiv').style.fontSize = '250%';
            }
        }
    }
}

function showMesModel(Title, Left, Right, func) {
    document.getElementById('MesModel').style.display = 'block';
    var element = React.createElement(
        "div",
        { className: 'MesMainWindow' },
        React.createElement(
            "div",
            { className: "MesTitle" },
            Title
        ),
        React.createElement(
            "div",
            { className: 'MesChooseContainer' },
            React.createElement(
                "div",
                { className: 'MesChoose', onClick: function onClick() {
                        func();document.getElementById('MesModel').style.display = 'none';
                    } },
                Left
            ),
            React.createElement(
                "div",
                { className: 'MesChoose', onClick: function onClick() {
                        document.getElementById('MesModel').style.display = 'none';
                    } },
                Right
            )
        )
    );
    ReactDOM.render(element, document.getElementById('MesModel'));
}

function showBacklog() {
    var even = window.event || arguments.callee.caller.arguments[0];
    even.preventDefault();
    even.stopPropagation(); //阻止事件冒泡
    document.getElementById('backlog').style.display = 'block';
    document.getElementById('bottomBox').style.display = 'none';
    var showBacklogList = [];

    var _loop3 = function _loop3(i) {
        var temp = React.createElement(
            "div",
            { className: 'backlog_singleElement', key: i, onClick: function onClick() {
                    jumpFromBacklog(i);
                } },
            React.createElement(
                "div",
                { className: "backlog_name" },
                CurrentBacklog[i].showName
            ),
            React.createElement(
                "div",
                { className: "backlog_text" },
                CurrentBacklog[i].showText
            )
        );
        showBacklogList.push(temp);
    };

    for (var i = 0; i < CurrentBacklog.length; i++) {
        _loop3(i);
    }
    ReactDOM.render(React.createElement(
        "div",
        null,
        showBacklogList
    ), document.getElementById('backlogContent'));
}

// -------- 紧急回避 --------

function showPanic(showType) {
    document.querySelector('div#panic-overlay').style.display = 'block';
    if (showType === 'Yoozle') {
        var ele = React.createElement(
            "div",
            { className: "yoozle-container" },
            React.createElement(
                "div",
                { className: "yoozle-title" },
                React.createElement(
                    "span",
                    null,
                    React.createElement(
                        "span",
                        { className: "yoozle-gl-blue" },
                        "Y"
                    ),
                    React.createElement(
                        "span",
                        { className: "yoozle-gl-red" },
                        "o"
                    ),
                    React.createElement(
                        "span",
                        {
                            className: "yoozle-gl-yellow" },
                        "o"
                    ),
                    React.createElement(
                        "span",
                        { className: "yoozle-gl-blue" },
                        "z"
                    ),
                    React.createElement(
                        "span",
                        {
                            className: "yoozle-gl-green" },
                        "l"
                    ),
                    React.createElement(
                        "span",
                        { className: "yoozle-gl-red yoozle-e-rotate" },
                        "e"
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "yoozle-search" },
                React.createElement("input", { className: "yoozle-search-bar", type: "text", defaultValue: "" }),
                React.createElement(
                    "div",
                    { className: "yoozle-search-buttons" },
                    React.createElement("input", { className: "yoozle-btn", type: "submit", value: "Yoozle Search" }),
                    React.createElement("input", { className: "yoozle-btn", type: "submit", value: "I'm Feeling Lucky" })
                )
            )
        );
        ReactDOM.render(ele, document.querySelector('div#panic-overlay'));
        document.querySelector('input.yoozle-search-bar').value = '';
    }
}