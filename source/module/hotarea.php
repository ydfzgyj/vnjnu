<?php

/**
 *     虚拟南师 http://vnjnu.innu.cn/
 *     Barrichello(巴里切罗) <ydfzgyj@baliqieluo.com>
 *     热区弹出框
 */
 
if(!defined('VNJNU')) {
	exit('Access Denied');
}

$query = $db->query("SELECT `summary`,`detail`,`website` FROM `hotarea` WHERE `id`='{$_gp['id']}';");
$row = $db->fetch_array($query);
if($row['summary'] == '') $row['summary'] = '暂无介绍！';
echo '<p>　　', $row['summary'], '</p>';
if($row['detail'] == 1) echo '<a href="javascript:;" onclick="$.showInfo(\'room\', ', $_gp['id'], ')">楼层详图</a>';
if($row['website'] != '') echo '<a href="', $row['website'], '" target="_blank">进入主页</a>';
?>