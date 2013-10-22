<?php

/**
 *     虚拟南师 http://vnjnu.innu.cn/
 *     Barrichello(巴里切罗) <ydfzgyj@baliqieluo.com>
 *     左侧二级菜单
 */
 
if(!defined('VNJNU')) {
	exit('Access Denied');
}

$return = '<p><a href="javascript:;" onclick="$(\'#submenu\').empty().hide();">返回首页</a></p>';
switch($_gp['id']) {
case 1:
    $return .= '
        <p><a href="javascript:;" onclick="$.showInfo(\'basic\',101);">南师概况</a></p>
        <p><a href="javascript:;" onclick="$.showInfo(\'basic\',102);">百年校史</a></p>
        <p><a href="javascript:;" onclick="$.showInfo(\'basic\',103);">校标校歌</a></p>
    ';
    break;
case 2:
    $return .= '
        <p><a href="javascript:;" onclick="$.showInfo(\'basic\',201);">制作团队</a></p>
        <p><a href="javascript:;" onclick="$.showInfo(\'basic\',202);">最新更新</a></p>
    ';
    break;
case 3:
    $return .= '<div id="bus"></div>';
    break;
case 4:
    $return .= '
        <p class="c"><a href="javascript:;" onclick="$.showInfo(\'basic\',301);">作息时间表</a></p>
        <p class="c"><input id="datepicker" readonly="readonly" value="" title="点击修改时间" /><input id="timepicker" readonly="readonly" value="" title="点击修改时间" /></p>
        <p class="c"><a href="javascript:;" onclick="$.showInfo(\'room\',1111);">查看<strong>学海楼(J1)</strong>课程</a></p>
        <p class="c"><a href="javascript:;" onclick="$.showInfo(\'room\',1112);">查看<strong>学正楼(J2)</strong>课程</a></p>
        <p class="c"><a href="javascript:;" onclick="$.showInfo(\'room\',1113);">查看<strong>学明楼(J3)</strong>课程</a></p>
    ';
    break;
default:
}

echo $return;

?>