<?php

/**
 *     虚拟南师 http://vnjnu.innu.cn/
 *     Barrichello(巴里切罗) <ydfzgyj@baliqieluo.com>
 *     核心处理函数库
 */

if(!defined('VNJNU')) {
	exit('Access Denied');
}

/**
 *     newHtmlSpecialChars
 *     替换特殊符号
 *     @params string $string
 *     @return string
 */
function newHtmlSpecialChars($string) {
	if(is_array($string)) {
		foreach($string as $key => $val) {
			$string[$key] = newHtmlSpecialChars($val);
		}
	} else {
		$string = str_replace(array('&', '"', '<', '>', '\\\'', '\\\\'), array('&#38;', '&#34;', '&#60;', '&#62;', '&#39;', '&#92;'), $string);
		if(strpos($string, '&amp;#') !== false) {
			$string = preg_replace('/&amp;((#(\d{3,5}|x[a-fA-F0-9]{4}));)/', '&\\1', $string);
		}
		$string = trim($string);
	}
	return $string;
}

/**
 *     multipage
 *     分页函数
 *     @params number $cp
 *     @params number $pages
 *     @params string $url
 *     @params string $mode
 *     @return string
 */
function multipage($cp, $pages, $url, $mode = 'php') {
	$multi = '';
	if($cp > 5) {
		if($mode == 'php') {
			$multi .= '<a href="'.$url.'=1">1...</a><a href="'.$url.'='.($cp - 1).'">&lt;&lt;</a>';
		} else if ($mode == 'html') {
			$multi .= '<a href="'.$url.'-1.html">1...</a><a href="'.$url.'-'.($cp - 1).'.html">&lt;&lt;</a>';
		} else if ($mode == 'ajax') {
			$multi .= '<a href="javascript:;" onclick="'.str_replace('|||', 1, $url).'">1...</a><a href="javascript:;" onclick="'.str_replace('|||', $cp - 1, $url).'">&lt;&lt;</a>';
		}
		$pstart = $cp - 4;
	} else {
		$pstart = 1;
	}
	if($cp < $pages - 4) {
		$pend = $cp + 4;
	} else {
		$pend = $pages;
	}
	for($i = $pstart; $i <= $pend; $i ++) {
		if($i != $cp) {
			if($mode == 'php') {
				$multi .= '<a href="'.$url.'='.$i.'">'.$i.'</a>';
			} else if ($mode == 'html') {
				$multi .= '<a href="'.$url.'-'.$i.'.html">'.$i.'</a>';
			} else if ($mode == 'ajax') {
				$multi .= '<a href="javascript:;" onclick="'.str_replace('|||', $i, $url).'">'.$i.'</a>';
			}
		} else {
			$multi .= '<strong>'.$i.'</strong>';
		}
	}
	if($cp < $pages - 4) {
		if($mode == 'php') {
			$multi .= '<a href="'.$url.'='.($cp + 1).'">&gt;&gt;</a><a href="'.$url.'='.$pages.'">...'.$pages.'</a>';
		} else if ($mode == 'html') {
			$multi .= '<a href="'.$url.'-'.($cp + 1).'.html">&gt;&gt;</a><a href="'.$url.'-'.$pages.'.html">...'.$pages.'</a>';
		} else if ($mode == 'ajax') {
			$multi .= '<a href="javascript:;" onclick="'.str_replace('|||', $cp + 1, $url).'">&gt;&gt;</a><a href="javascript:;" onclick="'.str_replace('|||', $pages, $url).'">...'.$pages.'</a>';
		}
	}
	return $multi;
}

/**
 *     authcode
 *     加密解密
 *     @params string $string
 *     @params string $operation
 *     @params string $key
 *     @params number $expiry
 *     @return string
 */
