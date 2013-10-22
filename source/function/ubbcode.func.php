<?php

/**
 *     虚拟南师 http://vnjnu.innu.cn/
 *     Barrichello(巴里切罗) <ydfzgyj@baliqieluo.com>
 *     UBB处理函数库
 */

if(!defined('VNJNU')) {
	exit('Access Denied');
}

$codeCount = array(
	'pcodecount' => -1,
	'codecount' => 0,
	'codehtml' => ''
);

/**
 *     ubb2html
 *     UBB转换为HTML
 *     @params string $message
 *     @return string
 */
function ubb2html($message) {
	global $codeCount;
	
	$msglower = strtolower($message);
	
	//先将code标签中的内容填入数组
	if(strpos($msglower, '[/code]') !== FALSE) {
		$message = preg_replace("/\s?\[code\](.+?)\[\/code\](\r\n)?\s?/ies", "parseCode('\\1')", $message);
	}

	if(strpos($msglower, '[/url]') !== FALSE) {
		$message = preg_replace("/\[url(=((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|thunder|qqdl|synacast){1}:\/\/|www\.|mailto:)?([^\r\n\[\"']+?))?\](.+?)\[\/url\]/ies", "parseUrl('\\1', '\\5')", $message);
	}

	//表格最多嵌套5层
	$nest = 0;
	while(strpos($msglower, '[table') !== FALSE && strpos($msglower, '[/table]') !== FALSE){
		$message = preg_replace("/\[table(?:=(\d{1,4}%?)(?:,([\(\)%,#\w]+))?)?\]\s*(.+?)\s*\[\/table\]/ies", "parseTable('\\1', '\\2', '\\3')", $message);
		if(++$nest > 4) break;
	}

	$message = str_replace(array(
		'[/color]', '[/size]', '[/align]', '[b]', '[/b]', '[i]', '[/i]', '[u]', '[/u]', '[s]', '[/s]', "[hr]\r\n"
		), array(
		'</span>', '</span>', '</p>', '<strong>', '</strong>', '<i>', '</i>', '<u>', '</u>', '<strike>', '</strike>', '<hr class="ubb_hr" />'
		), preg_replace(array(
		"/\[color=([#\w]+?)\]/i",
		"/\[size=(\d{1,2}?)\]/i",
		"/\[align=(left|center|right|justify)\]/i",
		"/\[face=([\.\/\w]+?)\,(.+?)\]/i"
		), array(
		"<span style=\"color:\\1\">",
		"<span style=\"font-size:\\1px\">",
		"<p align=\"\\1\">",
		"<img src=\"./images/face/\\1\" alt=\"\\2\" title=\"\\2\" />"
		), $message));

	if(strpos($msglower, '[/quote]') !== FALSE) {
		$message = preg_replace("/\s?\[quote\][\n\r]*(.+?)[\n\r]*\[\/quote\]\s?/is", "<div class=\"ubb_quote\"><blockquote>\$1</blockquote></div>", $message);
	}
	if(strpos($msglower, '[/flash]') !== FALSE) {
		$message = preg_replace("/\[flash(=(\d+),(\d+))?\]\s*([^\[\<\r\n]+?)\s*\[\/flash\]/ies", "parseFlash('\\2', '\\3', '\\4');", $message);
	}
	if(strpos($msglower, '[/img]') !== FALSE) {
		$message = preg_replace(array(
			"/\[img\]\s*([^\[\<\r\n]+?)\s*\[\/img\]/ies",
			"/\[img=(\d{1,4})[x|\,](\d{1,4})\]\s*([^\[\<\r\n]+?)\s*\[\/img\]/ies",
			"/\[img=(.+?)\]\s*([^\[\<\r\n]+?)\s*\[\/img\]/ies"
		), array(
			"parseImg(0, 0, '\\1')",
			"parseImg('\\1', '\\2', '\\3')",
			"parseImg(0, 0, '\\1', '\\2')"
		), $message);
	}

	//最后将code标签中的内容添加回来
	for($i = 0; $i <= $codeCount['pcodecount']; $i++) {
		$message = str_replace("[\tUBBCODE_$i\t]", $codeCount['codehtml'][$i], $message);
	}

	unset($msglower);
	return nl2br(str_replace(array("\t", '    '), array('&nbsp;&nbsp;&nbsp;&nbsp;', '　　'), $message));
}

