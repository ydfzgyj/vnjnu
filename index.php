<?php

/**
 *     虚拟南师 http://vnjnu.innu.cn/
 *     Barrichello(巴里切罗) <ydfzgyj@baliqieluo.com>
 *     主页
 */

require './source/include/core.inc.php';

if(isset($_gp['mod'])) {
	$mod = $_gp['mod'];
} else {
	include($template->getfile('index.htm'));
	exit;
}

$file = './source/module/'.$mod.'.php';
if(file_exists($file)) require $file;

?>