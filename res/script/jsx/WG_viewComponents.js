var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// -------- 导入导出存档 --------
var ImporterExporter = function (_React$Component) {
    _inherits(ImporterExporter, _React$Component);

    function ImporterExporter() {
        _classCallCheck(this, ImporterExporter);

        var _this = _possibleConstructorReturn(this, (ImporterExporter.__proto__ || Object.getPrototypeOf(ImporterExporter)).call(this));

        _this.dummyA = null;
        _this.dummyInput = null;
        return _this;
    }

    _createClass(ImporterExporter, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.dummyA = document.querySelector('a#dummy-saves-exporter');
            this.dummyInput = document.querySelector('input#dummy-saves-importer');
        }
    }, {
        key: 'importSaves',
        value: function importSaves(ev) {
            var file = ev.target.files[0];
            var reader = new FileReader();
            reader.onload = function (evR) {
                var saves = evR.target.result;
                localStorage.setItem('WebGAL', saves);
                loadCookie();
                window.location.reload(); // dirty: 强制刷新 UI
            };
            reader.readAsText(file, 'UTF-8');
        }
    }, {
        key: 'exportSaves',
        value: function exportSaves() {
            var saves = localStorage.getItem('WebGAL');
            if (saves === null) {
                // no saves
                return false;
            }
            var blob = new Blob([saves], { type: 'application/json' });
            var blobUrl = URL.createObjectURL(blob);
            URL.revokeObjectURL(this.dummyA.href);
            this.dummyA.href = blobUrl;
            this.dummyA.download = 'saves.json';
            this.dummyA.click();
            return true;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return React.createElement(
                'div',
                { className: 'importer-exporter' },
                React.createElement(
                    'span',
                    { className: 'label-saves-exporter', onClick: function onClick() {
                            _this2.exportSaves();
                        } },
                    '\u5BFC\u51FA\u5B58\u6863'
                ),
                React.createElement('a', { target: '_blank', id: 'dummy-saves-exporter', style: { display: "none" } }),
                React.createElement(
                    'span',
                    { className: 'label-saves-importer', onClick: function onClick() {
                            _this2.dummyInput.click();
                        } },
                    '\u5BFC\u5165\u5B58\u6863'
                ),
                React.createElement('input', { type: 'file', id: 'dummy-saves-importer', style: { display: "none" }, onChange: this.importSaves })
            );
        }
    }, {
        key: 'checkSyntax',
        value: function checkSyntax(text) {
            try {
                var json = JSON.parse(text);
            } catch (error) {
                return false;
            }
            return true;
        }
    }]);

    return ImporterExporter;
}(React.Component);

function ren_miniPic(i) {
    var leftFigUrl = "./game/figure/" + Saves[i]["fig_Name_left"];
    var FigUrl = "./game/figure/" + Saves[i]["fig_Name"];
    var rightFigUrl = "./game/figure/" + Saves[i]["fig_Name_right"];
    var renderList = [];
    if (Saves[i]["fig_Name_left"] !== 'none' && Saves[i]["fig_Name_left"] !== '') {
        var tempIn = React.createElement(
            'span',
            { className: "mini_fig mini_fig_left" },
            React.createElement('img', { src: leftFigUrl, alt: "mini_fig", className: "mini_fig_pic" })
        );
        renderList.push(tempIn);
    }
    if (Saves[i]["fig_Name"] !== 'none' && Saves[i]["fig_Name"] !== '') {
        var _tempIn = React.createElement(
            'span',
            { className: "mini_fig mini_fig_center" },
            React.createElement('img', { src: FigUrl, alt: "mini_fig", className: "mini_fig_pic" })
        );
        renderList.push(_tempIn);
    }
    if (Saves[i]["fig_Name_right"] !== 'none' && Saves[i]["fig_Name_right"] !== '') {
        var _tempIn2 = React.createElement(
            'span',
            { className: "mini_fig mini_fig_right" },
            React.createElement('img', { src: rightFigUrl, alt: "mini_fig", className: "mini_fig_pic" })
        );
        renderList.push(_tempIn2);
    }
    var element = React.createElement(
        'div',
        { id: "ren_SE" + i, className: "miniPic" },
        renderList
    );
    return element;
}

