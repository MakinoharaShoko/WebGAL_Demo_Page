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
        SceneName: '',
        SentenceID: 0,
        bg_Name: '',
        fig_Name: '',
        showText: '',
        showName: '',
        command: '',
        choose: '',
        currentText: 0
    };
    var onTextPreview = 0;
}

// 初始化存档系统
var Saves = [];

//初始化需要记录到cookie的变量
var currentSavePage = 0;
var currentLoadPage = 0;

// 初始化设置表
var Settings = {
    font_size: 'medium',
    play_speed: 'medium'
};

function loadCookie() {
    if (document.cookie) {
        // let pre_process = document.cookie;
        // let fst = pre_process.split(';')[0];
        // let scd = document.cookie.slice(fst.length+1);
        var data = JSON.parse(document.cookie);
        Saves = data.SavedGame;
        currentSavePage = data.SP;
        currentLoadPage = data.LP;
        Settings = data.cSettings;
    }
}

function writeCookie() {
    var expire = new Date(new Date().getTime() + 20000 * 24 * 60 * 60000); //有效期20000天
    expire = ";expires=" + expire.toGMTString();
    var toCookie = {
        SavedGame: Saves,
        SP: currentSavePage,
        LP: currentLoadPage,
        cSettings: Settings
    };
    console.log(JSON.stringify(toCookie) + expire);
    document.cookie = JSON.stringify(toCookie) + expire;
}

function clearCookie() {
    var toCookie = {
        SavedGame: [],
        SP: 0,
        LP: 0,
        cSettings: {
            font_size: 'medium',
            play_speed: 'medium'
        }
    };
    document.cookie = JSON.stringify(toCookie);
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
                if (save["fig_Name"] === '') {
                    ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage'));
                } else {
                    var pUrl = "game/figure/" + save["fig_Name"];
                    var changedP = React.createElement('img', { src: pUrl, alt: 'figure', className: 'p_center' });
                    // console.log('now changing person');
                    ReactDOM.render(changedP, document.getElementById('figureImage'));
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
                showTextArray(textArray, currentText);
                // currentText = currentText + 1;

                // currentSentence = currentSentence+1;
            }
        }
    }
}

// 保存当前游戏状态
function saveGame(index) {
    var tempInfo = JSON.stringify(currentInfo);
    Saves[index] = JSON.parse(tempInfo);
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
    if (i < currentScene.length) return { name: currentScene[i][0], text: currentScene[i][1] };
}

// 读取下一条脚本
function nextSentenceProcessor() {

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
    } else if (command === 'changeP_next') {
        if (thisSentence[1] === 'none') {
            ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage'));
            currentInfo["fig_Name"] = thisSentence[1];
        } else {
            var _pUrl = "game/figure/" + thisSentence[1];
            var _changedP = React.createElement('img', { src: _pUrl, alt: 'figure', className: 'p_center' });
            // console.log('now changing person');
            ReactDOM.render(_changedP, document.getElementById('figureImage'));
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
    } else {
        currentInfo["command"] = processSentence(currentSentence)['name'];
        currentInfo["showName"] = processSentence(currentSentence)['name'];
        currentInfo["showText"] = processSentence(currentSentence)['text'];
        var changedName = React.createElement(
            'span',
            null,
            processSentence(currentSentence)['name']
        );
        var textArray = processSentence(currentSentence)['text'].split("");
        // let changedText = <p>{processSentence(currentSentence)['text']}</p>
        ReactDOM.render(changedName, document.getElementById('pName'));
        showTextArray(textArray, currentText + 1);
        currentText = currentText + 1;
        currentInfo["currentText"] = currentText;
    }
    currentSentence = currentSentence + 1;
    currentInfo["SentenceID"] = currentSentence;

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
    function showSingle() {
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
        if (i > textArray.length + autoWaitTime / 35 || currentText !== now) {
            clearInterval(interval);
            if (auto === 1 && currentText === now) {
                nextSentenceProcessor();
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
                'div',
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
                'div',
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
    document.getElementById('Title').style.display = 'none';
    if (ifRes !== 'non-restart') {
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

            var _loop3 = function _loop3(i) {
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
                _loop3(i);
            }
        }
    }, {
        key: 'loadSaveButtons',
        value: function loadSaveButtons() {
            var _this7 = this;

            this.SaveButtons = [];

            var _loop4 = function _loop4(i) {
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
                    var _temp = React.createElement(
                        'div',
                        { className: 'LoadSingleElement', key: i },
                        '\u7A7A'
                    );
                    _this7.SaveButtons.push(_temp);
                    // console.log(i)
                }
            };

            for (var i = currentLoadPage * 5 + 1; i <= currentLoadPage * 5 + 5; i++) {
                _loop4(i);
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

            var _loop5 = function _loop5(i) {
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
                _loop5(i);
            }
        }
    }, {
        key: 'loadSaveButtons',
        value: function loadSaveButtons() {
            var _this10 = this;

            this.SaveButtons = [];

            var _loop6 = function _loop6(i) {
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
                    var _temp2 = React.createElement(
                        'div',
                        { className: 'SaveSingleElement', key: i, onClick: function onClick() {
                                _this10.save_NonSaved(i);
                            } },
                        '\u7A7A'
                    );
                    _this10.SaveButtons.push(_temp2);
                    // console.log(i)
                }
            };

            for (var i = currentSavePage * 5 + 1; i <= currentSavePage * 5 + 5; i++) {
                _loop6(i);
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