# 主数据平台

[![Language](https://img.shields.io/badge/语言-Java17%20%7C%20SpringCloud%20%7C%20Vue3%20-red?style=flat-square&color=42b883)](https://github.com/henhen6/mdp)
[![License](https://img.shields.io/github/license/henhen6/mdp?color=42b883&style=flat-square)](https://github.com/henhen6/mdp/blob/master/LICENSE)
[![Author](https://img.shields.io/badge/作者-很很-orange.svg)](https://github.com/henhen6)
[![Star](https://img.shields.io/github/stars/henhen6/mdp?color=42b883&logo=github&style=flat-square)](https://github.com/henhen6/mdp/stargazers)
[![Fork](https://img.shields.io/github/forks/henhen6/mdp?color=42b883&logo=github&style=flat-square)](https://github.com/henhen6/mdp/network/members)
[![Star](https://gitee.com/henhen6/mdp/badge/star.svg?theme=gray)](https://gitee.com/henhen6/mdp/stargazers)
[![Fork](https://gitee.com/henhen6/mdp/badge/fork.svg?theme=gray)](https://gitee.com/henhen6/mdp/members)
![star](https://gitcode.com/henhen6/mdp/star/badge.svg)

[![star](https://gitcode.com/henhen6/mdp/star/2025top.svg)](https://gitcode.com/henhen6/mdp)

## 介绍
主数据平台（master-data-platform），简称MDP。MDP基于Java17、SpringBoot、vue3、ant-design-vue等主流技术构建的中后台快速开发平台，立志打造为一个企业级的软件开发基础脚手架，帮助企业快速搭建一个基础开发框架。

简单来说，可以理解为MDP是集 单点登录系统、主数据（基础数据）维护与管理、开发者平台（开放平台）等功能于一身的平台。

该项目主要功能包含：基础数据管理、权限管理、用户身份认证、应用（子系统）集成。

- 基础数据管理
  - 组织机构管理、岗位管理、用户管理
  - 钉钉等三方数据同步
  - 菜单管理、角色模板管理、角色管理
  - 字典管理、配置管理
- 权限管理
  - 应用权限管控
  - 菜单、按钮、数据、字段权限的配置、授权和鉴权
  - 接口权限的配置、授权和鉴权
- 用户身份认证
  - SSO、Oauth2等多种主流的单点登录协议。
- 应用（子系统）集成
  - 接入与审批
  - 免密登录与一键跳转
  - 数据订阅与拉取
  - 接口调用与管控
  - SDK下载
  - 文档生成与查看
- 其他功能
  - 消息中心
  - 用户个人中心
  - 可视化代码生成
  - 短信、邮件、站内信功能
  - 文件存储
  - 登录日志、操作日志


## 联系作者
- 微信：hhenhen

## 内置应用

| 应用<br/>（子系统）                   | 后端项目名            | 前端项目名    | 备注                             |
|--------------------------------| --------------------- | ------------- |--------------------------------|
| [工作台](http://workbench.mddata.top) | md-workbench，简称mdw | web-workbench | 可以理解为用户中心、用户的统一门户。通常提供给所有用户使用。 |
| [控制台](http://console.mddata.top) | md-console，简称mdc   | web-console   | 可以理解为后台管理项目，通常提供给管理员使用。        |
| [开发者平台](http://open.mddata.top) | md-open，简称mdo      | web-open      | 可以理解为开发者中心，通常提供给第三方开发者接入应用使用。  |

- 工作台：http://workbench.mddata.top
- 控制台：http://console.mddata.top
- 开发者平台：http://open.mddata.top
- 演示环境：
  - 运维管理员账号密码：ops_admin/admin
  - 开发者管理员账号密码：open_admin/admin
  - 企业管理员账号密码：admin/admin
