'use strict';

ngApp.Config = {
    api: {
        updatePassword: 'user/updatePassword',
        newsAction: 'news/:action'
    },
    autotips: true,
    map: [
        {
            path: '/',
            view: '网站管理中心首页',
            //viewUrl: 'index',
            styles: null,
            scripts: null,
            modules: null
        },
        {
            path: '/system.password',
            view: '',
            viewUrl: 'system/password',
            styles: [],
            scripts: ['system/password'],
            modules: ['system.password']
        },
        {
            path: '/news.list',
            view: '',
            viewUrl: 'news/list',
            styles: [],
            scripts: ['news/list'],
            modules: ['news.list']
        },
        {
            path: '/news.type',
            view: '',
            viewUrl: 'news/type',
            styles: [],
            scripts: ['news/type'],
            modules: ['news.type']
        },
        {
            path: '/stats',
            view: '',
            viewUrl: 'stats',
            styles: [],
            scripts: ['stats'],
            modules: ['stats']
        }
    ],
    menu: [
        { code: '', name: '管理首页', icon: 'glyphicon glyphicon-home' },
        {
            code: 'system', name: '系统设置', icon: 'glyphicon glyphicon-cog',
            children: [
                { code: 'profile', name: '我的信息', icon: 'glyphicon glyphicon-tasks' },
                { code: 'password', name: '密码修改', icon: 'glyphicon glyphicon-lock' },
                { code: 'role', name: '角色设置', icon: 'glyphicon glyphicon-wrench' },
                { code: 'auth', name: '权限设置', icon: 'glyphicon glyphicon-wrench' },
                { code: 'remind', name: '提醒设置', icon: 'glyphicon glyphicon-bell' }
            ]
        },
        {
            code: 'setup', name: '页面配置', icon: 'glyphicon glyphicon-list-alt',
            children: [
                { code: 'index', name: '首页配置', icon: 'glyphicon glyphicon-home' },
                { code: 'ads', name: '广告位', icon: 'glyphicon glyphicon-paperclip' }
            ]
        },
        {
            code: 'user', name: '账户管理', icon: 'glyphicon glyphicon-user',
            children: [
                { code: 'admins', name: '管理员', icon: 'glyphicon glyphicon-tower' },
                { code: 'company', name: '企业会员', icon: 'glyphicon glyphicon-tags' },
                { code: 'general', name: '普通会员', icon: 'glyphicon glyphicon-tag' }
            ]
        },
        {
            code: 'news', name: '新闻管理', icon: '',
            children: [
                { code: 'add', name: '添加', icon: 'glyphicon glyphicon-plus-sign' },
                { code: 'type', name: '栏目管理', icon: 'glyphicon glyphicon-th-list' },
                { code: 'list', name: '新闻列表', icon: 'glyphicon glyphicon-list' },
                { code: 'unaudited', name: '未审核', icon: 'glyphicon glyphicon-question-sign' }
            ]
        },
        {
            code: 'jobs', name: '招聘管理', icon: '',
            children: [
                { code: 'add', name: '添加', icon: 'glyphicon glyphicon-plus-sign' },
                { code: 'type', name: '栏目管理', icon: 'glyphicon glyphicon-th-list' },
                { code: 'list', name: '招聘列表', icon: 'glyphicon glyphicon-list' },
                { code: 'recommend', name: '已推荐', icon: 'glyphicon glyphicon-check' },
                { code: 'unaudited', name: '未审核', icon: 'glyphicon glyphicon-question-sign' }
            ]
        },
        {
            code: 'shop', name: '商城管理', icon: '',
            children: [
                { code: 'add', name: '添加', icon: 'glyphicon glyphicon-plus-sign' },
                { code: 'type', name: '栏目管理', icon: 'glyphicon glyphicon-th-list' },
                { code: 'list', name: '商品列表', icon: 'glyphicon glyphicon-list' },
                { code: 'unaudited', name: '未审核', icon: 'glyphicon glyphicon-question-sign' }
            ]
        },
        {
            code: 'information', name: '知识管理', icon: '',
            children: [
                { code: 'add', name: '添加', icon: 'glyphicon glyphicon-plus-sign' },
                { code: 'type', name: '栏目管理', icon: 'glyphicon glyphicon-th-list' },
                { code: 'list', name: '知识列表', icon: 'glyphicon glyphicon-list' },
                { code: 'unaudited', name: '未审核', icon: 'glyphicon glyphicon-question-sign' }
            ]
        },
        {
            code: 'company', name: '企业管理', icon: '',
            children: [
                { code: 'add', name: '添加', icon: 'glyphicon glyphicon-plus-sign' },
                { code: 'type', name: '栏目管理', icon: 'glyphicon glyphicon-th-list' },
                { code: 'template', name: '企业模板', icon: 'glyphicon glyphicon-picture' },
                { code: 'list', name: '企业列表', icon: 'glyphicon glyphicon-list' },
                { code: 'unaudited', name: '未审核', icon: 'glyphicon glyphicon-question-sign' }
            ]
        },
        { code: 'stats', name: '统计分析', icon: 'glyphicon glyphicon-stats' }
    ]
};