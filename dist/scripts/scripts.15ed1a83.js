"use strict";angular.module("spiderKeeperApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","initMaterial","ngNotify"]).controller(["$rootScope",function(a){a.status="dashboard"}]).config(["$routeProvider",function(a){a.when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).when("/dashboard",{templateUrl:"views/dashboard.html",controller:"DashboardCtrl",controllerAs:"dashboard"}).when("/status",{templateUrl:"views/status.html",controller:"StatusCtrl",controllerAs:"status"}).otherwise({redirectTo:"/dashboard"})}]),deferredBootstrapper.bootstrap({element:document.body,module:"spiderKeeperApp",bootstrapConfig:{strictDi:!0},resolve:{APP_CONFIG:["$http",function(a){return a.get("/config/config.json")}]},onError:function(a){alert("Could not bootstrap, error: "+a)}}),angular.module("spiderKeeperApp").service("daemonService",["APP_CONFIG","$http","$sce",function(a,b,c){function d(){return a.scrapyd}function e(){var b=[];for(var c in a.scrapyd)b.push(a.scrapyd[c].name);return b}function f(a){var c=b({method:"get",url:p+"/spider/list/",params:{project:a}});return c}function g(a,c,d){d=d||"all";var e=b({method:"get",url:p+"/job/list/"+d+"/",params:{project:a,daemons:c.join(",")}});return e}function h(){var a=b({method:"get",url:p+"/project/list/"});return a}function i(a){var c=b({method:"get",url:p+"/daemon/status/",params:{daemons:a.join(",")}});return c}function j(a,c,d,e){for(var f={project:a,spider:c,daemons:e.join(",")},g=d.split(","),h=0;h<g.length;h++){var i=g[h].split("=");f[i[0]]=i[1]}var j=b({method:"get",url:p+"/spider/start/",params:f});return j}function k(a,c,d){var e=b({method:"get",url:p+"/schedule/cancel/",params:{project:a,job:c,daemons:d.join(",")}});return e}function l(a,b,d,e){return c.trustAsResourceUrl(p+"/log/?project="+a+"&spider="+b+"&jobId="+d+"&daemons="+e.join(","))}function m(a){var c=b({method:"get",url:p+"/schedule/list/",params:{project:a}});return c}function n(a,c,d,e,f,g,h){var i=b({method:"get",url:p+"/schedule/add/",params:{project:a,spider:c,params:d,startTime:e,interval:f,times:g,daemons:h.join(",")}});return i}function o(a){var c=b({method:"get",url:p+"/schedule/del/",params:{id:a}});return c}console.log("APP_CONFIG is: "+JSON.stringify(a));var p=a.server;return{listDaemons:d,getDaemonNames:e,listSpiders:f,listJobs:g,listProjects:h,daemonStatus:i,schedule:j,cancel:k,getLogSceUrl:l,addSchedule:n,getScheduler:m,removeSchedule:o}}]),function(){for(var a=angular.module("initMaterial",[]),b=["input","textarea","select"],c=[function(){return{restrict:"E",link:function(a,b){if(b.hasClass("form-control"))$.material.input(b);else{var c=b.attr("type"),d=$.material[c];"function"==typeof d&&d(b)}}}}],d=0;d<b.length;d++)a.directive(b[d],c);var e=[function(){return{restrict:"C",link:function(a,b){b.hasClass("withoutripple")||b.hasClass("btn-link")||$.material.ripples(b)}}}];a.directive("withRipples",e),a.directive("withripple",e),a.directive("cardImage",e),a.directive("btn",e),a.directive("input",e)}(),angular.module("spiderKeeperApp").controller("MainCtrl",function(){}),angular.module("spiderKeeperApp").controller("AboutCtrl",function(){this.about="https://github.com/DormyMo/SpiderKeeper"}),angular.module("spiderKeeperApp").controller("DashboardCtrl",["$scope","$rootScope","$routeParams","$location","$interval","daemonService",function(a,b,c,d,e,f){b.status="dashboard",a.daemons=f.listDaemons(),b.currDaemon=[a.daemons[0].name],f.listProjects(b.currDaemon).then(function(d){a.projectNames=d.data.projects,b.currProject=c.project||a.projectNames[0]}),a.menus=[{name:"Spiders",page:"views/dash_spider.html"},{name:"Jobs",page:"views/dash_job.html"},{name:"Collections"},{name:"Schedule",page:"views/dash_scheduler.html"}],a.currMenuName=c.menu||a.menus[0].name;for(var g in a.menus)if(a.menus[g].name==a.currMenuName){a.subPage=a.menus[g].page;break}a.getDaemonStatus=function(){f.daemonStatus(b.currDaemon).then(function(c){b.currDaemonStatus=c.data.data[0],a.menus[1].badge=b.currDaemonStatus.running})},a.getDaemonStatus(),e(a.getDaemonStatus,1e3),a.menuClick=function(a){d.search({menu:a.name})},a.daemonChange=function(a){b.currDaemon=[a]}}]),angular.module("spiderKeeperApp").controller("DashspiderCtrl",["$scope","$rootScope","daemonService","$routeParams","$location","ngNotify",function(a,b,c,d,e,f){function g(){a.spiders={},a.runType="run",a.daemons=c.listDaemons(),b.$watch("currProject",function(d,e){d&&c.listSpiders(b.currProject).then(function(b){a.spideNames=b.data.spiders;for(var c in a.spideNames)a.spiders[a.spideNames[c]]={name:a.spideNames[c],status:"pending",params:""}})}),a.btnRunClick=function(b){a.runType="run",a.scheduleSpider=b,$("#modelSchedule").show()},a.btnScheduleClick=function(b){a.runType="schedule",a.scheduleSpider=b,a.scheduleSpider.startTime=moment().format("YYYY-MM-DD HH:mm:ss"),a.scheduleSpider.times=1,a.scheduleSpider.interval=0,$("#modelSchedule").show()},a.btnScheduleSubmit=function(){var d=[];for(var g in a.daemons)a.daemons[g].selected&&d.push(a.daemons[g].name);"run"==a.runType?c.schedule(a.currProject,a.scheduleSpider.name,a.scheduleSpider.params,d).then(function(b){b=b.data.data;var c=a.scheduleSpider.name+" has running on [";for(var d in b)c+=b[d].daemon+"("+(b[d].jobid||b[d].status)+") , ";c+="]",f.set(c),e.search({menu:"Jobs"})}):c.addSchedule(b.currProject,a.scheduleSpider.name,a.scheduleSpider.params,a.scheduleSpider.startTime,a.scheduleSpider.interval,a.scheduleSpider.times,d).then(function(b){"ok"==b.data.status?(f.set(a.scheduleSpider.name+" has added to schedule"),e.search({menu:"Schedule"})):f.set(a.scheduleSpider.name+" adding to schedule error","error")}),$("#modelSchedule").hide()}}g(),b.$watch("currDaemon",function(a,b){g()})}]),angular.module("spiderKeeperApp").controller("DashjobCtrl",["$scope","$rootScope","daemonService","$routeParams","$interval",function(a,b,c,d,e){function f(){a.jobStates=["Pending","Running","Finished"],a.jobState="running",a.jobs={},a.listJobs=function(d){c.listJobs(b.currProject,b.currDaemon,d).then(function(c){a.jobs[d]=[];for(var e in b.currDaemon){var f=c.data.data[b.currDaemon[e]][d];for(var g in f)f[g].daemon=b.currDaemon[e],a.jobs[d].push(f[g])}})},a.listJobs("running"),e(function(){a.listJobs("pending")},2e4),e(function(){a.listJobs("running")},1e4),a.btnJobFinishedClick=function(){a.listJobs("finished")},a.btnCancelClick=function(a){c.cancel(b.currProject,a.id,b.currDaemon).then(function(a){})},a.btnLogClick=function(d){a.logUrl=c.getLogSceUrl(b.currProject,d.spider,d.id,b.currDaemon),$("#modelLog").show()}}f(),b.$watch("currDaemon",function(a,b){f()}),a.jobShowType=function(a){b.currDaemon.length>1?b.currDaemon=[c.getDaemonNames()[0]]:b.currDaemon=c.getDaemonNames()}}]),angular.module("spiderKeeperApp").directive("btnUpload",function(){return{template:'<div ng-style="position:fixed;right: 30px;bottom: 30px;"  class="btn btn-info btn-fab" data-toggle="tooltip" data-placement="top" title="deploy project" data-original-title="deploy project" ng -click="click()"><i class="material-icons"  >add<input id="file" type="file" style="display:none;" /></i></div>',restrict:"AE",scope:!0,link:function(a,b,c){$scope.click=function(){b.find("#file").click()}}}}),angular.module("spiderKeeperApp").controller("DashschdulerCtrl",["$scope","$rootScope","daemonService","$interval",function(a,b,c,d){a.getSchedulers=function(){c.getScheduler(b.currProject).then(function(b){a.schedulers=b.data.data})},a.getSchedulers(),a.btnRemoveScheduleClick=function(a){c.removeSchedule(a.id)}}]),angular.module("spiderKeeperApp").filter("dateformat",function(){return function(a){return moment(a).format("YYYY-MM-DD HH:mm:ss")}}),angular.module("spiderKeeperApp").controller("StatusCtrl",["$rootScope",function(a){a.status="status"}]),angular.module("spiderKeeperApp").run(["$templateCache",function(a){a.put("views/dash_job.html",'<style>.panel {\n        margin-bottom: 20px;\n    }</style> <div ng-controller="DashjobCtrl"> <div class="page-header"> <h1 id="tables">Jobs</h1> <div class="togglebutton"> <label> <span>Singleton </span> <input type="checkbox" data-mdproc="true" ng-click="jobShowType()"><span class="toggle"></span> <span>Cluster </span> </label> </div> </div> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">Pending</h3> </div> <div class="panel-body" style="overflow: scroll"> <div class="bs-component" style="max-width:100%"> <table class="table table-striped table-hover"> <thead> <tr> <th>#</th> <th>Daemon</th> <th>Project</th> <th>Spider Name</th> <th>Job Id</th> <th>Log</th> <th class="disabled">Items</th> </tr> </thead> <tbody> <tr ng-repeat="item in jobs.pending"> {{item}} <td>{{$index}}</td> <td>{{item.daemon}}</td> <td>{{currProject}}</td> <td>{{item.spider}}</td> <td>{{item.id}}</td> <!--<td><a href="http://115.29.241.153:6800/logs/{{currProject}}/{{item.spider}}/{{item.id}}.log" target="_blank" ><i class="material-icons">open_in_new</i></a></td>--> <td><a class="btn btn-default" href="javascript:void(0)" ng-click="btnLogClick(item)"><i class="material-icons">open_in_new</i></a></td> <td><a class="btn btn-default" href="#"><i class="material-icons">open_in_new</i></a></td> </tr> </tbody> </table> <div id="source-button" class="btn btn-primary btn-xs" style="display: none">&lt; &gt;</div> </div><!-- /example --> </div> </div> <div class="panel panel-info"> <div class="panel-heading"> <h3 class="panel-title">Running</h3> </div> <div class="panel-body" style="overflow: scroll"> <div class="bs-component" style="max-width:100%"> <table class="table table-striped table-hover"> <thead> <tr> <th>#</th> <th>Daemon</th> <th>Project</th> <th>Spider Name</th> <th>Job Id</th> <th>StartTime</th> <th>Log</th> <th class="disabled">Items</th> </tr> </thead> <tbody> <tr ng-repeat="item in jobs.running"> {{item}} <td>{{$index}}</td> <td>{{item.daemon}}</td> <td>{{currProject}}</td> <td>{{item.spider}}</td> <td>{{item.id}}</td> <td>{{item.start_time}}</td> <!--<td><a href="http://115.29.241.153:6800/logs/{{currProject}}/{{item.spider}}/{{item.id}}.log" target="_blank" ><i class="material-icons">open_in_new</i></a></td>--> <td><a class="btn btn-default" href="javascript:void(0)" ng-click="btnLogClick(item)"><i class="material-icons">open_in_new</i></a></td> <td><a class="btn btn-default" href="#"><i class="material-icons">open_in_new</i></a></td> <td><a href="javascript:void(0)" class="btn btn-raised btn-danger" ng-click="btnCancelClick(item)" style="vertical-align: top"><i class="material-icons">stop</i> Cancle </a></td> </tr> </tbody> </table> </div> </div> </div> <div class="panel panel-success"> <div class="panel-heading"> <h3 class="panel-title">Finished<a href="javascript:void(0)" ng-click="btnJobFinishedClick()" style="float:right"><i class="material-icons">refresh</i></a></h3> </div> <div class="panel-body" style="overflow: scroll"> <div class="bs-component" style="max-width:100%"> <table class="table table-striped table-hover"> <thead> <tr> <th>#</th> <th>Daemon</th> <th>Project</th> <th>Spider Name</th> <th>Job Id</th> <th>StartTime</th> <th>EndTime</th> <th>RunningTime</th> <th>Log</th> <th class="disabled">Items</th> </tr> </thead> <tbody> <tr ng-repeat="item in jobs.finished"> {{item}} <td>{{$index}}</td> <td>{{item.daemon}}</td> <td>{{currProject}}</td> <td>{{item.spider}}</td> <td>{{item.id}}</td> <td>{{item.start_time}}</td> <td>{{item.end_time}}</td> <td>{{item.running_time}} h</td> <!--<td><a href="http://115.29.241.153:6800/logs/{{currProject}}/{{item.spider}}/{{item.id}}.log" target="_blank" ><i class="material-icons">open_in_new</i></a></td>--> <td><a class="btn btn-default" href="javascript:void(0)" ng-click="btnLogClick(item)"><i class="material-icons">open_in_new</i></a></td> <td><a class="btn btn-default" href="#"><i class="material-icons">open_in_new</i></a></td> </tr> </tbody> </table> </div> </div> </div> <div class="modal" id="modelLog" style="height: 100%;width: 100%"> <div class="modal-dialog" style="height: 100%;width: 100%"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="$(\'#modelLog\').hide()">× </button> <a href="{{logUrl}}" target="_blank" class="close" data-dismiss="modal" aria-hidden="true"><i class="material-icons">open_in_new</i></a> <h4 class="modal-title">Log</h4> </div> <div class="modal-body" style="height: 760px;width: 100%"> <iframe id="frameLog" width="100%" height="100%" ng-src="{{logUrl}}"></iframe> </div> <div class="modal-footer"> </div> </div> </div> </div> </div>'),a.put("views/dash_scheduler.html",'<div ng-controller="DashschdulerCtrl"> <div class="page-header"> <h1 id="tables">Scheduler</h1> </div> <div class="bs-component" style="overflow: scroll"> <table class="table table-striped table-hover" style="max-width:100%"> <thead> <tr> <th>id</th> <th>daemons</th> <th>Project</th> <th>Spider</th> <th>Params</th> <th>start_time</th> <th>Interval(hour)</th> <th>times</th> <th>Update</th> <th>Operation</th> </tr> </thead> <tbody> <tr ng-repeat="scheduler in schedulers"> <td>{{scheduler.id}}</td> <td>{{scheduler.daemons}}</td> <td>{{scheduler.project}}</td> <td>{{scheduler.spider}}</td> <td>{{scheduler.params}}</td> <td>{{scheduler.start_time | dateformat}}</td> <td>{{scheduler.interval}}</td> <td>{{scheduler.times}}</td> <td>{{scheduler.date_update | dateformat}}</td> <td><a href="javascript:void(0)" class="btn btn-raised btn-warning" ng-click="btnRemoveScheduleClick(scheduler)"><i class="material-icons">remove</i> Remove </a></td> </tr> </tbody> </table> </div></div>'),a.put("views/dash_spider.html",'<div ng-controller="DashspiderCtrl"> <div class="page-header"> <h1 id="tables">Spiders Able </h1> </div> <div class="bs-component" style="overflow: scroll"> <table class="table table-striped table-hover" style="max-width:100%"> <thead> <tr> <th>#</th> <th>Spider Name</th> <th>Args</th> <th>State</th> </tr> </thead> <tbody> <tr ng-repeat="spider in spiders"> <td>{{$index}}</td> <td>{{spider.name}}</td> <td><input type="text" placeholder="foo1=bar1,foo2=bar2..." style="width: 300px" ng-model="spider.params"></td> <td> <!--<a  href="javascript:void(0)" class="btn btn-primary btn-raised" ng-click="btnRunClick(spider)"><i class="material-icons">play_arrow</i> Run </a>--> <div class="btn-group"> <a href="javascript:void(0)" class="btn btn-primary btn-raised" ng-click="btnRunClick(spider)"><i class="material-icons">play_arrow</i> Run </a> <a href="javascript:void(0)" data-target="#" class="btn btn-primary btn-raised dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a> <ul class="dropdown-menu"> <li><a href="javascript:void(0)" ng-click="btnScheduleClick(spider)">Add to schedule</a> </li> </ul> </div> </td> </tr> </tbody> </table> </div> <!--add to schedule model--> <div class="modal" id="modelSchedule"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="$(\'#modelSchedule\').hide()">× </button> <h4 class="modal-title" ng-if="runType==\'schedule\'">Add to schedule</h4> <h4 class="modal-title" ng-if="runType==\'run\'">Run </h4> </div> <div class="modal-body"> <table class="table table-striped table-hover"> <tr ng-if="runType==\'schedule\'"> <td>Project Name</td> <td><input type="text" name="project" ng-model="currProject"></td> </tr> <tr ng-if="runType==\'schedule\'"> <td>Spider</td> <td><input type="text" name="spider" ng-model="scheduleSpider.name"></td> </tr> <tr ng-if="runType==\'schedule\'"> <td>Params</td> <td><input type="text" name="params" ng-model="scheduleSpider.params"></td> </tr> <tr ng-if="runType==\'schedule\'"> <td>Start Time</td> <td><input type="text" name="startTime" ng-model="scheduleSpider.startTime"></td> </tr> <tr ng-if="runType==\'schedule\'"> <td>Interval</td> <td><input type="text" name="interval" ng-model="scheduleSpider.interval"></td> </tr> <tr ng-if="runType==\'schedule\'"> <td>Run Times</td> <td><input type="text" name="times" ng-model="scheduleSpider.times"></td> </tr> <tr> <td>Choice Daemon</td> <td> <div class="form-group"> <div class="checkbox" ng-repeat="daemon in daemons"> <label> <input type="checkbox" name="sel_daemon[]" value="{{daemon.name}}" ng-model="daemon.selected">{{daemon.name}} </label> </div> </div> <p class="help-block">select <code>one</code>/<code>multi</code> daemon to run (<code>automaticaly</code> choice best daemon <code>without select</code> )</p> </td> </tr> </table> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal" onclick="$(\'#modelSchedule\').hide()">Cancel </button> <button type="button" class="btn btn-primary" ng-click="btnScheduleSubmit()">Confirm</button> </div> </div> </div> </div> </div>'),a.put("views/dashboard.html",'<div class="row"> <nav class="col-md-2 menu"> <!--project select--> <div class="btn-group" style="width: 100%"> <a href="javascript:void(0)" style="width: 100%" data-target="#" class="btn dropdown-toggle" data-toggle="dropdown"> {{currDaemon}} <span class="caret"></span> </a> <ul class="dropdown-menu" style="width: 100%"> <li ng-repeat="daemon in daemons"><a href="javscript:void(0)" ng-click="daemonChange(daemon.name)">{{daemon.name}}</a></li> </ul> </div> <!--menu--> <ul> <li ng-repeat="menu in menus" class="withripple" ng-class="{active:menu.name==currMenuName}" ng-click="menuClick(menu)">{{menu.name}} <span class="badge">{{menu.badge}}</span></li> </ul> </nav> <div class="col-md-10" style="margin-top: -30px"> <div class="row"> <div class="col-md-12"> <div ng-include="subPage"></div> </div> </div> </div> <div style="position:fixed;right: 30px;bottom: 30px;background-color: #ec407a; color:#fff" class="btn btn-fab" data-toggle="tooltip" data-placement="top" title="deploy project" data-original-title="deploy project" onclick="$(\'#modelDeploy\').show()"><i class="material-icons">add</i></div> </div> <!--deploy project model--> <div class="modal" id="modelDeploy"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="$(\'#modelDeploy\').hide()">×</button> <h4 class="modal-title">Deploy/Update Project</h4> </div> <div class="modal-body"> <form action="{{scrapydApiUrl}}" method="post"> <table class="table table-striped table-hover"> <tr> <td>Project Name</td> <td><input type="text" name="project"></td> </tr> <tr> <td>Version</td> <td><input type="text" name="version"></td> </tr> <tr> <td>File</td> <td><input type="file" name="egg"></td> </tr> </table> </form> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal" onclick="$(\'#modelDeploy\').hide()">Cancel</button> <button type="button" class="btn btn-primary">Deploy/Update</button> </div> </div> </div> </div>'),a.put("views/main.html",'<div class="jumbotron"> <h1>\'Allo, \'Allo!</h1> <p class="lead"> <img src="images/yeoman.png" alt="I\'m Yeoman"><br> Always a pleasure scaffolding your apps. </p> <p><a class="btn btn-lg btn-success" ng-href="#/">Splendid!<span class="glyphicon glyphicon-ok"></span></a></p> </div> <div class="row marketing"> <h4>HTML5 Boilerplate</h4> <p> HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites. </p> <h4>Angular</h4> <p> AngularJS is a toolset for building the framework most suited to your application development. </p> <h4>Karma</h4> <p>Spectacular Test Runner for JavaScript.</p> </div>'),a.put("views/status.html",'<div style="margin-top:-30px"> <div class="row"> <div class="com-md-12"> <iframe src="/status/index.html" width="100%" height="2000px"></iframe> </div> </div> </div>')}]);