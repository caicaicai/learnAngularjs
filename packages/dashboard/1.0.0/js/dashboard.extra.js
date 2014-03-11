'use strict';

/*  extra  */
(function (app) {

    /*  loader files [html,css,js]  */
    app.service('Loader', ['$cacheFactory', '$http', function ($cacheFactory, $http) {
        var cache = $cacheFactory('loader-cacheFactory');
        this.html = function (path, callback) {
            var result = [], count = 0, call = function () { count++; count >= path.length && callback instanceof Function && setTimeout(function () { callback(result) }) };
            angular.forEach((path = path instanceof Array ? path : [path]), function (url, idx) { url ? $http.get(url).success(function (data) { call(result[idx] = data) }).error(call) : setTimeout(call) });
        };
        this.style = function (path) {
            var count = 0,
                element,
                load = function (url) {
                    if (!url) return;
                    element = document.createElement('link');
                    element.className = 'loader-stylesheet';
                    element.rel = 'stylesheet';
                    element.type = 'text/css';
                    element.href = url;
                    document.head.appendChild(element)
                };
            angular.forEach(path instanceof Array ? path : [path], function (item) { load(item) });
        };
        this.script = function (path, callback) {
            path = path instanceof Array ? path : [path];
            var count = 0,
                ISL = document.addEventListener,
                call = function () {
                    count++;
                    if (count >= path.length) { callback instanceof Function && setTimeout(callback) }
                    else { setTimeout(function () { load(path[count]) }) }
                },
                load = function (url, element, disponse) {
                    if (!url || cache.get(url)) return setTimeout(call);
                    cache.put(url, true);
                    disponse = function () {
                        call();
                        document.body.removeChild(element);
                        element = element.onerror = element[ISL ? 'onload' : 'onreadystatechange'] = null;
                    };
                    element = document.createElement('script');
                    element[ISL ? 'onload' : 'onreadystatechange'] = function (_, isAbort) { (isAbort || !element.readyState || /loaded|complete/.test(element.readyState)) && disponse() };
                    element.onerror = disponse;
                    element.type = 'text/javascript';
                    element.src = url;
                    document.body.appendChild(element)
                };
            path.length && load(path[count])
        };
    }]);

    /*  view mask  */
    app.service('viewMask', function () {
        function mask(bool, callback) {
            if (bool) {
                !$('.modal-backdrop').length && !$('.full-view-mask').length && $('[ng-view]').length && $('<div class="full-view-mask"><div><div></div><span></span></div></div>').prependTo('[ng-view]')
            } else {
                $('.full-view-mask').remove()
            }
            callback instanceof Function && setTimeout(callback)
        }
        this.open = function () { mask(true, arguments[0]) };
        this.close = function () { mask(false, arguments[0]) };
        this.show = function () { mask(true, arguments[0]) };
        this.hide = function () { mask(false, arguments[0]) };
    });

    /*  Pager  */
    app.factory('Pager', function () {
        return function (page, callback) {

            if (!page) return null;

            var calculate = function (a, b, c) { c = c || (a > b ? a % b : 0); return Math.max(1, (a - c) / b + (c ? 1 : 0)) },
                config = angular.extend({
                    pagesize: 15,
                    total: 0,
                    split: 5,
                    index: page.page || 1,
                    jump: page.page || 1,
                    prevName: '«',
                    nextName: '»',
                    click: function (item) {
                        if (item instanceof Object) {
                            if (item.index === this.index) return this;
                            if (item.prev || item.next) {
                                this.index += item.prev ? -1 : 1
                            } else if (item.first || item.last) {
                                this.index = item.first ? 1 : this.nums
                            } else {
                                this.index = item.index
                            }
                        } else if (/^[0-9]*$/.test(Math.abs(parseInt(item)))) {
                            if ((item = parseInt(item)) === this.index) return this;
                            this.index = item
                        } else { return this }
                        this.page != (item = this.apply()).index && angular.forEach(this.callback, function (fn) { fn instanceof Function && setTimeout(function () { fn(item.index) }) });
                        return this
                    },
                    apply: function () {
                        if (!this.nums) {
                            this.nums = calculate(this.total, this.pagesize);
                            this.rows = calculate(this.nums, this.split);
                            this.callback = this.callback ? (this.callback instanceof Array ? this.callback : [this.callback]) : [];
                            callback instanceof Array ? this.callback.concat(callback) : (callback && this.callback.push(callback))
                        }
                        this.index = this.jump = this.page = Math.max(1, Math.min(this.index, this.nums));
                        this.row = Math.min(calculate(this.index, this.split), this.rows);
                        this.splice(0);
                        if (this.index > 1) { this[0] = { index: this.prevName, prev: true } }
                        if (this.row > 1) { this[1] = { index: '1...', first: true } }
                        for (var i = (this.row - 1) * this.split + 1; i <= Math.min(this.row * this.split, this.nums) ; i++) { this[this.length] = { index: i, num: true, active: this.index === i } }
                        if (this.row < this.rows) { this[this.length] = { index: '...' + this.nums, last: true } }
                        if (this.index < this.nums) { this[this.length] = { index: this.nextName, next: true } }
                        return this
                    }
                }, page);

            return angular.extend(page = [], config).apply()

        }
    });

    /*  Tips  */
    app.factory('Tips', function () {

        var zIndex = 1050, dialog, dialogId = 'dialog' + Date.parse(new Date()) / 1000,
            tip = function (content, config) {
                if (content) {
                    config = angular.extend({ clas: 'modal-primary', icon: 'glyphicon glyphicon-question-sign', timeout: 3000 }, config);
                    var timer, modal, modalId = 'modal' + new Date().getTime(),
                        remove = function () {
                            modal.animate({ top: -20, opacity: 0 }, 200, function () {
                                $(this).remove();
                                config.callback instanceof Function && setTimeout(config.callback);
                                !dialog.children('.modal-content').length && dialog.parent().remove()
                            })
                        };
                    if (!document.getElementById(dialogId)) {
                        $('[ng-view]').children().each(function (i) { if (!!parseInt($(this).css('zIndex'))) zIndex = parseInt($(this).css('zIndex')) + 1 });
                        $('[ng-view]').append(['<div class="modal ng-dialog" style="z-index:' + zIndex + '" id="' + dialogId + '">', '<div class="modal-dialog">', '</div>', '</div>'].join(''));
                        dialog = $('#' + dialogId + '>.modal-dialog');
                    }
                    dialog.append(['<div id="' + modalId + '" class="modal-content ' + config.clas + '">', '<i class="' + config.icon + '"></i>', '<a href="javascript:void(0)" class="glyphicon glyphicon-remove"></a>', '<div class="modal-body">', content, '</div>', '</div>'].join(''));
                    modal = $('#' + modalId).animate({ top: 0, opacity: 1 }, 200).mouseenter(function () { timer && clearTimeout(timer) }).mouseleave(function () { timer = setTimeout(remove, 2000) });
                    modal.children('a').click(remove);
                    timer = setTimeout(remove, config.timeout);
                }
                return tip
            };

        tip.extend = function () {
            var $this = this, conf, config = arguments[0] || [], i = 0;
            if (!(config instanceof Array)) { config = [config] }
            for (; i < config.length; i++) { (conf = config[i]) && conf instanceof Object && (function (conf) { $this[conf.name] = function (content, config) { return tip(content, angular.extend(conf, config)) } })(conf) }
            return $this
        };

        return tip.extend([
            { name: 'alert', clas: 'modal-primary', icon: 'glyphicon glyphicon-question-sign' },
            { name: 'success', clas: 'modal-success', icon: 'glyphicon glyphicon-ok-sign' },
            { name: 'info', clas: 'modal-info', icon: 'glyphicon glyphicon-info-sign' },
            { name: 'warning', clas: 'modal-warning', icon: 'glyphicon glyphicon-exclamation-sign', timeout: 2000 },
            { name: 'error', clas: 'modal-danger', icon: 'glyphicon glyphicon-remove-sign' }
        ])

    });

    /*  form tips  */
    app.directive('formTips', ['Tips', function (Tips) {
        return {
            restrict: 'A',
            require: 'form',
            link: function (scope, element, attrs, ctrl) {

                var form = element[0], $ctrl, $data, $error, $config = {};

                if (form && form.name && form.tagName === 'FORM' && ($ctrl = scope[form.name])) {
                    form.noValidate = true;
                    element.submit(function (event, stop) {
                        if (ctrl.$invalid) {
                            angular.forEach(form, function (elem) {
                                if (stop) return;
                                elem && elem.name
                                && $ctrl[elem.name]
                                && ($error = $ctrl[elem.name].$error)
                                && elem.dataset
                                && elem.dataset.tipsConfig
                                && eval('$config=' + elem.dataset.tipsConfig)
                                && angular.forEach($error, function (bool, key) {
                                    if (bool) {
                                        Tips.warning($config[key]);
                                        $(elem).removeClass('ng-pristine').addClass('ng-dirty');
                                        stop = true
                                    }
                                })
                            });
                            event.stopImmediatePropagation()
                        }
                        return false
                    });
                    $data = $.data(form, 'events') || $._data(form, 'events');
                    $data && $data.submit.unshift($data.submit.pop());
                }

            }
        }
    }]);

    /*  Pagination  */
    app.directive('pagination', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            template: function (element, attrs) {
                if (!attrs.pagination) return;
                var dom = [], model = attrs.pagination;
                dom.push('<div class="form-group">');
                dom.push('<ul class="pagination">');
                dom.push('<li ng-repeat="page in ' + model + '" ng-class="{active:page.active}" ng-click="' + model + '.click(page)">');
                dom.push('<a href="javascript:void(0)" ng-bind="page.index"></a>');
                dom.push('</li>');
                dom.push('</ul>');
                dom.push('</div>');
                dom.push('<span ng-show="' + model + '.rows>1"> 第 <input type="text" class="form-control input-sm text-right" ng-model="' + model + '.jump" style="width:50px" /> 页 </span>');
                dom.push('<a href="javascript:void(0)" class="btn btn-default btn-sm" ng-show="' + model + '.rows>1" ng-click="' + model + '.click(' + model + '.jump)"><b>GO</b></a>');
                element.addClass('form-inline').html(dom.join(''))
            }
        }
    });

})(angular.module('dashboard.extra', []));