var SettingButtons_font = function (_React$Component2) {
    _inherits(SettingButtons_font, _React$Component2);

    function SettingButtons_font(props) {
        _classCallCheck(this, SettingButtons_font);

        var _this3 = _possibleConstructorReturn(this, (SettingButtons_font.__proto__ || Object.getPrototypeOf(SettingButtons_font)).call(this, props));

        _this3.state = { buttonState: ['', '', ''] };
        return _this3;
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
            var _this4 = this;

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
                            _this4.changeButtonState(0);
                        } },
                    '\u5C0F'
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
                    '\u5927'
                )
            );
        }
    }]);

    return SettingButtons_font;
}(React.Component);

var SettingButtons_speed = function (_React$Component3) {
    _inherits(SettingButtons_speed, _React$Component3);

    function SettingButtons_speed(props) {
        _classCallCheck(this, SettingButtons_speed);

        var _this5 = _possibleConstructorReturn(this, (SettingButtons_speed.__proto__ || Object.getPrototypeOf(SettingButtons_speed)).call(this, props));

        _this5.state = { buttonState: ['', '', ''] };
        return _this5;
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
            var _this6 = this;

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
                            _this6.changeButtonState(0);
                        } },
                    '\u6162'
                ),
                React.createElement(
                    'span',
                    { className: 'settingItemButton' + this.state.buttonState[1], onClick: function onClick() {
                            _this6.changeButtonState(1);
                        } },
                    '\u4E2D'
                ),
                React.createElement(
                    'span',
                    { className: 'settingItemButton' + this.state.buttonState[2], onClick: function onClick() {
                            _this6.changeButtonState(2);
                        } },
                    '\u5FEB'
                )
            );
        }
    }]);

    return SettingButtons_speed;
}(React.Component);

var LoadMainModel = function (_React$Component4) {
    _inherits(LoadMainModel, _React$Component4);

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
            var _this8 = this;

            this.Buttons = [];

            var _loop = function _loop(i) {
                var temp = React.createElement(
                    'span',
                    { className: 'LoadIndexButton LS_indexButton', onClick: function onClick() {
                            _this8.setCurrentPage(i);
                        }, key: i },
                    i + 1
                );
                if (i === currentLoadPage) temp = React.createElement(
                    'span',
                    { className: 'LoadIndexButtonOn LS_indexButtonOn', onClick: function onClick() {
                            _this8.setCurrentPage(i);
                        }, key: i },
                    i + 1
                );
                _this8.Buttons.push(temp);
            };

            for (var i = 0; i < this.LoadPageQty; i++) {
                _loop(i);
            }
        }
    }, {
        key: 'loadSaveButtons',
        value: function loadSaveButtons() {
            var _this9 = this;

            this.SaveButtons = [];

            var _loop2 = function _loop2(i) {
                if (Saves[i]) {
                    var thisButtonName = Saves[i]["showName"];
                    var thisButtonText = Saves[i]["showText"];
                    var miniPic = ren_miniPic(i);
                    var backUrl = "game/background/" + Saves[i]["bg_Name"];
                    var temp = React.createElement(
                        'div',
                        { className: 'LoadSingleElement LS_singleElement', key: i, onClick: function onClick() {
                                LoadSavedGame(i);
                            } },
                        React.createElement(
                            'div',
                            { className: "ren", key: i, style: { backgroundImage: 'url(' + backUrl + ')' } },
                            miniPic
                        ),
                        React.createElement(
                            'div',
                            null,
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
                        )
                    );
                    _this9.SaveButtons.push(temp);
                } else {
                    var _temp = React.createElement(
                        'div',
                        { className: 'LoadSingleElement LS_singleElement', key: i },
                        '\u7A7A'
                    );
                    _this9.SaveButtons.push(_temp);
                    // console.log(i)
                }
            };

            for (var i = currentLoadPage * 6 + 1; i <= currentLoadPage * 6 + 6; i++) {
                _loop2(i);
            }
        }
    }]);

    function LoadMainModel(props) {
        _classCallCheck(this, LoadMainModel);

        var _this7 = _possibleConstructorReturn(this, (LoadMainModel.__proto__ || Object.getPrototypeOf(LoadMainModel)).call(this, props));

        _this7.Buttons = [];
        _this7.SaveButtons = [];
        _this7.LoadPageQty = 0;

        _this7.LoadPageQty = props.PageQty;
        _this7.state = {
            currentPage: currentLoadPage
        };
        _this7.loadButtons();
        return _this7;
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
                { id: 'LoadMain', className: "LS_renderMain" },
                React.createElement(
                    'div',
                    { id: 'LoadIndex', className: "LS_Index" },
                    this.Buttons
                ),
                React.createElement(
                    'div',
                    { id: 'LoadButtonList', className: "LS_ButtonList" },
                    this.SaveButtons
                )
            );
        }
    }]);

    return LoadMainModel;
}(React.Component);

