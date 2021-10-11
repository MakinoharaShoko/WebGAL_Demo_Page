var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//初始化变量表
{
    var currentScene = '';
    var currentSceneIndex = 0;
    var currentSentence = 0;
    var currentText = 0;
    var auto = 0;
    var fast = 0;
    var setAutoWaitTime = 1500;
    var autoWaitTime = 1500;
    var textShowWatiTime = 35;
    var currentInfo = {
        SceneName: '', //场景文件名
        SentenceID: 0, //语句ID
        bg_Name: '', //背景文件名
        fig_Name: '', //立绘_中 文件名
        fig_Name_left: '', //立绘_左 文件名
        fig_Name_right: '', //立绘_右 文件名
        showText: '', //文字
        showName: '', //人物名
        command: '', //语句指令
        choose: '', //选项列表
        currentText: 0, //当前文字ID
        vocal: '', //语音 文件名
        bgm: '' //背景音乐 文件名
    };
    var onTextPreview = 0;
    var currentName = '';
    var showingText = false;
}

// 初始化存档系统
var Saves = [];
var SaveBacklog = [];

// 初始化backlog存储表
var CurrentBacklog = [];

//初始化需要记录到cookie的变量
var currentSavePage = 0;
var currentLoadPage = 0;

// 初始化设置表
var Settings = {
    font_size: 'medium',
    play_speed: 'medium'
};

function loadCookie() {
    if (localStorage.getItem('WebGAL')) {
        // let pre_process = document.cookie;
        // let fst = pre_process.split(';')[0];
        // let scd = document.cookie.slice(fst.length+1);
        var data = JSON.parse(localStorage.getItem('WebGAL'));
        Saves = data.SavedGame;
        SaveBacklog = data.SavedBacklog;
        currentSavePage = data.SP;
        currentLoadPage = data.LP;
        Settings = data.cSettings;
    }
}

function writeCookie() {
    // var expire = new Date((new Date()).getTime() + 20000 * 24 * 60 * 60000);//有效期20000天
    // expire = ";expires=" + expire.toGMTString();
    var toCookie = {
        SavedGame: Saves,
        SavedBacklog: SaveBacklog,
        SP: currentSavePage,
        LP: currentLoadPage,
        cSettings: Settings
        // console.log(JSON.stringify(toCookie));
    };localStorage.setItem('WebGAL', JSON.stringify(toCookie));
    // document.cookie = JSON.stringify(toCookie);
}

function clearCookie() {
    var toCookie = {
        SavedGame: [],
        SavedBacklog: [],
        SP: 0,
        LP: 0,
        cSettings: {
            font_size: 'medium',
            play_speed: 'medium'
        }
    };
    localStorage.setItem('WebGAL', JSON.stringify(toCookie));
}

// 读取游戏存档
function LoadSavedGame(index) {
    closeLoad();
    hideTitle('non-restart');
    var save = Saves[index];
    //get Scene:
    var url = 'game/scene/';
    url = url + save['SceneName'];
    currentScene = '';
    currentText = 0;

    var getScReq = null;
    getScReq = new XMLHttpRequest();

    if (getScReq != null) {
        getScReq.open("get", url, true);
        getScReq.send();
        getScReq.onreadystatechange = doResult; //设置回调函数
    }
    function doResult() {
        if (getScReq.readyState === 4) {
            //4表示执行完成
            if (getScReq.status === 200) {
                //200表示执行成功
                currentScene = getScReq.responseText;
                currentScene = currentScene.split('\n');
                for (var i = 0; i < currentScene.length; i++) {
                    var tempSentence = currentScene[i].split(";")[0];
                    var commandLength = tempSentence.split(":")[0].length;
                    var _command = currentScene[i].split(":")[0];
                    var content = tempSentence.slice(commandLength + 1);
                    currentScene[i] = currentScene[i].split(":");
                    currentScene[i][0] = _command;
                    currentScene[i][1] = content;
                }
                // console.log('Read scene complete.');
                // console.log(currentScene);
                currentSentence = save["SentenceID"];
                currentText = save["SentenceID"];
                // console.log("start:"+currentSentence)

                //load saved scene:
                var command = save["command"];
                // console.log('readSaves:'+command)
                if (save["bg_Name"] !== '') document.getElementById('mainBackground').style.backgroundImage = "url('game/background/" + save["bg_Name"] + "')";
                if (save["fig_Name"] === '' || save["fig_Name"] === 'none') {
                    ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage'));
                } else {
                    var pUrl = "game/figure/" + save["fig_Name"];
                    var changedP = React.createElement('img', { src: pUrl, alt: 'figure', className: 'p_center' });
                    // console.log('now changing person');
                    ReactDOM.render(changedP, document.getElementById('figureImage'));
                }
                if (save["fig_Name_left"] === '' || save["fig_Name_left"] === 'none') {
                    ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage_left'));
                } else {
                    var _pUrl = "game/figure/" + save["fig_Name_left"];
                    var _changedP = React.createElement('img', { src: _pUrl, alt: 'figure', className: 'p_center' });
                    // console.log('now changing person');
                    ReactDOM.render(_changedP, document.getElementById('figureImage_left'));
                }
                if (save["fig_Name_right"] === '' || save["fig_Name_right"] === 'none') {
                    ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage_right'));
                } else {
                    var _pUrl2 = "game/figure/" + save["fig_Name_right"];
                    var _changedP2 = React.createElement('img', { src: _pUrl2, alt: 'figure', className: 'p_center' });
                    // console.log('now changing person');
                    ReactDOM.render(_changedP2, document.getElementById('figureImage_right'));
                }

                if (command === 'choose') {
                    (function () {
                        document.getElementById('chooseBox').style.display = 'flex';
                        var chooseItems = save["choose"];
                        chooseItems = chooseItems.split("}")[0];
                        chooseItems = chooseItems.split("{")[1];
                        var selection = chooseItems.split(',');
                        for (var _i = 0; _i < selection.length; _i++) {
                            selection[_i] = selection[_i].split(":");
                        }
                        var elements = [];

                        var _loop = function _loop(_i2) {
                            var temp = React.createElement(
                                'div',
                                { className: 'singleChoose', key: _i2, onClick: function onClick() {
                                        chooseScene(selection[_i2][1]);
                                    } },
                                selection[_i2][0]
                            );
                            elements.push(temp);
                        };

                        for (var _i2 = 0; _i2 < selection.length; _i2++) {
                            _loop(_i2);
                        }
                        ReactDOM.render(React.createElement(
                            'div',
                            null,
                            elements
                        ), document.getElementById('chooseBox'));
                        // return;
                    })();
                }
                var changedName = React.createElement(
                    'span',
                    null,
                    save["showName"]
                );
                var textArray = save["showText"].split("");
                // let changedText = <p>{processSentence(currentSentence)['text']}</p>
                ReactDOM.render(changedName, document.getElementById('pName'));
                currentText = save["currentText"];
                currentInfo["vocal"] = save['vocal'];
                if (currentInfo['bgm'] !== save['bgm']) {
                    currentInfo['bgm'] = save['bgm'];
                    loadBGM();
                }
                playVocal();
                showTextArray(textArray, currentText);
                // currentText = currentText + 1;

                // currentSentence = currentSentence+1;
            }
        }
    }
    CurrentBacklog = SaveBacklog[index];
}