function authcode($string, $operation = 'DECODE', $key = '', $expiry = 0) {
	$ckey_length = 4;
	$key = md5($key != '' ? $key : $_SESSION['authkey']);
	$keya = md5(substr($key, 0, 16));
	$keyb = md5(substr($key, 16, 16));
	$keyc = $ckey_length ? ($operation == 'DECODE' ? substr($string, 0, $ckey_length) : substr(md5(microtime()), -$ckey_length)) : '';

	$cryptkey = $keya.md5($keya.$keyc);
	$key_length = strlen($cryptkey);

	$string = $operation == 'DECODE' ? base64_decode(substr($string, $ckey_length)) : sprintf('%010d', $expiry ? $expiry + time() : 0).substr(md5($string.$keyb), 0, 16).$string;
	$string_length = strlen($string);

	$result = '';
	$box = range(0, 255);

	$rndkey = array();
	for($i = 0; $i <= 255; $i++) {
		$rndkey[$i] = ord($cryptkey[$i % $key_length]);
	}

	for($j = $i = 0; $i < 256; $i++) {
		$j = ($j + $box[$i] + $rndkey[$i]) % 256;
		$tmp = $box[$i];
		$box[$i] = $box[$j];
		$box[$j] = $tmp;
	}

	for($a = $j = $i = 0; $i < $string_length; $i++) {
		$a = ($a + 1) % 256;
		$j = ($j + $box[$a]) % 256;
		$tmp = $box[$a];
		$box[$a] = $box[$j];
		$box[$j] = $tmp;
		$result .= chr(ord($string[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
	}

	if($operation == 'DECODE') {
		if((substr($result, 0, 10) == 0 || substr($result, 0, 10) - time() > 0) && substr($result, 10, 16) == substr(md5(substr($result, 26).$keyb), 0, 16)) {
			return substr($result, 26);
		} else {
			return '';
		}
	} else {
		return $keyc.str_replace('=', '', base64_encode($result));
	}
}

/**
 *     seccode
 *     生成随机字符串
 *     @params number $length
 *     @params string $type
 *     @return string
 */
function seccode($length, $type = '111') {
	$chars = $string = '';
	$chars .= substr($type, 0, 1) == '1' ? 'abcdefghijklmnopqrstuvwxyz' : '';
	$chars .= substr($type, 1, 1) == '1' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '';
	$chars .= substr($type, 2, 1) == '1' ? '0123456789' : '';
	for($i = 0; $i < $length; $i ++) {
		$string .= $chars[mt_rand(0, strlen($chars) - 1)];
	}
	return $string;
}

/**
 *     time2class
 *     时间换算课时
 *     @params number $i
 *     @params string $type
 *     @return string
 */
function time2class($i, $type) {
	if($type == 'chn') {
		if($i >= 0 && $i < 800) {return '晚间休息';}
		else if($i >= 800 && $i < 840) {return '第一节课';}
		else if($i >= 840 && $i < 845) {return '一二节课间休息';}
		else if($i >= 845 && $i < 925) {return '第二节课';}
		else if($i >= 925 && $i < 940) {return '二三节课间休息';}
		else if($i >= 940 && $i < 1020) {return '第三节课';}
		else if($i >= 1020 && $i < 1035) {return '三四节课间休息';}
		else if($i >= 1035 && $i < 1115) {return '第四节课';}
		else if($i >= 1115 && $i < 1120) {return '四五节课间休息';}
		else if($i >= 1120 && $i < 1200) {return '第五节课';}
		else if($i >= 1200 && $i < 1330) {return '午间休息';}
		else if($i >= 1330 && $i < 1410) {return '第六节课';}
		else if($i >= 1410 && $i < 1415) {return '六七节课间休息';}
		else if($i >= 1415 && $i < 1455) {return '第七节课';}
		else if($i >= 1455 && $i < 1510) {return '七八节课间休息';}
		else if($i >= 1510 && $i < 1550) {return '第八节课';}
		else if($i >= 1550 && $i < 1555) {return '八九节课间休息';}
		else if($i >= 1555 && $i < 1635) {return '第九节课';}
		else if($i >= 1635 && $i < 1830) {return '晚餐';}
		else if($i >= 1830 && $i < 1910) {return '第十节课';}
		else if($i >= 1910 && $i < 1920) {return '十、十一节课间休息';}
		else if($i >= 1920 && $i < 2000) {return '第十一节课';}
		else if($i >= 2000 && $i < 2010) {return '十一、十二节课间休息';}
		else if($i >= 2010 && $i < 2050) {return '第十二节课';}
		else if($i >= 2050 && $i < 2400) {return '晚间休息';}
		else {return '';}
	} else if($type == 'num') {
		if($i == 800 || $i == 840) {return 1;}
		else if($i == 845 || $i == 925) {return 2;}
		else if($i == 940 || $i == 1020) {return 3;}
		else if($i == 1035 || $i == 1115) {return 4;}
		else if($i == 1120 || $i == 1200) {return 5;}
		else if($i == 1330 || $i == 1410) {return 6;}
		else if($i == 1415 || $i == 1455) {return 7;}
		else if($i == 1510 || $i == 1550) {return 8;}
		else if($i == 1555 || $i == 1635) {return 9;}
		else if($i == 1830 || $i == 1910) {return 10;}
		else if($i == 1920 || $i == 2000) {return 11;}
		else if($i == 2010 || $i == 2050) {return 12;}
		else {return 0;}
	}
}

/**
 *     tranfloor
 *     输出楼层
 *     @params number $i
 *     @return string
 */
function tranfloor($i) {
	switch($i) {
		case -1: return '地下一楼'; break;
		case 1: return '一楼'; break;
		case 2: return '二楼'; break;
		case 3: return '三楼'; break;
		case 4: return '四楼'; break;
		case 5: return '五楼'; break;
		case 6: return '六楼'; break;
		case 7: return '七楼'; break;
		case 8: return '八楼'; break;
	}
}

/**
 *     tranitt
 *     输出学院
 *     @params number $itt
 *     @return string
 */
function tranitt($itt) {
	switch($itt) {
		case 1: return '文学院'; break;
		case 2: return '社发院'; break;
		case 3: return '公管院'; break;
		case 4: return '教科院'; break;
		case 5: return '外院'; break;
		case 6: return '数科院'; break;
		case 7: return '物科院'; break;
		case 8: return '化科院'; break;
		case 9: return '生科院'; break;
		case 10: return '地科院'; break;
		case 11: return '音乐学院'; break;
		case 12: return '美院'; break;
		case 13: return '体科院'; break;
		case 14: return '新传院'; break;
		case 15: return '商学院'; break;
		case 16: return '金女院'; break;
		case 17: return '法学院'; break;
		case 18: return '心理学院'; break;
		case 19: return '计科院'; break;
		case 20: return '能源院'; break;
		case 21: return '电自院'; break;
		case 22: return '教师院'; break;
		case 23: return '强化院'; break;
		case 24: return '国教院'; break;
        case 43: return '人武院'; break;
		case 31: return '教务处'; break;
        case 32: return '马克思院'; break;
		case 33: return '大外部'; break;
        case 34: return '大数部'; break;
        case 35: return '公体部'; break;
		case 36: return '研究生部'; break;
		case 37: return '学工处'; break;
		case 38: return '图书馆'; break;
		case 39: return '分析测试中心'; break;
        case 41: return '中北学院'; break;
        case 42: return '泰州学院'; break;
        case 43: return '人武院'; break;
        default: return tranitt($itt - 50).'研';
	}
}

/**
 *     weeken2zh
 *     输出星期
 *     @params string $day
 *     @return string
 */
function weeken2zh($day) {
	switch($day) {
		case 'Monday': return '星期一'; break;
		case 'Tuesday': return '星期二'; break;
		case 'Wednesday': return '星期三'; break;
		case 'Thursday': return '星期四'; break;
		case 'Friday': return '星期五'; break;
		case 'Saturday': return '星期六'; break;
		case 'Sunday': return '星期日'; break;
	}
}

?>