var SaveMainModel = function (_React$Component5) {
    _inherits(SaveMainModel, _React$Component5);

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
            var _this11 = this;

            this.Buttons = [];

            var _loop3 = function _loop3(i) {
                var temp = React.createElement(
                    'span',
                    { className: 'SaveIndexButton LS_indexButton', onClick: function onClick() {
                            _this11.setCurrentPage(i);
                        }, key: i },
                    i + 1
                );
                if (i === currentSavePage) temp = React.createElement(
                    'span',
                    { className: 'SaveIndexButtonOn LS_indexButtonOn', onClick: function onClick() {
                            _this11.setCurrentPage(i);
                        }, key: i },
                    i + 1
                );
                _this11.Buttons.push(temp);
            };

            for (var i = 0; i < this.LoadPageQty; i++) {
                _loop3(i);
            }
        }
    }, {
        key: 'loadSaveButtons',
        value: function loadSaveButtons() {
            var _this12 = this;

            this.SaveButtons = [];
            this.ren_bg_list = [];

            var _loop4 = function _loop4(i) {
                if (Saves[i]) {
                    var thisButtonName = Saves[i]["showName"];
                    var thisButtonText = Saves[i]["showText"];
                    var miniPic = ren_miniPic(i);
                    var backUrl = "game/background/" + Saves[i]["bg_Name"];
                    var temp = React.createElement(
                        'div',
                        { className: 'SaveSingleElement LS_singleElement', key: i, onClick: function onClick() {
                                _this12.save_onSaved(i);
                            } },
                        React.createElement(
                            'div',
                            { className: "ren", key: i, style: { backgroundImage: 'url(' + backUrl + ')' } },
                            miniPic
                        ),
                        React.createElement(
                            'div',
                            null,
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
                        )
                    );
                    _this12.SaveButtons.push(temp);
                } else {
                    var _temp2 = React.createElement(
                        'div',
                        { className: 'SaveSingleElement LS_singleElement', key: i, onClick: function onClick() {
                                _this12.save_NonSaved(i);
                            } },
                        '\u7A7A'
                    );
                    _this12.SaveButtons.push(_temp2);
                    // console.log(i)
                }
            };

            for (var i = currentSavePage * 6 + 1; i <= currentSavePage * 6 + 6; i++) {
                _loop4(i);
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

        var _this10 = _possibleConstructorReturn(this, (SaveMainModel.__proto__ || Object.getPrototypeOf(SaveMainModel)).call(this, props));

        _this10.Buttons = [];
        _this10.SaveButtons = [];
        _this10.LoadPageQty = 0;
        _this10.ren_bg_list = [];

        _this10.LoadPageQty = props.PageQty;
        _this10.state = {
            currentPage: currentSavePage
        };
        _this10.loadButtons();
        return _this10;
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
                { id: 'SaveMain', className: "LS_renderMain" },
                React.createElement(
                    'div',
                    { id: 'SaveIndex', className: "LS_Index" },
                    this.Buttons
                ),
                React.createElement(
                    'div',
                    { id: 'SaveButtonList', className: "LS_ButtonList" },
                    this.SaveButtons
                )
            );
        }
    }]);

    return SaveMainModel;
}(React.Component);