/**
 *     parseCode
 *     解析code标签
 *     @params string $code
 *     @return string
 */
function parseCode($code) {
	global $codeCount;
	$codeCount['pcodecount']++;
	$code = str_replace("\n", "<li>", $code);
	$codeCount['codehtml'][$codeCount['pcodecount']] = '<div class="ubb_code"><ol><li>'.$code.'</ol></div>';
	$codeCount['codecount']++;
	return "[\tUBBCODE_".$codeCount['pcodecount']."\t]";
}

/**
 *     parseUrl
 *     解析url标签
 *     @params string $url
 *     @params string $text
 *     @return string
 */
function parseUrl($url, $text) {
	if(!$url && preg_match("/((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|thunder|qqdl|synacast){1}:\/\/|www\.)[^\[\"']+/i", trim($text), $matches)) {
		$url = $matches[0];
		$length = 65;
		if(strlen($url) > $length) {
			$text = substr($url, 0, intval($length * 0.5)).' ... '.substr($url, - intval($length * 0.3));
		}
		return '<a href="'.(substr(strtolower($url), 0, 4) == 'www.' ? 'http://'.$url : $url).'" target="_blank">'.$text.'</a>';
	} else {
		$url = substr($url, 1);
		if(substr(strtolower($url), 0, 4) == 'www.') {
			$url = 'http://'.$url;
		}
		return '<a href="'.$url.'" target="_blank">'.$text.'</a>';
	}
}

/**
 *     parseImg
 *     解析img标签
 *     @params number $width
 *     @params number $height
 *     @params string $src
 *     @params string $alt
 *     @params number $zoom
 *     @return string
 */
function parseImg($width, $height, $src, $alt = '', $zoom = 0) {
	if(strstr($src, 'file:') || substr($src, 1, 1) == ':') {
		return $src;
	}
	if($width > 500) {
		$height = intval(500 * $height / $width);
		$width = 500;
		$zoom = 1;
	}
	return ($zoom ? '<a href="'.$src.'" target="_blank" style="font-size:12px;">点击查看大图</a><br />' : '').'<img src="'.$src.'" alt="'.($alt ? $alt : '综合性山寨网站 - 巴里切罗').'" title="'.($alt ? $alt : '综合性山寨网站 - 巴里切罗').'" style="'.($width > 0 ? 'width:'.$width.'px;' : '').($height > 0 ? 'height:'.$height.'px' : '').'" onload="if(this.width>500)this.width=500;" />';
}

/**
 *     parseFlash
 *     解析flash标签
 *     @params number $width
 *     @params number $height
 *     @params string $url
 *     @return string
 */
function parseFlash($width, $height, $url) {
	$width = !$width ? 480 : $width;
	$height = !$height ? 400 : $height;
	if($width > 500) {
		$height = intval(500 * $height / $width);
		$width = 500;
	}
	return '<embed src="'.$url.'" width="'.$width.'" height="'.$height.'" quality="high"  bgcolor="#ffffff"  allowNetworking="internal" allowScriptAccess="never" allowfullscreen="true" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" wmode="transparent"></embed>';
}

/**
 *     parseTable
 *     解析table标签
 *     @params number $width
 *     @params string $bgcolor
 *     @params string $message
 *     @return string
 */
