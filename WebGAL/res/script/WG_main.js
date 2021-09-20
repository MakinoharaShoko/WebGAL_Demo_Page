var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var currentScene = '';
var currentSceneIndex = 0;
var currentSentence = 0;
var currentText = 0;
function getScene(url) {
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
                    currentScene[i] = currentScene[i].split(";")[0];
                    currentScene[i] = currentScene[i].split(":");
                }
                console.log('Read scene complete.');
                // console.log(currentScene);
                currentSentence = 0;
                console.log("start:" + currentSentence);
                nextSentenceProcessor();
            }
        }
    }
}

window.onload = function () {
    getScene("game/scene/start.txt");
};

function processSentence(i) {
    if (i < currentScene.length) return { name: currentScene[i][0], text: currentScene[i][1] };
}

function nextSentenceProcessor() {
    if (currentSentence >= currentScene.length) {
        return;
    }
    var thisSentence = currentScene[currentSentence];
    var command = thisSentence[0];
    console.log(command);
    if (command === 'changeBG') {
        // console.log('Now change background to ' + "url('/game/background/" + thisSentence[1] + "')");
        document.getElementById('mainBackground').style.backgroundImage = "url('game/background/" + thisSentence[1] + "')";
    } else if (command === 'changeP') {
        if (thisSentence[1] === 'none') {
            ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage'));
        } else {
            var pUrl = "game/figure/" + thisSentence[1];
            var changedP = React.createElement('img', { src: pUrl, alt: 'figure', className: 'p_center' });
            // console.log('now changing person');
            ReactDOM.render(changedP, document.getElementById('figureImage'));
        }
    } else if (command === 'changeP_next') {
        if (thisSentence[1] === 'none') {
            ReactDOM.render(React.createElement('div', null), document.getElementById('figureImage'));
        } else {
            var _pUrl = "game/figure/" + thisSentence[1];
            var _changedP = React.createElement('img', { src: _pUrl, alt: 'figure', className: 'p_center' });
            // console.log('now changing person');
            ReactDOM.render(_changedP, document.getElementById('figureImage'));
        }
        currentSentence = currentSentence + 1;
        nextSentenceProcessor();
        return;
    } else if (command === 'changeBG_next') {
        document.getElementById('mainBackground').style.backgroundImage = "url('game/background/" + thisSentence[1] + "')";
        currentSentence = currentSentence + 1;
        nextSentenceProcessor();
        return;
    } else if (command === 'changeScene') {
        var sUrl = "game/scene/" + thisSentence[1];
        getScene(sUrl);
        return;
    } else if (command === 'choose') {
        var _ret = function () {
            document.getElementById('chooseBox').style.display = 'flex';
            var chooseItems = '';
            for (var i = 1; i < thisSentence.length; i++) {
                chooseItems = chooseItems + thisSentence[i] + ':';
            }
            console.log(chooseItems);
            chooseItems = chooseItems.split("}")[0];
            chooseItems = chooseItems.split("{")[1];
            console.log(chooseItems);
            var selection = chooseItems.split(',');
            console.log(selection);
            for (var _i = 0; _i < selection.length; _i++) {
                selection[_i] = selection[_i].split(":");
            }
            var elements = [];
            console.log(selection);

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
            return {
                v: void 0
            };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    } else {
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
    }
    currentSentence = currentSentence + 1;
}

function showTextArray(textArray, now) {
    ReactDOM.render(React.createElement(
        'span',
        null,
        ' '
    ), document.getElementById('SceneText'));
    var elementArray = [];
    var i = 0;
    clearInterval(interval);
    var interval = setInterval(showSingle, 35);
    console.log("now: " + now + " currentText: " + currentText);
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
        if (i > textArray.length && currentText !== now) {
            clearInterval(interval);
        }
    }
}

function onSetting() {
    var settingInterface = React.createElement(
        'div',
        null,
        React.createElement(
            'div',
            { className: 'singleSettingItem' },
            React.createElement(
                'span',
                { className: 'settingItemTitle' },
                '\u5B57\u4F53\u5927\u5C0F'
            )
        ),
        React.createElement(
            'div',
            { className: 'singleSettingItem' },
            React.createElement(
                'span',
                { className: 'settingItemTitle' },
                '\u6587\u5B57\u663E\u793A\u901F\u5EA6'
            )
        ),
        React.createElement(
            'div',
            { className: 'singleSettingItem' },
            React.createElement(
                'span',
                { className: 'settingItemTitle' },
                '\u97F3\u91CF\u8C03\u8282'
            )
        ),
        React.createElement(
            'div',
            { className: 'singleSettingItem' },
            React.createElement(
                'span',
                { className: 'settingItemTitle' },
                '\u4E2D\u65AD\u8BED\u97F3\u8BBE\u7F6E'
            )
        ),
        React.createElement(
            'div',
            { className: 'singleSettingItem' },
            React.createElement(
                'span',
                { className: 'settingItemTitle' },
                '\u5B57\u4F53\u9009\u62E9'
            )
        )
    );
    document.getElementById("settings").style.display = "flex";
    document.getElementById("bottomBox").style.display = "none";
    ReactDOM.render(settingInterface, document.getElementById("settingItems"));
}

function closeSettings() {
    document.getElementById("settings").style.display = "none";
    document.getElementById("bottomBox").style.display = "flex";
}

function chooseScene(url) {
    console.log(url);
    var sUrl = "game/scene/" + url;
    getScene(sUrl);
    document.getElementById("chooseBox").style.display = "none";
}