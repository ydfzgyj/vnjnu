<?php

/*
 *     虚拟南师 http://vnjnu.innu.cn/
 *     Barrichello(巴里切罗) <ydfzgyj@baliqieluo.com>
 *     数据库操作类库
 */
 
class db {
	// 查询总次数
    var $querynum = 0;
	// 连接句柄
    var $link;
	
	// 构造函数/连接数据库
	function __construct($dbhost, $dbuser, $dbpw, $dbcharset, $dbname, $pconnect) {
		$func = empty($pconnect) ? 'mysql_connect' : 'mysql_pconnect';
		if(!$this->link = $func($dbhost, $dbuser, $dbpw)) {
			$this->halt('Can not connect to MySQL server');
		} else {
			mysql_query("set names '$dbcharset'");
			mysql_select_db($dbname, $this->link) or $this->halt('Can not find the database');
		}
	}
	
	//取出结果中一条记录
    function fetch_array($query, $result_type = MYSQL_ASSOC) {
        return mysql_fetch_array($query, $result_type);
    }
	
	//取出所有结果
    function fetch_all($query, $result_type = MYSQL_ASSOC) {
        $result = array();
        $num = 0;
        while($ret = mysql_fetch_array($query, $result_type)) {    
            $result[$num++] = $ret;
        }
        return $result;
    }
	
	//从结果集中取得一行作为枚举数组
    function fetch_row($query) {
        $query = mysql_fetch_row($query);
        return $query;
    }
	
	//返回查询结果
    function result($query, $row) {
        $query = @mysql_result($query, $row);
        return $query;
    }
     
	//查询SQL
    function query($sql, $type = '') {
        $func = $type == 'UNBUFFERED' && @function_exists('mysql_unbuffered_query') ? 'mysql_unbuffered_query' : 'mysql_query';
        if(!($query = $func($sql, $this->link)) && $type != 'SILENT') {
            $this->halt('MySQL Query Error: ', $sql);
        }
        $this->querynum++;
        return $query;
    }
	
	//取影响条数
    function affected_rows() {
        return mysql_affected_rows($this->link);
    }
	
	//返回错误信息
    function error() {
        return (($this->link) ? mysql_error($this->link) : mysql_error());
    }
	
	//返回错误代码
    function errno() {
        return intval(($this->link) ? mysql_errno($this->link) : mysql_errno());
    }
	
	//结果条数
    function num_rows($query) {
        $query = mysql_num_rows($query);
        return $query;
    }
	
	//取字段总数
    function num_fields($query) {
        return mysql_num_fields($query);
    }
	
	//释放结果集
    function free_result($query) {
        return mysql_free_result($query);
    }
	
	//返回自增ID
    function insert_id() {
        return ($id = mysql_insert_id($this->link)) >= 0 ? $id : $this->result($this->query("SELECT last_insert_id()"), 0);
    }
	
	//从结果集中取得列信息并作为对象返回
    function fetch_fields($query) {
        return mysql_fetch_field($query);
    }
	
	//返回mysql版本
    function version() {
        return mysql_get_server_info($this->link);
    }
	
	//关闭连接
    function close() {
        return mysql_close($this->link);
    }
	
	//输出错误信息
    function halt($message = '', $sql = '') {
        exit($message.' '.$sql);
    }  
}
?>