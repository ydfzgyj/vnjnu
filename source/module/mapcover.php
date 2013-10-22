<?php
if(!defined('VNJNU')) {
	exit('Access Denied');
}

$query = $db->query("SELECT `id`,`name`,`type`,`level`,`{$_gp['mode']}path`,`{$_gp['mode']}center` FROM `hotarea` WHERE `{$_gp['mode']}center`!='';");
while($row = $db->fetch_array($query)) {
	$area[] = array('id'=>$row['id'], 'name'=>$row['name'], 'type'=>$row['type'], 'level'=>$row['level'], 'path'=>$row[$_gp['mode'].'path'], 'center'=>$row[$_gp['mode'].'center']);
}
echo json_encode($area);

?>