// 保存当前游戏状态
function saveGame(index) {
    var tempInfo = JSON.stringify(currentInfo);
    Saves[index] = JSON.parse(tempInfo);
    var tempBacklog = JSON.stringify(CurrentBacklog);
    SaveBacklog[index] = JSON.parse(tempBacklog);
    writeCookie();
}

// 获取场景脚本
function getScene(url) {
    currentScene = '';
    currentText = 0;

    var getScReq = null;
    getScReq = new XMLHttpRequest();
    console.log('now read scene');
    if (getScReq != null) {
        getScReq.open("get", url, true);
        getScReq.send();
        getScReq.onreadystatechange = doResult; //设置回调函数
    }
    function doResult() {
        if (getScReq.readyState === 4) {
            //4表示执行完成
            if (getScReq.status === 200) {
                //200表示执行成功
                currentScene = getScReq.responseText;
                currentScene = currentScene.split('\n');
                for (var i = 0; i < currentScene.length; i++) {
                    var tempSentence = currentScene[i].split(";")[0];
                    var commandLength = tempSentence.split(":")[0].length;
                    var command = currentScene[i].split(":")[0];
                    command = command.split(';')[0];
                    var content = tempSentence.slice(commandLength + 1);
                    currentScene[i] = currentScene[i].split(":");
                    currentScene[i][0] = command;
                    currentScene[i][1] = content;
                }
                // console.log('Read scene complete.');
                // console.log(currentScene);
                currentSentence = 0;
                // console.log("start:"+currentSentence)
                nextSentenceProcessor();
            }
        }
    }
}

// 引擎加载完成
window.onload = function () {
    loadCookie();
    loadSettings();
    document.getElementById('Title').style.backgroundImage = 'url("./game/background/Title.png")';
    if (isMobile()) {
        console.log("nowis mobile view");
        document.getElementById('bottomBox').style.height = '45%';
        document.getElementById('TitleModel').style.height = '20%';
    }
};

function loadSettings() {
    if (Settings["font_size"] === 'small') {
        document.getElementById('SceneText').style.fontSize = '150%';
    } else if (Settings["font_size"] === 'medium') {
        document.getElementById('SceneText').style.fontSize = '200%';
    } else if (Settings["font_size"] === 'large') {
        document.getElementById('SceneText').style.fontSize = '250%';
    }

    if (Settings["play_speed"] === 'low') {
        textShowWatiTime = 150;
    } else if (Settings["play_speed"] === 'medium') {
        textShowWatiTime = 50;
    } else if (Settings["play_speed"] === 'fast') {
        textShowWatiTime = 10;
    }
}

// 处理脚本
function processSentence(i) {
    if (i < currentScene.length) {
        var vocal = '';
        if (currentScene[i][1] !== '') {
            var text = currentScene[i][1];
            if (currentScene[i][1].split('vocal-').length > 1) {
                vocal = currentScene[i][1].split('vocal-')[1].split(',')[0];
                text = currentScene[i][1].split('vocal-')[1].slice(currentScene[i][1].split('vocal-')[1].split(',')[0].length + 1);
            }
            currentName = currentScene[i][0];
            return { name: currentName, text: text, vocal: vocal };
        } else {
            var _text = currentScene[i][0];
            if (currentScene[i][0].split('vocal-').length > 1) {
                vocal = currentScene[i][0].split('vocal-')[1].split(',')[0];
                _text = currentScene[i][0].split('vocal-')[1].slice(currentScene[i][0].split('vocal-')[1].split(',')[0].length + 1);
            }
            return { name: currentName, text: _text, vocal: vocal };
        }
    }
}

