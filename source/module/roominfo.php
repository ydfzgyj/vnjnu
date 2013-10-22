<?php

/**
 *     虚拟南师 http://vnjnu.innu.cn/
 *     Barrichello(巴里切罗) <ydfzgyj@baliqieluo.com>
 *     教室详情
 */

if(!defined('VNJNU')) {
	exit('Access Denied');
}

if(!isset($_gp['id']) || !isset($_gp['date']) || !isset($_gp['time']) || !isset($_gp['week'])) exit;
$id = $_gp['id'];
$date = $_gp['date'];
$time = $_gp['time'];
$week = $_gp['week'];

$query = $db->query("SELECT `name`,`type`,`seats`,`air`,`timeopen`,`timeclose` FROM `classroom` WHERE `id`='$id';");
$row = $db->fetch_array($query);
if($row['timeopen'] == '') $row['timeopen'] = '0000';
if($row['timeclose'] == '') $row['timeclose'] = '2400';
$room = $row;
$current = 0;
if($room['type']) {
    if($time >= $room['timeopen'] && $time < $room['timeclose']) {
        $query = $db->query("SELECT `id`,`name`,`teacher`,`ittid`,`students` FROM `course` WHERE `roomid`='$id' AND `week`='$week' AND `datebegin`<='$date' AND `dateend`>='$date' AND `timebegin`<='$time' AND `timeend`>'$time';");
        if($db->num_rows($query)) {
            $row = $db->fetch_array($query);
            $room['current'] = '当前课程：<strong>'.$row['name'].'</strong><br />任课教师：'.tranitt($row['ittid']).' '.$row['teacher'].'<br />选课人数：'.$row['students'];
            $current = $row['id'];
        } else {
            $room['current'] = '当前无课';
        }
    } else {
        $room['current'] = '当前关闭';
    }
}
$classes = array_chunk(array_pad(array(), 84, 0), 7);
$lesson = array(
    array('1', '8:00 - 8:40'),
    array('2', '8:45 - 9:25'),
    array('3', '9:40 - 10:20'),
    array('4', '10:35 - 11:15'),
    array('5', '11:20 - 12:00'),
    array('6', '13:30 - 14:10'),
    array('7', '14:15 - 14:55'),
    array('8', '15:10 - 15:50'),
    array('9', '15:55 - 16:35'),
    array('10', '18:30 - 19:10'),
    array('11', '19:20 - 20:00'),
    array('12', '20:10 - 20:50')
);
$query = $db->query("SELECT `id`,`name`,`teacher`,`ittid`,`students`,`week`,`timebegin`,`timeend` FROM `course` WHERE `roomid`='$id' AND `datebegin`<='$date' AND `dateend`>='$date';");
while($row = $db->fetch_array($query)) {
	$timebegin = time2class($row['timebegin'], 'num') - 1;
    $timeend = time2class($row['timeend'], 'num');
    $classes[$timebegin][$row['week'] - 1] = array($timeend - $timebegin, $row['name'].'<br>'.tranitt($row['ittid']).'<br>'.$row['teacher'], $current == $row['id'] ? 1 : 0);
    while(++ $timebegin < $timeend) {
        $classes[$timebegin][$row['week'] - 1] = -1;
    }
}

include($template->getfile('info.htm'));

?>