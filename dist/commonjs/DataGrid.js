"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var providers_1 = require("./providers");
var components_1 = require("./components");
var utils_1 = require("./utils");
var DataGrid = /** @class */ (function (_super) {
    __extends(DataGrid, _super);
    function DataGrid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rootObject = {};
        _this.rootNode = React.createRef();
        _this.clipBoardNode = React.createRef();
        _this.state = {
            mounted: false,
            calculatedHeight: undefined,
        };
        /**
         * You must execute setRootState only once in the child component.
         * otherwise you will fall into a trap.
         * @param {DataGridRootState} state
         */
        _this.setRootState = function (state) {
            _this.setState(state);
        };
        _this.getRootState = function () {
            return _this.state;
        };
        _this.getOptions = function (options) {
            return utils_1.mergeAll(true, __assign({}, DataGrid.defaultOptions), options);
        };
        _this.getProviderProps = function (prevState) {
            var _a = _this.props, _b = _a.columns, columns = _b === void 0 ? [] : _b, footSum = _a.footSum;
            var _c = prevState.options, options = _c === void 0 ? {} : _c;
            var _d = options.frozenColumnIndex, frozenColumnIndex = _d === void 0 ? DataGrid.defaultOptions.frozenColumnIndex || 0 : _d, _e = options.body, optionsBody = _e === void 0 ? DataGrid.defaultBody : _e;
            var _f = optionsBody.columnHeight, columnHeight = _f === void 0 ? 0 : _f;
            // StoreProvider에 전달해야 하는 상태를 newState에 담는 작업을 시작합니다.
            var newState = __assign({}, prevState);
            var newStyle = {};
            // options.showRowSelector 체크
            if (newState.rowSelector) {
                if (typeof newState.rowSelector.show === 'undefined') {
                    newState.rowSelector.show = true;
                }
                if (newState.options && newState.rowSelector.show) {
                    newState.options.showRowSelector = true;
                }
            }
            // convert colGroup
            newState.headerTable = utils_1.makeHeaderTable(columns, options);
            newState.bodyRowTable = utils_1.makeBodyRowTable(columns, options);
            newState.bodyRowMap = utils_1.makeBodyRowMap(newState.bodyRowTable || { rows: [] }, options);
            // header를 위한 divide
            var headerDividedObj = utils_1.divideTableByFrozenColumnIndex(newState.headerTable || { rows: [] }, frozenColumnIndex, options);
            // body를 위한 divide
            var bodyDividedObj = utils_1.divideTableByFrozenColumnIndex(newState.bodyRowTable || { rows: [] }, frozenColumnIndex, options);
            newState.asideHeaderData = headerDividedObj.asideData;
            newState.leftHeaderData = headerDividedObj.leftData;
            newState.headerData = headerDividedObj.rightData;
            newState.asideColGroup = headerDividedObj.asideColGroup;
            newState.asideBodyRowData = bodyDividedObj.asideData;
            newState.leftBodyRowData = bodyDividedObj.leftData;
            newState.bodyRowData = bodyDividedObj.rightData;
            // colGroupMap, colGroup을 만들고 틀고정 값을 기준으로 나누어 left와 나머지에 저장
            newState.colGroupMap = {};
            if (newState.headerTable) {
                newState.headerTable.rows.forEach(function (row, ridx) {
                    row.cols.forEach(function (col, cidx) {
                        if (newState.colGroupMap) {
                            var currentCol = {
                                key: col.key,
                                label: col.label,
                                width: col.width,
                                align: col.align,
                                colSpan: col.colSpan,
                                rowSpan: col.rowSpan,
                                colIndex: col.colIndex,
                                rowIndex: col.rowIndex,
                                formatter: col.formatter,
                                editor: col.editor,
                            };
                            newState.colGroupMap[col.colIndex || 0] = currentCol;
                        }
                    });
                });
            }
            newState.colGroup = Object.values(newState.colGroupMap);
            newState.leftHeaderColGroup = newState.colGroup.slice(0, frozenColumnIndex);
            newState.headerColGroup = newState.colGroup.slice(frozenColumnIndex);
            // colGroup이 정의되면 footSum
            if (footSum) {
                newState.footSumColumns = __spread(footSum);
                newState.footSumTable = utils_1.makeFootSumTable(footSum, newState.colGroup, options);
                var footSumDividedObj = utils_1.divideTableByFrozenColumnIndex(newState.footSumTable || { rows: [] }, frozenColumnIndex, options);
                newState.leftFootSumData = footSumDividedObj.leftData;
                newState.footSumData = footSumDividedObj.rightData;
            }
            // styles
            newStyle.asidePanelWidth = headerDividedObj.asidePanelWidth;
            newStyle.bodyTrHeight = newState.bodyRowTable
                ? newState.bodyRowTable.rows.length * columnHeight
                : 20;
            newState.styles = newStyle;
            // 초기 스타일 생성.
            var calculatedObject = utils_1.calculateDimensions(newState.rootNode && newState.rootNode.current, newState);
            newState.styles = calculatedObject.styles;
            newState.colGroup = calculatedObject.colGroup;
            newState.leftHeaderColGroup = calculatedObject.leftHeaderColGroup;
            newState.headerColGroup = calculatedObject.headerColGroup;
            var _g = newState.styles, _h = _g.CTInnerWidth, _CTInnerWidth = _h === void 0 ? 0 : _h, _j = _g.frozenPanelWidth, _frozenPanelWidth = _j === void 0 ? 0 : _j, _k = _g.asidePanelWidth, _asidePanelWidth = _k === void 0 ? 0 : _k, _l = _g.rightPanelWidth, _rightPanelWidth = _l === void 0 ? 0 : _l;
            var _m = utils_1.getPositionPrintColGroup(newState.headerColGroup, Math.abs(newState.scrollLeft || 0) + _frozenPanelWidth, Math.abs(newState.scrollLeft || 0) +
                _frozenPanelWidth +
                (_CTInnerWidth -
                    _asidePanelWidth -
                    _frozenPanelWidth -
                    _rightPanelWidth)), printStartColIndex = _m.printStartColIndex, printEndColIndex = _m.printEndColIndex;
            newState.printStartColIndex = printStartColIndex;
            newState.printEndColIndex = printEndColIndex;
            newState.visibleHeaderColGroup = newState.headerColGroup.slice(printStartColIndex, printEndColIndex + 1);
            newState.visibleBodyRowData = utils_1.getTableByStartEndColumnIndex(newState.bodyRowData || { rows: [{ cols: [] }] }, printStartColIndex + frozenColumnIndex, printEndColIndex + frozenColumnIndex);
            newState.visibleBodyGroupingData = utils_1.getTableByStartEndColumnIndex(newState.bodyGroupingData || { rows: [{ cols: [] }] }, printStartColIndex + frozenColumnIndex, printEndColIndex + frozenColumnIndex);
            if (footSum) {
                newState.visibleFootSumData = utils_1.getTableByStartEndColumnIndex(newState.footSumData || { rows: [{ cols: [] }] }, printStartColIndex + frozenColumnIndex, printEndColIndex + frozenColumnIndex);
            }
            return newState;
        };
        return _this;
    }
    DataGrid.prototype.render = function () {
        var mounted = this.state.mounted;
        var _a = this.props, _b = _a.data, data = _b === void 0 ? [] : _b, _c = _a.options, options = _c === void 0 ? {} : _c, _d = _a.style, style = _d === void 0 ? {} : _d, onBeforeEvent = _a.onBeforeEvent, onAfterEvent = _a.onAfterEvent, onScrollEnd = _a.onScrollEnd, onRightClick = _a.onRightClick, _e = _a.height, height = _e === void 0 ? DataGrid.defaultHeight : _e, _f = _a.loading, loading = _f === void 0 ? false : _f, _g = _a.loadingData, loadingData = _g === void 0 ? false : _g, selection = _a.selection, rowSelector = _a.rowSelector;
        var providerProps = {};
        var gridRootStyle = utils_1.mergeAll({
            height: this.state.calculatedHeight || height,
        }, style);
        if (mounted) {
            providerProps = this.getProviderProps({
                mounted: mounted,
                loading: loading,
                loadingData: loadingData,
                setRootState: this.setRootState,
                getRootState: this.getRootState,
                rootNode: this.rootNode,
                clipBoardNode: this.clipBoardNode,
                rootObject: this.rootObject,
                data: data,
                height: height,
                onBeforeEvent: onBeforeEvent,
                onAfterEvent: onAfterEvent,
                onScrollEnd: onScrollEnd,
                onRightClick: onRightClick,
                selection: selection,
                rowSelector: rowSelector,
                options: this.getOptions(options),
            });
        }
        return (React.createElement(providers_1.DataGridStore.Provider, __assign({}, providerProps),
            React.createElement("div", { tabIndex: -1, ref: this.rootNode, className: "axui-datagrid", style: gridRootStyle },
                React.createElement("div", { className: "axui-datagrid-clip-board" },
                    React.createElement("textarea", { ref: this.clipBoardNode })),
                mounted ? (React.createElement(components_1.DataGridEvents, null,
                    React.createElement(components_1.DataGridHeader, null),
                    React.createElement(components_1.DataGridBody, null),
                    React.createElement(components_1.DataGridPage, null),
                    React.createElement(components_1.DataGridScroll, null),
                    React.createElement(components_1.DataGridColumnFilter, null),
                    React.createElement(components_1.DataGridLoader, { loading: loading }))) : null)));
    };
    DataGrid.prototype.componentDidMount = function () {
        this.setState({
            mounted: true,
        });
    };
    DataGrid.defaultHeight = 400;
    DataGrid.defaultColumnKeys = {
        selected: '_selected_',
        modified: '_modified_',
        deleted: '_deleted_',
        disableSelection: '_disable_selection_',
    };
    DataGrid.defaultHeader = {
        display: true,
        align: 'left',
        columnHeight: 24,
        columnPadding: 3,
        columnBorderWidth: 1,
        selector: true,
        sortable: true,
        enableFilter: true,
        clickAction: 'sort',
        filterIconClassName: 'datagridIcon-filter',
    };
    DataGrid.defaultBody = {
        align: 'left',
        columnHeight: 24,
        columnPadding: 3,
        columnBorderWidth: 1,
        grouping: false,
        mergeCells: false,
    };
    DataGrid.defaultPageButtons = [
        { className: 'datagridIcon-first', onClick: 'PAGE_FIRST' },
        { className: 'datagridIcon-prev', onClick: 'PAGE_PREV' },
        { className: 'datagridIcon-back', onClick: 'PAGE_BACK' },
        { className: 'datagridIcon-play', onClick: 'PAGE_PLAY' },
        { className: 'datagridIcon-next', onClick: 'PAGE_NEXT' },
        { className: 'datagridIcon-last', onClick: 'PAGE_LAST' },
    ];
    DataGrid.defaultPage = {
        buttonsContainerWidth: 150,
        buttons: DataGrid.defaultPageButtons,
        buttonHeight: 16,
        height: 20,
    };
    DataGrid.defaultScroller = {
        size: 14,
        arrowSize: 14,
        barMinSize: 12,
        padding: 3,
        disabledVerticalScroll: false,
    };
    DataGrid.defaultOptions = {
        frozenColumnIndex: 0,
        frozenRowIndex: 0,
        showLineNumber: true,
        multipleSelect: true,
        columnMinWidth: 100,
        lineNumberColumnWidth: 60,
        rowSelectorColumnWidth: 28,
        remoteSort: false,
        asidePanelWidth: 0,
        header: DataGrid.defaultHeader,
        body: DataGrid.defaultBody,
        page: DataGrid.defaultPage,
        scroller: DataGrid.defaultScroller,
        columnKeys: DataGrid.defaultColumnKeys,
        bodyLoaderHeight: 100,
    };
    DataGrid.defaultStyles = {
        calculatedHeight: null,
        asidePanelWidth: 0,
        frozenPanelWidth: 0,
        bodyTrHeight: 0,
        elWidth: 0,
        elHeight: 0,
        CTInnerWidth: 0,
        CTInnerHeight: 0,
        rightPanelWidth: 0,
        headerHeight: 0,
        bodyHeight: 0,
        frozenPanelHeight: 0,
        footSumHeight: 0,
        pageHeight: 0,
        verticalScrollerWidth: 0,
        horizontalScrollerHeight: 0,
        scrollContentContainerHeight: 0,
        scrollContentHeight: 0,
        scrollContentContainerWidth: 0,
        scrollContentWidth: 0,
        verticalScrollerHeight: 0,
        verticalScrollBarHeight: 0,
        horizontalScrollerWidth: 0,
        horizontalScrollBarWidth: 0,
        scrollerPadding: 0,
        scrollerArrowSize: 0,
        pageButtonsContainerWidth: 0,
    };
    DataGrid.defaultThrottleWait = 100;
    return DataGrid;
}(React.Component));
exports.default = DataGrid;
