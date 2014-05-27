'use strict';

/*  jquery ready  */
$(function () {
    $('form[action=search]').submit(function () { console.log(this.key.value); return false });
    var backToTop = $('.backToTop').click(function () {
        (function scroll(acceleration, time) {
            acceleration = acceleration || 0.3;
            time = time || 15;
            var x1 = 0, y1 = 0, x2 = 0, y2 = 0, x3 = 0, y3 = 0;
            if (document.documentElement) {
                x1 = document.documentElement.scrollLeft || 0;
                y1 = document.documentElement.scrollTop || 0;
            }
            if (document.body) {
                x2 = document.body.scrollLeft || 0;
                y2 = document.body.scrollTop || 0;
            }
            x3 = window.scrollX || 0;
            y3 = window.scrollY || 0;
            var x = Math.max(x1, Math.max(x2, x3)), y = Math.max(y1, Math.max(y2, y3)), speed = 1 + acceleration; window.scrollTo(Math.floor(x / speed), Math.floor(y / speed));
            if (x > 0 || y > 0) { setTimeout(function () { scroll(acceleration, time) }, time); }
        })()
    });
    $(window).scroll(function () { Math.max(document.documentElement.scrollTop, document.body.scrollTop, 0) > 80 ? backToTop.css('zIndex') == -1 && backToTop.css({ zIndex: 100000, opacity: 1 }) : backToTop.css('zIndex') != -1 && backToTop.css({ zIndex: -1, opacity: 0 }) });
});