// 读取下一条脚本
function nextSentenceProcessor() {
    if (showingText) {
        showingText = false;
        return;
    }
    var saveBacklogNow = false;
    if (currentSentence >= currentScene.length) {
        return;
    }
    var thisSentence = currentScene[currentSentence];
    var command = thisSentence[0];
    // console.log(command)
    if (command === 'changeBG') {
        // console.log('Now change background to ' + "url('/game/background/" + thisSentence[1] + "')");
        document.getElementById('mainBackground').style.backgroundImage = "url('game/background/" + thisSentence[1] + "')";
        currentInfo["bg_Name"] = thisSentence[1];
        autoPlay('on');
    } else if (command === 'changeP') {
        if (thisSentence[1] === 'none') {
            ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage'));
            currentInfo["fig_Name"] = 'none';
        } else {
            var pUrl = "game/figure/" + thisSentence[1];
            var changedP = React.createElement('img', { src: pUrl, alt: 'figure', className: 'p_center' });
            // console.log('now changing person');
            ReactDOM.render(changedP, document.getElementById('figureImage'));
            currentInfo["fig_Name"] = thisSentence[1];
        }
        autoPlay('on');
    } else if (command === 'changeP_left') {
        if (thisSentence[1] === 'none') {
            ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage_left'));
            currentInfo["fig_Name_left"] = 'none';
        } else {
            var _pUrl3 = "game/figure/" + thisSentence[1];
            var _changedP3 = React.createElement('img', { src: _pUrl3, alt: 'figure', className: 'p_center' });
            // console.log('now changing person');
            ReactDOM.render(_changedP3, document.getElementById('figureImage_left'));
            currentInfo["fig_Name_left"] = thisSentence[1];
        }
        autoPlay('on');
    } else if (command === 'changeP_right') {
        if (thisSentence[1] === 'none') {
            ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage_right'));
            currentInfo["fig_Name_right"] = 'none';
        } else {
            var _pUrl4 = "game/figure/" + thisSentence[1];
            var _changedP4 = React.createElement('img', { src: _pUrl4, alt: 'figure', className: 'p_center' });
            // console.log('now changing person');
            ReactDOM.render(_changedP4, document.getElementById('figureImage_right'));
            currentInfo["fig_Name_right"] = thisSentence[1];
        }
        autoPlay('on');
    } else if (command === 'changeP_left_next') {
        if (thisSentence[1] === 'none') {
            ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage_left'));
            currentInfo["fig_Name_left"] = 'none';
        } else {
            var _pUrl5 = "game/figure/" + thisSentence[1];
            var _changedP5 = React.createElement('img', { src: _pUrl5, alt: 'figure', className: 'p_center' });
            // console.log('now changing person');
            ReactDOM.render(_changedP5, document.getElementById('figureImage_left'));
            currentInfo["fig_Name_left"] = thisSentence[1];
        }
        currentSentence = currentSentence + 1;
        nextSentenceProcessor();
        return;
    } else if (command === 'changeP_right_next') {
        if (thisSentence[1] === 'none') {
            ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage_right'));
            currentInfo["fig_Name_right"] = 'none';
        } else {
            var _pUrl6 = "game/figure/" + thisSentence[1];
            var _changedP6 = React.createElement('img', { src: _pUrl6, alt: 'figure', className: 'p_center' });
            // console.log('now changing person');
            ReactDOM.render(_changedP6, document.getElementById('figureImage_right'));
            currentInfo["fig_Name_right"] = thisSentence[1];
        }
        currentSentence = currentSentence + 1;
        nextSentenceProcessor();
        return;
    } else if (command === 'changeP_next') {
        if (thisSentence[1] === 'none') {
            ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage'));
            currentInfo["fig_Name"] = thisSentence[1];
        } else {
            var _pUrl7 = "game/figure/" + thisSentence[1];
            var _changedP7 = React.createElement('img', { src: _pUrl7, alt: 'figure', className: 'p_center' });
            // console.log('now changing person');
            ReactDOM.render(_changedP7, document.getElementById('figureImage'));
            currentInfo["fig_Name"] = thisSentence[1];
        }
        currentSentence = currentSentence + 1;
        nextSentenceProcessor();
        return;
    } else if (command === 'changeBG_next') {
        document.getElementById('mainBackground').style.backgroundImage = "url('game/background/" + thisSentence[1] + "')";
        currentSentence = currentSentence + 1;
        currentInfo["bg_Name"] = thisSentence[1];
        nextSentenceProcessor();
        return;
    } else if (command === 'changeScene') {
        var sUrl = "game/scene/" + thisSentence[1];
        var SceneName = thisSentence[1];
        getScene(sUrl);
        currentInfo["SceneName"] = SceneName;
        return;
    } else if (command === 'choose') {
        var _ret3 = function () {
            currentInfo["command"] = command;
            document.getElementById('chooseBox').style.display = 'flex';
            var chooseItems = thisSentence[1];
            currentInfo["choose"] = chooseItems;
            chooseItems = chooseItems.split("}")[0];
            chooseItems = chooseItems.split("{")[1];
            var selection = chooseItems.split(',');
            for (var i = 0; i < selection.length; i++) {
                selection[i] = selection[i].split(":");
            }
            var elements = [];

            var _loop2 = function _loop2(_i3) {
                var temp = React.createElement(
                    'div',
                    { className: 'singleChoose', key: _i3, onClick: function onClick() {
                            chooseScene(selection[_i3][1]);
                        } },
                    selection[_i3][0]
                );
                elements.push(temp);
            };

            for (var _i3 = 0; _i3 < selection.length; _i3++) {
                _loop2(_i3);
            }
            ReactDOM.render(React.createElement(
                'div',
                null,
                elements
            ), document.getElementById('chooseBox'));
            return {
                v: void 0
            };
        }();

        if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
    } else if (command === 'bgm') {
        currentInfo["bgm"] = thisSentence[1];
        loadBGM();
        currentSentence = currentSentence + 1;
        nextSentenceProcessor();
        return;
    } else if (command === 'choose_label') {
        var _ret5 = function () {

            currentInfo["command"] = command;
            document.getElementById('chooseBox').style.display = 'flex';
            var chooseItems = thisSentence[1];
            currentInfo["choose"] = chooseItems;
            chooseItems = chooseItems.split("}")[0];
            chooseItems = chooseItems.split("{")[1];
            var selection = chooseItems.split(',');
            for (var i = 0; i < selection.length; i++) {
                selection[i] = selection[i].split(":");
            }
            var elements = [];

            var _loop3 = function _loop3(_i4) {
                var temp = React.createElement(
                    'div',
                    { className: 'singleChoose', key: _i4, onClick: function onClick() {
                            chooseJumpFun(selection[_i4][1]);
                        } },
                    selection[_i4][0]
                );
                elements.push(temp);
            };

            for (var _i4 = 0; _i4 < selection.length; _i4++) {
                _loop3(_i4);
            }
            ReactDOM.render(React.createElement(
                'div',
                null,
                elements
            ), document.getElementById('chooseBox'));
            return {
                v: void 0
            };
        }();

        if ((typeof _ret5 === 'undefined' ? 'undefined' : _typeof(_ret5)) === "object") return _ret5.v;
    } else if (command === 'jump_label') {
        var lab_name = thisSentence[1];
        //find the line of the label:
        var find = false;
        var jmp_sentence = 0;
        for (var i = 0; i < currentScene.length; i++) {
            if (currentScene[i][0] === 'label' && currentScene[i][1] === lab_name) {
                find = true;
                jmp_sentence = i;
            }
        }
        if (find) {
            currentSentence = jmp_sentence;
            nextSentenceProcessor();
            return;
        } else {
            currentSentence = currentSentence + 1;
            nextSentenceProcessor();
            return;
        }
    } else if (command === 'label') {
        currentSentence = currentSentence + 1;
        nextSentenceProcessor();
        return;
    } else {
        currentInfo["command"] = processSentence(currentSentence)['name'];
        currentInfo["showName"] = processSentence(currentSentence)['name'];
        currentInfo["showText"] = processSentence(currentSentence)['text'];
        currentInfo["vocal"] = processSentence(currentSentence)['vocal'];
        var changedName = React.createElement(
            'span',
            null,
            processSentence(currentSentence)['name']
        );
        var textArray = processSentence(currentSentence)['text'].split("");
        // let changedText = <p>{processSentence(currentSentence)['text']}</p>
        ReactDOM.render(changedName, document.getElementById('pName'));
        if (currentInfo["vocal"] !== '') {
            playVocal();
        }
        saveBacklogNow = true;
        showTextArray(textArray, currentText + 1);
        currentText = currentText + 1;
        currentInfo["currentText"] = currentText;
    }
    currentSentence = currentSentence + 1;
    currentInfo["SentenceID"] = currentSentence;
    if (saveBacklogNow) {
        if (CurrentBacklog.length <= 500) {
            var temp = JSON.stringify(currentInfo);
            var pushElement = JSON.parse(temp);
            CurrentBacklog.push(pushElement);
        } else {
            CurrentBacklog.shift();
            var _temp = JSON.stringify(currentInfo);
            var _pushElement = JSON.parse(_temp);
            CurrentBacklog.push(_pushElement);
        }
    }

    function autoPlay(active) {
        if (auto === 1 && active === 'on') {
            var jumpNext = function jumpNext() {
                if (auto === 1) nextSentenceProcessor();
                clearInterval(interval);
            };

            var interval = setInterval(jumpNext, autoWaitTime);
        }
    }
}

