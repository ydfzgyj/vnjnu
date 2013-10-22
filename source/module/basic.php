<?php

/**
 *     虚拟南师 http://vnjnu.innu.cn/
 *     Barrichello(巴里切罗) <ydfzgyj@baliqieluo.com>
 *     基础信息
 */

if(!defined('VNJNU')) {
	exit('Access Denied');
}

if(!isset($_gp['id'])) exit;

$query = $db->query("SELECT `name`,`text` FROM `basic` WHERE `id`='{$_gp['id']}';");
$row = $db->fetch_array($query);
if($row['name'] == '') die('　　内容暂缺！');
$name = $row['name'];
$tabs[] = $row['text'];

include($template->getfile('room.htm'));

?>