/*  app  */
(function (app) {

    var defaultRoute = '/',
        siteHost = location.protocol + '//' + location.host + '/',
        timestamp = Date.parse(new Date()) / 1000,
        absPath = function (path) { return !path || !path.indexOf('http://') || path.substr(0, 1) === '/' },
        apiPath = function (path) { return siteHost + 'api/' + path },
        htmlPath = function (path) { if (absPath(path)) { return path } return siteHost + 'assets/views/dashboard/' + path + '.html?t=' + timestamp },
        stylePath = function (path) { if (absPath(path)) { return path } return siteHost + 'assets/css/dashboard/' + path + '.css?t=' + timestamp },
        scriptPath = function (path) { if (absPath(path)) { return path } return siteHost + 'assets/js/dashboard/controllers/' + path + '.js?t=' + timestamp },
        urlHash = function (val, hash) { hash = hash || (location.hash || '').replace('#/', ''); return val ? val == hash : hash };

    /*  config  */
    app.config(['$compileProvider', '$controllerProvider', '$filterProvider', '$httpProvider', '$provide', '$routeProvider', function ($compileProvider, $controllerProvider, $filterProvider, $httpProvider, $provide, $routeProvider) {

        /*  register the interceptor via an anonymous factory  */
        $httpProvider.interceptors.push(['$location', '$log', '$q', 'Tips', 'viewMask', function ($location, $log, $q, Tips, viewMask) {
            return {
                request: function (response) {
                    viewMask.open();
                    if (response.url && response.url.indexOf('/api/') > -1 && response.method) {
                        if (response.method.toUpperCase() === 'GET') {
                            response.params = response.params || {};
                            response.params._token = ngApp.token;
                        } else {
                            response.data = response.data || {};
                            response.data._token = ngApp.token;
                            response.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                            response.transformRequest = [function (data) { return data instanceof Object ? $.param(data) : null }];
                        }
                    }
                    return response
                },
                requestError: function (response) { return $q.reject(response) },
                response: function (response) {
                    viewMask.close();
                    ngApp.Config.autotips && response.data.message && Tips.success(response.data.message);
                    return response
                },
                responseError: function (response) {
                    viewMask.close();
                    ngApp.Config.autotips && response.data.message && Tips.error(response.data.message);
                    response.status === 401 && $location.path('/login');
                    return $q.reject(response)
                }
            }
        }]);

        /*  module register  */
        $provide.factory('moduleRegister', ['$injector', '$log', function ($injector, $log) {
            var cache = [],
                requires = [],
                runBlocks = [],
                invokeQueue = [],
                providers = {
                    $compileProvider: $compileProvider,
                    $controllerProvider: $controllerProvider,
                    $filterProvider: $filterProvider,
                    $provide: $provide
                };
            return function (modules) {
                angular.forEach(modules ? (modules instanceof Array ? modules : [modules]) : [], function (name, module) {
                    try {
                        if (module = angular.module(name).requires) {
                            requires = requires.concat(module);
                            this.push(name)
                        }
                    } catch (ex) {
                        if (ex.message) { ex.message += ' from ' + name; }
                        $log.error(ex.message);
                        throw ex
                    }
                }, modules = []);
                angular.forEach(requires, function (name) {
                    try {
                        angular.module(name) && modules.push(name)
                    } catch (ex) {
                        if (ex.message) { ex.message += ' from ' + name; }
                        $log.error(ex.message);
                        throw ex
                    }
                });
                angular.forEach(modules, function (module, index) {
                    try {
                        index = modules[modules.length - index - 1];
                        module = angular.module(index);
                        if (cache.indexOf(module.name) === -1) {
                            cache.push(module.name);
                            runBlocks = runBlocks.concat(module._runBlocks);
                            invokeQueue = invokeQueue.concat(module._invokeQueue);
                        }
                    } catch (ex) {
                        if (ex.message) { ex.message += ' from ' + index; }
                        $log.error(ex.message);
                        throw ex
                    }
                });
                angular.forEach(invokeQueue, function (queue, provide) {
                    try {
                        if (providers.hasOwnProperty(queue[0]) && (provide = providers[queue[0]])) {
                            provide[queue[1]].apply(provide, queue[2])
                        } else {
                            $log.error('unsupported provider ' + queue[0]);
                        }
                    } catch (ex) {
                        if (ex.message) { ex.message += ' from ' + queue[0]; }
                        $log.error(ex.message);
                        throw ex
                    }
                });
                angular.forEach(runBlocks, function (fn) { $injector.invoke(fn) });
            }
        }]);

        /*  route config  */
        $provide.factory('routeConfig', ['Loader', 'moduleRegister', function (Loader, moduleRegister) {
            return function (routes, callback) {
                angular.forEach(routes, function (route, config) {
                    route.styles && angular.forEach(route.styles, function (path) { this.push(stylePath(path)) }, route.styles = []);
                    route.scripts && angular.forEach(route.scripts, function (path) { this.push(scriptPath(path)) }, route.scripts = []);
                    if (route.path && (route.view || route.viewUrl)) {
                        config = {
                            resolve: {
                                defer: function ($q) {
                                    callback(route.path);
                                    var defer = $q.defer();
                                    route.styles && Loader.style(route.styles);
                                    route.scripts ? Loader.script(route.scripts, function () { defer.resolve(moduleRegister(route.modules)) }) : defer.resolve();
                                    return defer.promise
                                }
                            }
                        };
                        if (route.viewUrl) { config.templateUrl = htmlPath(route.viewUrl) } else { config.template = route.view }
                        $routeProvider.when(route.path, config)
                    }
                });
                $routeProvider.otherwise({ redirectTo: defaultRoute, resolve: { defer: function () { callback(defaultRoute) } } });
            }
        }]);

        /*  api service  */
        $provide.service('api', function () {
            var config = {};
            this.apply = function (name, data) {
                data = config[name] = data || config[name];
                for (var name in this) { this[name] = this[name] instanceof Function ? this[name] : undefined }
                if (data instanceof Object) { for (var p in data) { this[p] = absPath(data[p]) ? data[p] : apiPath(data[p]) } }
                return this
            };
        });

    }]);

    /*  root controller  */
    app.controller('dashboard.root', ['$scope', '$route', 'api', 'routeConfig', function ($scope, $route, api, routeConfig) {
        
        api.apply(app.name, ngApp.Config.api);
        
        $scope.menuData = (function extend(list, hash, parent, root, expand) {
            if (!parent) {
                (root = list).click = function (item) {
                    if (item.children) {
                        root.expand = root.expand == item.code ? null : item.code;
                        return
                    }
                    urlHash(item.code) && !item.children && $route.reload()
                }
            }
            angular.forEach(list, function (item) {
                item.raw = item.code;
                item.code = (parent ? parent.code + '.' : '') + item.code;
                item.level = parent ? parent.level + 1 : 0;
                if (item.code == hash) {
                    item.children ? (root.expand = item.code) : (root.current = item.code);
                    expand = true
                }
                if (item.children && extend(item.children, hash, item, root)) {
                    root.expand = item.code;
                    expand = true
                }
            });
            return parent ? expand : root
        })(angular.copy(ngApp.Config.menu), location.hash ? location.hash.replace('#/', '') : '');

        routeConfig(ngApp.Config.map, function (hash) {
            $('link[class="loader-stylesheet"]').remove();
            (function extend(list, breadcrumb, root, expand) {
                if (!root) {
                    root = list;
                    root.expand = '';
                    root.current = defaultRoute.substr(1);
                    root.hash = hash ? hash.substr(1) : hash;
                }
                angular.forEach(list, function (item) {
                    if (item.code === root.hash) {
                        item.children ? (root.expand = item.code) : (root.current = item.code);
                        breadcrumb.unshift(item);
                        expand = true
                    }
                    if (item.children && extend(item.children, breadcrumb, root)) {
                        root.expand = item.code;
                        breadcrumb.unshift(item);
                        expand = true
                    }
                });
                return expand
            })($scope.menuData, $scope.menuData.breadcrumb = []);
        });

    }]);

    /*  angular rendering  */
    angular.element(document).ready(function () { angular.bootstrap(document, [app.name]) });

})(angular.module('dashboard', ['dashboard.extra', 'ngRoute', 'ngResource']));