// 渐显文字
function showTextArray(textArray, now) {
    showingText = false;
    ReactDOM.render(React.createElement(
        'span',
        null,
        ' '
    ), document.getElementById('SceneText'));
    var elementArray = [];
    var i = 0;
    clearInterval(interval);
    var interval = setInterval(showSingle, textShowWatiTime);
    // console.log("now: "+now+" currentText: "+currentText)
    showingText = true;
    function showSingle() {
        if (!showingText) {
            var textFull = '';
            for (var j = 0; j < textArray.length; j++) {
                textFull = textFull + textArray[j];
            }
            ReactDOM.render(React.createElement(
                'div',
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
                'span',
                { key: i, className: 'singleWord' },
                textArray[i]
            );
            elementArray.push(tempElement);
            if (currentText === now) ReactDOM.render(React.createElement(
                'div',
                null,
                elementArray
            ), document.getElementById('SceneText'));
            i = i + 1;
        }
        if (i > textArray.length && auto !== 1) {
            showingText = false;
        }
        if (i > textArray.length + autoWaitTime / 35 || currentText !== now) {

            if (auto === 1 && currentText === now) {
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
        'span',
        null,
        ' '
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
            'span',
            { key: i, className: 'singleWord' },
            textArray[i]
        );
        elementArray.push(tempElement);
        ReactDOM.render(React.createElement(
            'div',
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

function chooseJumpFun(label) {
    var lab_name = label;
    //find the line of the label:
    var find = false;
    var jmp_sentence = 0;
    for (var i = 0; i < currentScene.length; i++) {
        if (currentScene[i][0] === 'label' && currentScene[i][1] === lab_name) {
            find = true;
            jmp_sentence = i;
        }
    }
    if (find) {
        currentSentence = jmp_sentence;
        nextSentenceProcessor();
        document.getElementById("chooseBox").style.display = "none";
    } else {
        currentSentence = currentSentence + 1;
        nextSentenceProcessor();
        document.getElementById("chooseBox").style.display = "none";
    }
}

// 打开设置
function onSetting() {
    loadCookie();
    var settingInterface = React.createElement(
        'div',
        null,
        React.createElement(
            'div',
            { className: 'singleSettingItem' },
            React.createElement(SettingButtons_font, null),
            React.createElement(SettingButtons_speed, null),
            React.createElement(
                'div',
                { className: "deleteCookie", onClick: function onClick() {
                        showMesModel('你确定要清除缓存吗', '要', '不要', clearCookie);
                    } },
                '\u6E05\u9664\u6240\u6709\u8BBE\u7F6E\u9009\u9879\u4EE5\u53CA\u5B58\u6863'
            ),
            React.createElement(
                'div',
                null,
                '\u672C\u4F5C\u54C1\u7531 WebGAL \u5F3A\u529B\u9A71\u52A8\uFF0C',
                React.createElement(
                    'a',
                    { href: "https://github.com/MakinoharaShoko/WebGAL" },
                    '\u4E86\u89E3 WebGAL'
                ),
                '\u3002'
            ),
            React.createElement('br', null),
            React.createElement(
                'div',
                { className: 'settingItemTitle' },
                '\u6548\u679C\u9884\u89C8'
            )
        )
    );
    document.getElementById("settings").style.display = "flex";
    document.getElementById("bottomBox").style.display = "none";
    ReactDOM.render(settingInterface, document.getElementById("settingItems"));
    ReactDOM.render(React.createElement('div', { id: 'previewDiv' }), document.getElementById('textPreview'));
    showTextPreview('现在预览的是文本框字体大小和播放速度的情况，您可以根据您的观感调整上面的选项。');
}

// 关闭设置
function closeSettings() {
    document.getElementById("settings").style.display = "none";
    document.getElementById("bottomBox").style.display = "flex";
}

// 分支选择
function chooseScene(url) {
    // console.log(url);
    currentInfo["SceneName"] = url;
    var sUrl = "game/scene/" + url;
    getScene(sUrl);
    document.getElementById("chooseBox").style.display = "none";
}

//自动播放
function autoNext() {
    if (auto === 0) {
        autoWaitTime = setAutoWaitTime;
        textShowWatiTime = 35;
        fast = 0;
        auto = 0;
        document.getElementById('fastButton').style.backgroundColor = 'rgba(255,255,255,0)';
        document.getElementById('fastButton').style.color = 'white';
        // console.log("notFast");
        autoWaitTime = setAutoWaitTime;
        auto = 1;
        // console.log("auto");
        document.getElementById('autoButton').style.backgroundColor = 'rgba(255,255,255,0.8)';
        document.getElementById('autoButton').style.color = '#8E354A';
        nextSentenceProcessor();
    } else if (auto === 1) {
        autoWaitTime = setAutoWaitTime;
        auto = 0;
        document.getElementById('autoButton').style.backgroundColor = 'rgba(255,255,255,0)';
        document.getElementById('autoButton').style.color = 'white';
        // console.log("notAuto");
    }
}

// 快进
function fastNext() {
    if (fast === 0) {
        autoWaitTime = setAutoWaitTime;
        auto = 0;
        document.getElementById('autoButton').style.backgroundColor = 'rgba(255,255,255,0)';
        document.getElementById('autoButton').style.color = 'white';
        // console.log("notAuto");
        autoWaitTime = 500;
        textShowWatiTime = 5;
        fast = 1;
        auto = 1;
        // console.log("fast");
        document.getElementById('fastButton').style.backgroundColor = 'rgba(255,255,255,0.8)';
        document.getElementById('fastButton').style.color = '#8E354A';
        nextSentenceProcessor();
    } else if (fast === 1) {
        autoWaitTime = setAutoWaitTime;
        textShowWatiTime = 35;
        fast = 0;
        auto = 0;
        document.getElementById('fastButton').style.backgroundColor = 'rgba(255,255,255,0)';
        document.getElementById('fastButton').style.color = 'white';
        // console.log("notFast");
    }
}

var SettingButtons_font = function (_React$Component) {
    _inherits(SettingButtons_font, _React$Component);

    function SettingButtons_font(props) {
        _classCallCheck(this, SettingButtons_font);

        var _this = _possibleConstructorReturn(this, (SettingButtons_font.__proto__ || Object.getPrototypeOf(SettingButtons_font)).call(this, props));

        _this.state = { buttonState: ['', '', ''] };
        return _this;
    }

    _createClass(SettingButtons_font, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var buttonStateNow = ['', '', ''];
            if (Settings['font_size'] === 'small') {
                buttonStateNow[0] = 'On';
            } else if (Settings['font_size'] === 'medium') {
                buttonStateNow[1] = 'On';
            } else if (Settings['font_size'] === 'large') {
                buttonStateNow[2] = 'On';
            }
            this.setState({
                buttonState: buttonStateNow
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'changeButtonState',
        value: function changeButtonState(i) {
            if (i === 0) {
                Settings['font_size'] = 'small';
                document.getElementById('SceneText').style.fontSize = '150%';
            } else if (i === 1) {
                Settings["font_size"] = 'medium';
                document.getElementById('SceneText').style.fontSize = '200%';
            } else if (i === 2) {
                Settings["font_size"] = 'large';
                document.getElementById('SceneText').style.fontSize = '250%';
            }
            var buttonStateNow = ['', '', ''];
            if (Settings['font_size'] === 'small') {
                buttonStateNow[0] = 'On';
            } else if (Settings['font_size'] === 'medium') {
                buttonStateNow[1] = 'On';
            } else if (Settings['font_size'] === 'large') {
                buttonStateNow[2] = 'On';
            }
            writeCookie();
            this.setState({
                buttonState: buttonStateNow
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return React.createElement(
                'span',
                { className: 'singleSettingItem' },
                React.createElement(
                    'span',
                    { className: 'settingItemTitle' },
                    '\u5B57\u4F53\u5927\u5C0F'
                ),
                React.createElement(
                    'span',
                    { className: 'settingItemButton' + this.state.buttonState[0], onClick: function onClick() {
                            _this2.changeButtonState(0);
                        } },
                    '\u5C0F'
                ),
                React.createElement(
                    'span',
                    { className: 'settingItemButton' + this.state.buttonState[1], onClick: function onClick() {
                            _this2.changeButtonState(1);
                        } },
                    '\u4E2D'
                ),
                React.createElement(
                    'span',
                    { className: 'settingItemButton' + this.state.buttonState[2], onClick: function onClick() {
                            _this2.changeButtonState(2);
                        } },
                    '\u5927'
                )
            );
        }
    }]);

    return SettingButtons_font;
}(React.Component);

var SettingButtons_speed = function (_React$Component2) {
    _inherits(SettingButtons_speed, _React$Component2);

    function SettingButtons_speed(props) {
        _classCallCheck(this, SettingButtons_speed);

        var _this3 = _possibleConstructorReturn(this, (SettingButtons_speed.__proto__ || Object.getPrototypeOf(SettingButtons_speed)).call(this, props));

        _this3.state = { buttonState: ['', '', ''] };
        return _this3;
    }

    _createClass(SettingButtons_speed, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var buttonStateNow = ['', '', ''];
            if (Settings['play_speed'] === 'low') {
                buttonStateNow[0] = 'On';
            } else if (Settings['play_speed'] === 'medium') {
                buttonStateNow[1] = 'On';
            } else if (Settings['play_speed'] === 'fast') {
                buttonStateNow[2] = 'On';
            }
            this.setState({
                buttonState: buttonStateNow
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'changeButtonState',
        value: function changeButtonState(i) {
            if (i === 0) {
                Settings['play_speed'] = 'low';
                textShowWatiTime = 55;
            } else if (i === 1) {
                Settings["play_speed"] = 'medium';
                textShowWatiTime = 35;
            } else if (i === 2) {
                Settings["play_speed"] = 'fast';
                textShowWatiTime = 20;
            }
            var buttonStateNow = ['', '', ''];
            if (Settings['play_speed'] === 'low') {
                buttonStateNow[0] = 'On';
            } else if (Settings['play_speed'] === 'medium') {
                buttonStateNow[1] = 'On';
            } else if (Settings['play_speed'] === 'fast') {
                buttonStateNow[2] = 'On';
            }
            writeCookie();
            this.setState({
                buttonState: buttonStateNow
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            return React.createElement(
                'span',
                { className: 'singleSettingItem' },
                React.createElement(
                    'span',
                    { className: 'settingItemTitle' },
                    '\u64AD\u653E\u901F\u5EA6'
                ),
                React.createElement(
                    'span',
                    { className: 'settingItemButton' + this.state.buttonState[0], onClick: function onClick() {
                            _this4.changeButtonState(0);
                        } },
                    '\u6162'
                ),
                React.createElement(
                    'span',
                    { className: 'settingItemButton' + this.state.buttonState[1], onClick: function onClick() {
                            _this4.changeButtonState(1);
                        } },
                    '\u4E2D'
                ),
                React.createElement(
                    'span',
                    { className: 'settingItemButton' + this.state.buttonState[2], onClick: function onClick() {
                            _this4.changeButtonState(2);
                        } },
                    '\u5FEB'
                )
            );
        }
    }]);

    return SettingButtons_speed;
}(React.Component);

function hideTitle(ifRes) {
    CurrentBacklog = [];
    document.getElementById('Title').style.display = 'none';
    if (ifRes !== 'non-restart') {
        currentInfo["bgm"] = '';
        loadBGM();
        ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage'));
        currentInfo["fig_Name"] = '';
        ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage_left'));
        currentInfo["fig_left"] = '';
        ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage_right'));
        currentInfo["fig_right"] = '';
        getScene("game/scene/start.txt");
        currentInfo["SceneName"] = 'start.txt';
    }
}

function onLoadGame() {
    loadCookie();
    document.getElementById('Load').style.display = 'block';
    ReactDOM.render(React.createElement(LoadMainModel, { PageQty: 15 }), document.getElementById('LoadItems'));
}

function closeLoad() {
    document.getElementById('Load').style.display = 'none';
}

var LoadMainModel = function (_React$Component3) {
    _inherits(LoadMainModel, _React$Component3);

    _createClass(LoadMainModel, [{
        key: 'setCurrentPage',
        value: function setCurrentPage(page) {
            currentLoadPage = page;
            this.setState({
                currentPage: currentLoadPage
            });
            writeCookie();
        }
    }, {
        key: 'loadButtons',
        value: function loadButtons() {
            var _this6 = this;

            this.Buttons = [];

            var _loop4 = function _loop4(i) {
                var temp = React.createElement(
                    'span',
                    { className: 'LoadIndexButton', onClick: function onClick() {
                            _this6.setCurrentPage(i);
                        }, key: i },
                    i + 1
                );
                if (i === currentLoadPage) temp = React.createElement(
                    'span',
                    { className: 'LoadIndexButtonOn', onClick: function onClick() {
                            _this6.setCurrentPage(i);
                        }, key: i },
                    i + 1
                );
                _this6.Buttons.push(temp);
            };

            for (var i = 0; i < this.LoadPageQty; i++) {
                _loop4(i);
            }
        }
    }, {
        key: 'loadSaveButtons',
        value: function loadSaveButtons() {
            var _this7 = this;

            this.SaveButtons = [];

            var _loop5 = function _loop5(i) {
                if (Saves[i]) {
                    var thisButtonName = Saves[i]["showName"];
                    var thisButtonText = Saves[i]["showText"];
                    var temp = React.createElement(
                        'div',
                        { className: 'LoadSingleElement', key: i, onClick: function onClick() {
                                LoadSavedGame(i);
                            } },
                        React.createElement(
                            'div',
                            { className: 'LSE_top' },
                            React.createElement(
                                'span',
                                { className: "LSE_index" },
                                i
                            ),
                            React.createElement(
                                'span',
                                { className: "LSE_name" },
                                thisButtonName
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'LSE_bottom' },
                            thisButtonText
                        )
                    );
                    _this7.SaveButtons.push(temp);
                } else {
                    var _temp2 = React.createElement(
                        'div',
                        { className: 'LoadSingleElement', key: i },
                        '\u7A7A'
                    );
                    _this7.SaveButtons.push(_temp2);
                    // console.log(i)
                }
            };

            for (var i = currentLoadPage * 5 + 1; i <= currentLoadPage * 5 + 5; i++) {
                _loop5(i);
            }
        }
    }]);

    function LoadMainModel(props) {
        _classCallCheck(this, LoadMainModel);

        var _this5 = _possibleConstructorReturn(this, (LoadMainModel.__proto__ || Object.getPrototypeOf(LoadMainModel)).call(this, props));

        _this5.Buttons = [];
        _this5.SaveButtons = [];
        _this5.LoadPageQty = 0;

        _this5.LoadPageQty = props.PageQty;
        _this5.state = {
            currentPage: currentLoadPage
        };
        _this5.loadButtons();
        return _this5;
    }

    _createClass(LoadMainModel, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'render',
        value: function render() {
            this.loadButtons();
            this.loadSaveButtons();
            return React.createElement(
                'div',
                { id: 'LoadMain' },
                React.createElement(
                    'div',
                    { id: 'LoadIndex' },
                    this.Buttons
                ),
                React.createElement(
                    'div',
                    { id: 'LoadButtonList' },
                    this.SaveButtons
                )
            );
        }
    }]);

    return LoadMainModel;
}(React.Component);

function onSaveGame() {
    loadCookie();
    document.getElementById('Save').style.display = 'block';
    ReactDOM.render(React.createElement(SaveMainModel, { PageQty: 15 }), document.getElementById('SaveItems'));
}

function closeSave() {
    document.getElementById('Save').style.display = 'none';
}

var SaveMainModel = function (_React$Component4) {
    _inherits(SaveMainModel, _React$Component4);

    _createClass(SaveMainModel, [{
        key: 'setCurrentPage',
        value: function setCurrentPage(page) {
            currentSavePage = page;
            this.setState({
                currentPage: currentSavePage
            });
            writeCookie();
        }
    }, {
        key: 'loadButtons',
        value: function loadButtons() {
            var _this9 = this;

            this.Buttons = [];

            var _loop6 = function _loop6(i) {
                var temp = React.createElement(
                    'span',
                    { className: 'SaveIndexButton', onClick: function onClick() {
                            _this9.setCurrentPage(i);
                        }, key: i },
                    i + 1
                );
                if (i === currentSavePage) temp = React.createElement(
                    'span',
                    { className: 'SaveIndexButtonOn', onClick: function onClick() {
                            _this9.setCurrentPage(i);
                        }, key: i },
                    i + 1
                );
                _this9.Buttons.push(temp);
            };

            for (var i = 0; i < this.LoadPageQty; i++) {
                _loop6(i);
            }
        }
    }, {
        key: 'loadSaveButtons',
        value: function loadSaveButtons() {
            var _this10 = this;

            this.SaveButtons = [];

            var _loop7 = function _loop7(i) {
                if (Saves[i]) {
                    var thisButtonName = Saves[i]["showName"];
                    var thisButtonText = Saves[i]["showText"];
                    var temp = React.createElement(
                        'div',
                        { className: 'SaveSingleElement', key: i, onClick: function onClick() {
                                _this10.save_onSaved(i);
                            } },
                        React.createElement(
                            'div',
                            { className: 'SSE_top' },
                            React.createElement(
                                'span',
                                { className: "SSE_index" },
                                i
                            ),
                            React.createElement(
                                'span',
                                { className: "SSE_name" },
                                thisButtonName
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'SSE_bottom' },
                            thisButtonText
                        )
                    );
                    _this10.SaveButtons.push(temp);
                } else {
                    var _temp3 = React.createElement(
                        'div',
                        { className: 'SaveSingleElement', key: i, onClick: function onClick() {
                                _this10.save_NonSaved(i);
                            } },
                        '\u7A7A'
                    );
                    _this10.SaveButtons.push(_temp3);
                    // console.log(i)
                }
            };

            for (var i = currentSavePage * 5 + 1; i <= currentSavePage * 5 + 5; i++) {
                _loop7(i);
            }
        }
    }, {
        key: 'save_NonSaved',
        value: function save_NonSaved(index) {
            saveGame(index);
            writeCookie();
            this.setState({
                currentPage: currentSavePage
            });
        }
    }, {
        key: 'save_onSaved',
        value: function save_onSaved(index) {
            showMesModel('你要覆盖这个存档吗', '覆盖', '不', function () {
                saveGame(index);
                writeCookie();
                closeSave();
            });
            this.setState({
                currentPage: currentSavePage
            });
        }
    }]);

    function SaveMainModel(props) {
        _classCallCheck(this, SaveMainModel);

        var _this8 = _possibleConstructorReturn(this, (SaveMainModel.__proto__ || Object.getPrototypeOf(SaveMainModel)).call(this, props));

        _this8.Buttons = [];
        _this8.SaveButtons = [];
        _this8.LoadPageQty = 0;

        _this8.LoadPageQty = props.PageQty;
        _this8.state = {
            currentPage: currentSavePage
        };
        _this8.loadButtons();
        return _this8;
    }

    _createClass(SaveMainModel, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'render',
        value: function render() {
            this.loadButtons();
            this.loadSaveButtons();
            return React.createElement(
                'div',
                { id: 'SaveMain' },
                React.createElement(
                    'div',
                    { id: 'SaveIndex' },
                    this.Buttons
                ),
                React.createElement(
                    'div',
                    { id: 'SaveButtonList' },
                    this.SaveButtons
                )
            );
        }
    }]);

    return SaveMainModel;
}(React.Component);

function showMesModel(Title, Left, Right, func) {
    document.getElementById('MesModel').style.display = 'block';
    var element = React.createElement(
        'div',
        { className: 'MesMainWindow' },
        React.createElement(
            'div',
            { className: "MesTitle" },
            Title
        ),
        React.createElement(
            'div',
            { className: 'MesChooseContainer' },
            React.createElement(
                'div',
                { className: 'MesChoose', onClick: function onClick() {
                        func();document.getElementById('MesModel').style.display = 'none';
                    } },
                Left
            ),
            React.createElement(
                'div',
                { className: 'MesChoose', onClick: function onClick() {
                        document.getElementById('MesModel').style.display = 'none';
                    } },
                Right
            )
        )
    );
    ReactDOM.render(element, document.getElementById('MesModel'));
}

function exit() {
    showMesModel('你确定要退出吗', '退出', '留在本页', function () {
        window.close();
    });
}

function Title() {
    showMesModel('要返回到标题界面吗', '是', '不要', function () {
        document.getElementById('Title').style.display = 'block';
    });
}

function continueGame() {
    if (currentScene === '') {
        getScene("game/scene/start.txt");
        currentInfo["SceneName"] = 'start.txt';
    }
    document.getElementById('Title').style.display = 'none';
}

function loadBGM() {
    var bgmName = currentInfo["bgm"];
    if (bgmName === '' || bgmName === 'none') {
        ReactDOM.render(React.createElement('div', null), document.getElementById("bgm"));
        return;
    }
    var url = "./game/bgm/" + bgmName;
    var audio = React.createElement('audio', { src: url, id: "currentBGM", loop: 'loop' });
    ReactDOM.render(audio, document.getElementById("bgm"));
    var playControl = document.getElementById("currentBGM");
    playControl.currentTime = 0;
    playControl.volume = 0.25;
    playControl.play();
}

function playVocal() {
    var vocalName = currentInfo["vocal"];
    var url = './game/vocal/' + vocalName;
    var vocal = React.createElement('audio', { src: url, id: "currentVocal" });
    ReactDOM.render(vocal, document.getElementById('vocal'));
    var VocalControl = document.getElementById("currentVocal");
    VocalControl.currentTime = 0;
    VocalControl.play();
}

function showBacklog() {
    document.getElementById('backlog').style.display = 'block';
    document.getElementById('bottomBox').style.display = 'none';
    var showBacklogList = [];

    var _loop8 = function _loop8(i) {
        var temp = React.createElement(
            'div',
            { className: 'backlog_singleElement', key: i, onClick: function onClick() {
                    jumpFromBacklog(i);
                } },
            React.createElement(
                'div',
                { className: "backlog_name" },
                CurrentBacklog[i].showName
            ),
            React.createElement(
                'div',
                { className: "backlog_text" },
                CurrentBacklog[i].showText
            )
        );
        showBacklogList.push(temp);
    };

    for (var i = 0; i < CurrentBacklog.length; i++) {
        _loop8(i);
    }
    ReactDOM.render(React.createElement(
        'div',
        null,
        showBacklogList
    ), document.getElementById('backlogContent'));
}

function jumpFromBacklog(index) {
    closeBacklog();
    var save = CurrentBacklog[index];
    for (var i = CurrentBacklog.length - 1; i > index; i--) {
        CurrentBacklog.pop();
    }
    //get Scene:
    var url = 'game/scene/';
    url = url + save['SceneName'];
    currentScene = '';
    currentText = 0;

    var getScReq = null;
    getScReq = new XMLHttpRequest();

    if (getScReq != null) {
        getScReq.open("get", url, true);
        getScReq.send();
        getScReq.onreadystatechange = doResult; //设置回调函数
    }
    function doResult() {
        if (getScReq.readyState === 4) {
            //4表示执行完成
            if (getScReq.status === 200) {
                //200表示执行成功
                currentScene = getScReq.responseText;
                currentScene = currentScene.split('\n');
                for (var _i5 = 0; _i5 < currentScene.length; _i5++) {
                    var tempSentence = currentScene[_i5].split(";")[0];
                    var commandLength = tempSentence.split(":")[0].length;
                    var _command2 = currentScene[_i5].split(":")[0];
                    var content = tempSentence.slice(commandLength + 1);
                    currentScene[_i5] = currentScene[_i5].split(":");
                    currentScene[_i5][0] = _command2;
                    currentScene[_i5][1] = content;
                }
                // console.log('Read scene complete.');
                // console.log(currentScene);
                currentSentence = save["SentenceID"];
                currentText = save["SentenceID"];
                // console.log("start:"+currentSentence)

                //load saved scene:
                var command = save["command"];
                // console.log('readSaves:'+command)
                if (save["bg_Name"] !== '') document.getElementById('mainBackground').style.backgroundImage = "url('game/background/" + save["bg_Name"] + "')";
                if (save["fig_Name"] === '' || save["fig_Name"] === 'none') {
                    ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage'));
                } else {
                    var pUrl = "game/figure/" + save["fig_Name"];
                    var changedP = React.createElement('img', { src: pUrl, alt: 'figure', className: 'p_center' });
                    // console.log('now changing person');
                    ReactDOM.render(changedP, document.getElementById('figureImage'));
                }
                if (save["fig_Name_left"] === '' || save["fig_Name_left"] === 'none') {
                    ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage_left'));
                } else {
                    var _pUrl8 = "game/figure/" + save["fig_Name_left"];
                    var _changedP8 = React.createElement('img', { src: _pUrl8, alt: 'figure', className: 'p_center' });
                    // console.log('now changing person');
                    ReactDOM.render(_changedP8, document.getElementById('figureImage_left'));
                }
                if (save["fig_Name_right"] === '' || save["fig_Name_right"] === 'none') {
                    ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage_right'));
                } else {
                    var _pUrl9 = "game/figure/" + save["fig_Name_right"];
                    var _changedP9 = React.createElement('img', { src: _pUrl9, alt: 'figure', className: 'p_center' });
                    // console.log('now changing person');
                    ReactDOM.render(_changedP9, document.getElementById('figureImage_right'));
                }

                if (command === 'choose') {
                    (function () {
                        document.getElementById('chooseBox').style.display = 'flex';
                        var chooseItems = save["choose"];
                        chooseItems = chooseItems.split("}")[0];
                        chooseItems = chooseItems.split("{")[1];
                        var selection = chooseItems.split(',');
                        for (var _i6 = 0; _i6 < selection.length; _i6++) {
                            selection[_i6] = selection[_i6].split(":");
                        }
                        var elements = [];

                        var _loop9 = function _loop9(_i7) {
                            var temp = React.createElement(
                                'div',
                                { className: 'singleChoose', key: _i7, onClick: function onClick() {
                                        chooseScene(selection[_i7][1]);
                                    } },
                                selection[_i7][0]
                            );
                            elements.push(temp);
                        };

                        for (var _i7 = 0; _i7 < selection.length; _i7++) {
                            _loop9(_i7);
                        }
                        ReactDOM.render(React.createElement(
                            'div',
                            null,
                            elements
                        ), document.getElementById('chooseBox'));
                        // return;
                    })();
                }
                var changedName = React.createElement(
                    'span',
                    null,
                    save["showName"]
                );
                var textArray = save["showText"].split("");
                // let changedText = <p>{processSentence(currentSentence)['text']}</p>
                ReactDOM.render(changedName, document.getElementById('pName'));
                currentText = save["currentText"];
                currentInfo["vocal"] = save['vocal'];
                if (currentInfo['bgm'] !== save['bgm']) {
                    currentInfo['bgm'] = save['bgm'];
                    loadBGM();
                }
                playVocal();
                showTextArray(textArray, currentText);
                // currentText = currentText + 1;

                // currentSentence = currentSentence+1;
            }
        }
    }
}

function closeBacklog() {
    document.getElementById('backlog').style.display = 'none';
    document.getElementById('bottomBox').style.display = 'flex';
}

function isMobile() {
    var info = navigator.userAgent;
    var agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod", "iPad"];
    for (var i = 0; i < agents.length; i++) {
        if (info.indexOf(agents[i]) >= 0) return true;
    }
    return false;
}

var hideTextStatus = false;
function hideTextBox() {
    if (!hideTextStatus) {
        document.getElementById('bottomBox').style.display = 'none';
        hideTextStatus = true;
    }
}
function clickOnBack() {
    if (hideTextStatus) {
        document.getElementById('bottomBox').style.display = 'flex';
        hideTextStatus = false;
    } else {
        nextSentenceProcessor();
    }
}

function ren_miniPic() {
    document.getElementById('ren_test').style.display = 'block';
    var backUrl = "./game/background/" + currentInfo["bg_Name"];
    var leftFigUrl = "./game/figure/" + currentInfo["fig_Name_left"];
    var FigUrl = "./game/figure/" + currentInfo["fig_Name"];
    var rightFigUrl = "./game/figure/" + currentInfo["fig_Name_right"];
    var renderList = [];
    if (currentInfo["fig_Name_left"] !== 'none' && currentInfo["fig_Name_left"] !== '') {
        var tempIn = React.createElement(
            'div',
            { id: "mini_fig_left", className: "mini_fig" },
            React.createElement('img', { src: leftFigUrl, alt: "mini_fig", className: "mini_fig_pic" })
        );
        renderList.push(tempIn);
    }
    if (currentInfo["fig_Name"] !== 'none' && currentInfo["fig_Name"] !== '') {
        var _tempIn = React.createElement(
            'div',
            { id: "mini_fig_center", className: "mini_fig" },
            React.createElement('img', { src: FigUrl, alt: "mini_fig", className: "mini_fig_pic" })
        );
        renderList.push(_tempIn);
    }
    if (currentInfo["fig_Name_right"] !== 'none' && currentInfo["fig_Name_right"] !== '') {
        var _tempIn2 = React.createElement(
            'div',
            { id: "mini_fig_right", className: "mini_fig" },
            React.createElement('img', { src: rightFigUrl, alt: "mini_fig", className: "mini_fig_pic" })
        );
        renderList.push(_tempIn2);
    }
    var element = React.createElement(
        'div',
        { id: "miniPic" },
        renderList
    );
    ReactDOM.render(element, document.getElementById('ren_test'));
    document.getElementById('ren_test').style.backgroundImage = "url('" + backUrl + "')";
}

// 禁止F12
// document.onkeydown=function(e){
//         if(e.keyCode === 123){
//             e.returnValue=false
//             return false
//         }
//     }
// 禁止右键菜单以及选择文字
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
document.addEventListener('selectstart', function (e) {
    e.preventDefault();
});