<?php

/**
 *     综合性山寨网站 - 巴里切罗 http://www.baliqieluo.com/
 *     Barrichello(巴里切罗) <ydfzgyj@baliqieluo.com>
 *     编辑器处理
 */

require './core.inc.php';

if(isset($_gp['mod'])) {
	$mod = $_gp['mod'];
} else {
	exit;
}
switch($mod) {
case 'attach':  //附件
	if(isset($_gp['action'])) {
		$action = $_gp['action'];
	} else {
		$action = 'list';
	}
	if(isset($_gp['tid'])) {
		$tid = $_gp['tid'];
	} else {
		$tid = 0;
	}
	switch($action) {
	case 'list':  //附件列表
		$query = $db->query("SELECT * FROM `blog_attachment` WHERE `tid`='$tid';");
		while($row = $db->fetch_array($query)) {
			if($row['isimage']) {
				$row['attachment'] = './attachments/'.$row['attachment'];
			} else {
				$row['attachment'] = './source/include/editor.php?mod=attach&action=down&aid='.$row['aid'];
			}
			$row['filesize'] = round($row['filesize'] / 1024, 2).' KB';
			$attachments[] = $row;
		}
		include($template->getfile('admin/attachment.htm'));
	break;
	case 'upload':  //上传附件
		if ($_FILES['file']['error'] > 0) {
			die('{"success":false,"msg":"上传发生错误！"}');
		} else {
			$path_info = pathinfo($_FILES['file']['name']);
			$month = date('Ym', $_client['time']);
			if(preg_match("/image\/png|image\/x\-png|image\/jpg|image\/jpeg|image\/pjpeg|image\/gif|image\/bmp/i", $_FILES['file']['type'])) {
				$isimage = 1;
				$extension = $path_info['extension'];
			} else {
				$isimage = 0;
				$extension = 'attach';
			}
			do {
				$filename = $month.'/'.seccode(16).'.'.$extension;
			} while (file_exists(ROOT.'/attachments/'.$filename));
			if(!file_exists(ROOT.'/attachments/'.$month)) {
				mkdir(ROOT.'attachments/'.$month);
			}
			move_uploaded_file($_FILES['file']['tmp_name'], ROOT.'/attachments/'.$filename);
			$db->query("INSERT INTO `blog_attachment` (`tid`,`dateline`,`filename`,`filetype`,`filesize`,`attachment`,`isimage`) VALUES('$tid','{$_client['time']}','{$_FILES['file']['name']}','{$_FILES['file']['type']}','{$_FILES['file']['size']}','$filename','$isimage');");
			echo '{"success":true}';
		}
	break;
	case 'delete':  //删除附件
		isset($_gp['aid']) ? $aid = $_gp['aid'] : exit;
		$query = $db->query("SELECT `attachment` FROM `blog_attachment` WHERE `aid`='$aid';");
		$row = $db->fetch_array($query);
		unlink(ROOT.'/attachments/'.$row['attachment']);
		$db->query("DELETE FROM `blog_attachment` WHERE `aid`='$aid';");
		break;
	case 'down':  //下载附件
		isset($_gp['aid']) ? $aid = $_gp['aid'] : exit;
		$query = $db->query("SELECT `filename`,`filetype`,`filesize`,`attachment` FROM `blog_attachment` WHERE `aid`='$aid';");
		$row = $db->fetch_array($query);
		$db->query("UPDATE `blog_attachment` SET `downloads`=`downloads`+1 WHERE `aid`='$aid';");
		header('Content-type: '.$row['filetype']);
		if(preg_match("/Internet Explorer/", $_client['browser']['browser'])) {
			header('Content-Disposition: attachment; filename="'.rawurlencode($row['filename']).'"');
		} elseif(preg_match("/Firefox/", $_client['browser']['browser'])) {
			header("Content-Disposition: attachment; filename*=\"utf8''".$row['filename'].'"');
		} else {
			header('Content-Disposition: attachment; filename="'.$row['filename'].'"');
		}
		header('Content-Length: '.$row['filesize']);
		readfile(ROOT.'/attachments/'.$row['attachment']);
		break;
	}
	break;
case 'face':  //表情
	$typeid = isset($_gp['typeid']) ? $_gp['typeid'] : 1;
	$eachpage = 30;
	$query = $db->query("SELECT count(*) FROM `common_face` WHERE `typeid`='$typeid';");
	$row = $db->fetch_array($query);
	$num = $row['count(*)'];
	$pages = ceil($num / $eachpage);
	$query = $db->query("SELECT `type`,`desc`,`url` FROM `common_face` WHERE `typeid`='$typeid' ORDER BY `id` LIMIT ".(($cp - 1) * $eachpage).",".$eachpage);
	$i = 0;
	while($row = $db->fetch_array($query)) {
		echo '<img src="./images/face/'.$row['type'].'/'.$row['url'].'" alt="'.$row['type'].'/'.$row['url'].'" title="'.$row['desc'].'" />';
		if(++ $i >= 10) {
			echo '<br />';
			$i = 0;
		}
	}
	echo '<div class="multipage">'.multipage($cp, $pages, "$('#ubb_face_main').load('./source/include/editor.php', {'mod': 'face', 'cp': |||})", 'ajax').'</div>';
	break;
case 'at':  //@
	isset($_gp['user']) ? $user = $_gp['user'] : exit;
	$count = 0;
	$html = '';
	$query = $db->query("SELECT `username` FROM `common_user` WHERE `username` LIKE '%$user%' ORDER BY `lastvisit` DESC LIMIT 5;");
	while($row = $db->fetch_array($query)) {
		$count ++;
		$html .= '<li>'.$row['username'].'</li>';
	}
	if($count < 5) {
		$count = 5 - $count;
		$query = $db->query("SELECT `username` FROM `common_user` WHERE `username` NOT LIKE '%$user%' ORDER BY `lastvisit` DESC LIMIT $count;");
		while($row = $db->fetch_array($query)) {
			$html .= '<li>'.$row['username'].'</li>';
		}
	}
	echo $html;
	break;
}

?>