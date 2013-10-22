<?php

/**
 *     虚拟南师 http://vnjnu.innu.cn/
 *     Barrichello(巴里切罗) <ydfzgyj@baliqieluo.com>
 *     用户登陆
 */

if(!defined('VNJNU')) {
	exit('Access Denied');
}

switch($_gp['action']) {
case 'login':  //登陆
	if(isset($_SESSION['login'])) {
		exit;
	}
	if($_gp['username'] == '') {
		die('用户名为空');
	}
	if($_gp['password'] == '') {
		die('密码为空');
	}
	require ROOT.'uc_client/client.php';
	list($uid, $username, $password, $email) = uc_user_login($_gp['username'], $_gp['password']);
	if($uid > 0) {
		$store = isset($_gp['cookie']) ? 1 : 0;
		$sesid = session_id();
		setcookie('vnjnu', $sesid, 9999999999);
		$_SESSION['login']['uid'] = $uid;
		$_SESSION['login']['username'] = $username;
		$db->query("DELETE FROM `session` WHERE `uid`='$uid';");
		$db->query("INSERT INTO `session` (`sid`,`uid`,`username`,`store`) VALUES('$sesid','$uid','$username','$store');");
		include($template->getfile('logging.htm'));
		exit;
	} else if($uid == -1) {
		die('用户不存在');
	} else if($uid == -2) {
		die('密码错误');
	} else {
		die('未定义错误');
	}
	break;
case 'logout':  //退出登陆
	if(!isset($_SESSION['login'])) {
		exit;
	}
	$sesid = session_id();
	$db->query("DELETE FROM `session` WHERE `sid`='$sesid';");
	setcookie('vnjnu', $sesid, -1);
	unset($_SESSION['login']);
	include($template->getfile('logging.htm'));
	break;
default:
}

?>