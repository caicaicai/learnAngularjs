'use strict';

(function (app) {

    app.controller('news.list.controller', ['$resource', 'Tips', 'api', 'Pager', function ($resource, Tips, api, Pager) {

        var $this = this, news = $resource(api.newsAction);

        news.get({ action: 'types' }, function (result) { $this.typeData = result.data });

        (function newlist(page) {
            news.get({
                action: 'list',
                page: page || 1
            }, function (result) {
                $this.listData = result.data;
                $this.pageData = Pager(result.extra, newlist);
            })
        })();

        //news.remove({ action: 'delete' }, function (result) { console.log(result) });

        return $this

    }]);

})(angular.module('news.list', []));