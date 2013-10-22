/*
 *  历史记录处理
 */
define(function(require, exports, module) {

	var history = function() {
		require('ex/history.js');
		var $this = this;
		$.history.init(function(url) {
			$this.sendRequest(url);
		}, {
			unescape: "/"
		});
		// $('#loading').ajaxStart(function() { $(this).show(); })
			// .ajaxStop(function() { $(this).hide(); });
		$('body').on('click', 'a.link', function() {
			$.history.load(this.href.replace(/^.*#/, ''));
			return false;
		});
	}
	
	//根据地址进行分发
	history.prototype.sendRequest = function(url) {
		url = url.replace(/\!\//, '');
		var urlArr = url.split('/');
		if(urlArr[0] == '') urlArr[0] = 'index';
		switch(urlArr[0]) {
		case 'index':
			break;
		default:
			//getContent.notfound();
		}
	}
	
	module.exports = history;
});