function parseTable($width, $bgcolor, $message) {
	if(strpos($message, '[/tr]') === FALSE && strpos($message, '[/td]') === FALSE) {
		$rows = explode("\n", $message);
		$s = '<table class="ubb_table" '.
			($width == '' ? NULL : 'style="width:'.$width.'"').
			($bgcolor ? ' bgcolor="'.$bgcolor.'">' : '>');
		foreach($rows as $row) {
			$s .= '<tr><td>'.str_replace(array('\|', '|', '\n'), array('&#124;', '</td><td>', "\n"), $row).'</td></tr>';
		}
		$s .= '</table>';
		return $s;
	} else {
		if(!preg_match("/^\[tr(?:=([\(\)\s%,#\w]+))?\]\s*\[td([=\d,%]+)?\]/", $message) && !preg_match("/^<tr[^>]*?>\s*<td[^>]*?>/", $message)) {
			return str_replace('\\"', '"', preg_replace("/\[tr(?:=([\(\)\s%,#\w]+))?\]|\[td([=\d,%]+)?\]|\[\/td\]|\[\/tr\]/", '', $message));
		}
		if(substr($width, -1) == '%') {
			$width = substr($width, 0, -1) <= 98 ? intval($width).'%' : '98%';
		} else {
			$width = intval($width);
			$width = $width ? ($width <= 560 ? $width.'px' : '98%') : '';
		}
		return '<table class="ubb_table" '.
			($width == '' ? NULL : 'style="width:'.$width.'"').
			($bgcolor ? ' bgcolor="'.$bgcolor.'">' : '>').
			str_replace('\\"', '"', preg_replace(array(
					"/\[tr(?:=([\(\)\s%,#\w]+))?\]\s*\[td(?:=(\d{1,4}%?))?\]/ie",
					"/\[\/td\]\s*\[td(?:=(\d{1,4}%?))?\]/ie",
					"/\[tr(?:=([\(\)\s%,#\w]+))?\]\s*\[td(?:=(\d{1,2}),(\d{1,2})(?:,(\d{1,4}%?))?)?\]/ie",
					"/\[\/td\]\s*\[td(?:=(\d{1,2}),(\d{1,2})(?:,(\d{1,4}%?))?)?\]/ie",
					"/\[\/td\]\s*\[\/tr\]\s*/i"
				), array(
					"parseTrTd('\\1', '0', '0', '\\2')",
					"parseTrTd('td', '0', '0', '\\1')",
					"parseTrTd('\\1', '\\2', '\\3', '\\4')",
					"parseTrTd('td', '\\1', '\\2', '\\3')",
					'</td></tr>'
				), $message)
			).'</table>';
	}
}

/**
 *     parseTrTd
 *     解析tr和td标签
 *     @params string $bgcolor
 *     @params number $colspan
 *     @params number $rowspan
 *     @params number $width
 *     @return string
 */
function parseTrTd($bgcolor, $colspan, $rowspan, $width) {
	return ($bgcolor == 'td' ? '</td>' : '<tr'.($bgcolor ? ' style="background-color:'.$bgcolor.'"' : '').'>').'<td'.($colspan > 1 ? ' colspan="'.$colspan.'"' : '').($rowspan > 1 ? ' rowspan="'.$rowspan.'"' : '').($width ? ' width="'.$width.'"' : '').'>';
}

/**
 *     highLightWord
 *     高亮关键字
 *     @params string $text
 *     @params string $words
 *     @params string $prepend
 *     @return string
 */
function highLightWord($text, $words, $prepend) {
	$text = str_replace('\"', '"', $text);
	foreach($words AS $key => $replaceword) {
		$text = str_replace($replaceword, '<highlight>'.$replaceword.'</highlight>', $text);
	}
	return "$prepend$text";
}

/**
 *     closeTag
 *     闭合UBB代码
 *     @params string $message
 *     @return string
 */
function closeTag($message) {
	preg_match_all("/\[(.+?)\]/is", $message, $ubbgroup);
	$ubbstack = array();
	foreach($ubbgroup[1] as $ubb) {
		$ubb = explode('=', $ubb);
		$ubb = $ubb[0];
		if(in_array($ubb, array('b','i','u','s','align','color','size','url','img','flash','table','tr','td','quote','code'))) {
			array_push($ubbstack, $ubb);
		} elseif(in_array($ubb, array('/b','/i','/u','/s','/align','/color','/size','/url','/img','/flash','/table','/tr','/td','/quote','/code'))) {
			$ubb = substr($ubb, 1);
			end($ubbstack);
			while(current($ubbstack) != $ubb) prev($ubbstack);
			array_splice($ubbstack, key($ubbstack), 1);
		}
	}
	$startpos = strrpos($message, '[');
	if($startpos > strrpos($message, ']')) {
		$message = substr($message, 0, $startpos);
	}
	while(count($ubbstack) > 0) {
		$message .= '[/'.array_pop($ubbstack).']';
	}
	return $message;
}

?>