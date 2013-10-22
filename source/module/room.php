<?php

/**
 *     虚拟南师 http://vnjnu.innu.cn/
 *     Barrichello(巴里切罗) <ydfzgyj@baliqieluo.com>
 *     教室
 */

if(!defined('VNJNU')) {
	exit('Access Denied');
}

if(!isset($_gp['id']) || !isset($_gp['date']) || !isset($_gp['time']) || !isset($_gp['week'])) exit;
$id = $_gp['id'];
$date = $_gp['date'];
$time = $_gp['time'];
$week = $_gp['week'];

$realweek = gmdate("l", mktime(0, 0, 0, substr($date, 4, 2), substr($date, 6, 2), substr($date, 0, 4)));
$timestring = substr($date, 0, 4).'-'.substr($date, 4, 2).'-'.substr($date, 6, 2).' '.substr($time, 0, 2).':'.substr($time, 2, 2).' '.weeken2zh($realweek).' '.time2class($time, 'chn');

$query = $db->query("SELECT `name` FROM `hotarea` WHERE `id`='$id';");
$row = $db->fetch_array($query);
$name = str_replace(',', '', $row['name']);
if($id == 1101) {$num = 8;}
else if($id == 1111) {$num = 5;}
else if($id == 1112) {$num = 5;}
else if($id == 1113) {$num = 5;}
else {$num = 0;}
$query = $db->query("SELECT `name`,`roomid`,`teacher`,`ittid` FROM `course` WHERE `week`='$week' AND `datebegin`<='$date' AND `dateend`>'$date' AND `timebegin`<='$time' AND `timeend`>'$time';");
while($row = $db->fetch_array($query)) {
    $classes[$row['roomid']] = $row;
}
$list = '';
for($i = 1; $i <= $num; $i ++) {
	$list .= '<a href="#roommain'.$i.'"'.($i == 1 ? ' class="current"' : '').'>'.tranfloor($i).'</a>';
	$content = '<div id="roommain'.$i.'" class="roommain" style="'.($i == 1 ? '' : 'display:none;').'position:relative;"><img src="./static/images/building/'.$id.'/'.$i.'.png" />';
	$query = $db->query("SELECT * FROM `classroom` WHERE `building`='$id' AND `floor`='$i';");
	while($row = $db->fetch_array($query)) {
        if($row['timeopen'] == '') $row['timeopen'] = '0000';
        if($row['timeclose'] == '') $row['timeclose'] = '2400';
		$row['style'] = 'width:'.$row['width'].'px;height:'.$row['height'].'px;left:'.$row['left'].'px;top:'.$row['top'].'px;';
		$row['onclick'] = $row['title'] =  '';
		if($row['type']) {
			if($time >= $row['timeopen'] && $time < $row['timeclose']) {
				if(isset($classes[$row['id']])) {
                    $current = $classes[$row['id']];
					$row['name'] .= '<br>'.$classes[$row['id']]['name'];
					$row['style'] .= 'background:#f88;cursor:pointer;';
					$row['title'] = $current['name'].'&#10;'.tranitt($current['ittid']).'&#10;'.$current['teacher'];
				} else {
					$row['name'] .= '<br>无课';
					$row['style'] .= 'background:#8f8;cursor:pointer;';
				}
			} else {
				$row['name'] .= '<br>关闭';
				$row['style'] .= 'cursor:pointer;';
			}
			$row['onclick'] = '$.showInfo(\'info\', '.$row['id'].', \''.$date.'\', \''.$time.'\', \''.$week.'\');';
		}
    $content .= '<div class="classroom" style="'.$row['style'].'" onclick="'.$row['onclick'].'" title="'.$row['title'].'">'.$row['name'].'</div>';
	}
	$content .= '</div>';
	$tabs[] = $content;
}

include($template->getfile('room.htm'));

?>