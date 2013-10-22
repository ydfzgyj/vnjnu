<?php

/**
 *     虚拟南师 http://vnjnu.innu.cn/
 *     Barrichello(巴里切罗) <ydfzgyj@baliqieluo.com>
 *     核心处理
 */

if(basename($_SERVER['PHP_SELF']) == 'core.inc.php') {
	exit('Access Denied');
}

define('VNJNU', true);
define('ROOT', substr(dirname(__FILE__), 0, -14));
date_default_timezone_set('PRC');
error_reporting(E_ALL);
ini_set("display_errors","On");

require ROOT.'source/include/config.inc.php';
require ROOT.'source/function/core.func.php';
// require ROOT.'uc_client/client.php';

//模板
require ROOT.'/source/class/template.class.php';
$template = Template::getInstance();
$template->setOptions($_config['template']);

//用户信息
global $_client;
$_client = array(
	'date' => date("Y-m-d H:i"),
	'avatar' => '',
	'setting' => array()
);

//连接数据库
require ROOT.'/source/class/db.class.php';
$db = new db(
	$_config['db']['host'],
	$_config['db']['user'],
	$_config['db']['pw'],
	$_config['db']['charset'],
	$_config['db']['name'],
	$_config['db']['pconnect']
);

//Get和Post处理
foreach(array_merge($_POST, $_GET) as $k => $v) {
	$_gp[$k] = newHtmlSpecialChars($v);
}
$cp = empty($_gp['cp']) ? 1 : max(1, intval($_gp['cp']));

//Session处理
if(isset($_COOKIE['vnjnu'])) {
	$sesid = $_COOKIE['vnjnu'];
	session_id($sesid);
	session_start();
	if(!isset($_SESSION['login'])) {
		$query = $db->query("SELECT `uid`,`username`,`store` FROM `session` WHERE `sid`='$sesid';");
		$row = $db->fetch_array($query);
		if(!isset($row['uid'])) {
			setcookie('vnjnu', $sesid, -1);
		} else if($row['store'] == 0) {
			setcookie('vnjnu', $sesid, -1);
			$db->query("DELETE FROM `session` WHERE `sid`='$sesid';");
		} else {
			$_SESSION['login']['uid'] = $row['uid'];
			$_SESSION['login']['username'] = $row['username'];
		}
	}
} else {
	session_start();
}

//系统设置
// $query = $db->query("SELECT * FROM `setting`;");
// while($row = $db->fetch_array($query)) {
	// $_client['setting'][$row['name']] = $row['var'];
// }

//生成安全码
if(!isset($_SESSION['authkey'])) {
	$_SESSION['authkey'] = seccode(6);
}

?>