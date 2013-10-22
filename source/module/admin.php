<?php

/**
 *     虚拟南师 http://vnjnu.innu.cn/
 *     Barrichello(巴里切罗) <ydfzgyj@baliqieluo.com>
 *     管理面板
 */
 
header('Content-type: javascript/js');
if(!isset($_SESSION['login'])) {
	die('$(\'#submenu\').html(\'<p>您还没有登录，不能进入管理面板！</p><p><a href="javascript:;" onclick="$(\\\'#submenu\\\').empty().hide();">返回首页</a></p>\').show()');
} else if($_SESSION['login']['uid'] != 1) {
	die('$(\'#submenu\').html(\'<p>您不是管理员，不能进入管理面板！</p><p><a href="javascript:;" onclick="$(\\\'#submenu\\\').empty().hide();">返回首页</a></p>\').show()');
}

include($template->getfile('admin.htm'));

?>