/*
title	标题
content	内容
button	自定义按钮
	value	文本
	href
	callback	回调函数   //阻止关闭窗口用e.stopImmediatePropagation();
	width
	disabled
	closedialog
	id
width
height
fixed
follow	对话框依附在指定元素附近
lock	锁屏遮罩
padding
id
zIndex
onload	初始化完成后执行函数
~unload	关闭前执行函数
hidden
~time	显示时间
type
draggable
*/
(function($) {
	dialog = {
		//弹出浮动窗口
		open: function(config) {
			config.type = config.type || 'default';
			config.content = config.content || '';
			config.width = config.width || 300;
			config.height = config.height || 'auto';
			config.padding = config.padding || '5px 10px';
			config.zIndex = config.zIndex || '10';
			config.id = config.id || 'dialog' + Math.floor(Math.random() * 100000);
			var wrap = $('#wrap'),
				dialogBox = '',
				clickEvents = [[ 'close' + config.id, function() { dialog.close({ id: config.id }); } ]];
			switch(config.type) {
				case 'ajax':
					$.ajax({
						type: 'POST',
						url: config.content,
						async: false,
						success: function(response) {
							config.content = response;
						}
					});
				case 'default':
					if(config.lock) {
						dialogBox += '<div id="bg' + config.id + '" class="dialoglock" style="height:' + $(window).height() + 'px;width:' + $(window).width() + 'px;"></div>';
						clickEvents.push([ 'bg' + config.id, function() { dialog.close({ id: config.id }); } ]);
					}
					dialogBox += '<div id="' + config.id + '" class="dialogbox" style="' + (config.hidden ? 'display:none;' : '') + 'position:' + (config.fixed ? 'fixed' : 'absolute') + ';z-index:' + config.zIndex + ';">';
					dialogBox += '<div class="dialogbg"></div>';
					dialogBox += '<div class="dialog">';
					if(config.title) {
						dialogBox += '<h3' + (config.draggable ? ' style="cursor:move;"' : '') + '>' + config.title + '</h3>';
					}
					dialogBox += '<div class="ajaxcontent" style="padding:' + config.padding + ';">' + config.content;
					if(config.button) {
						dialogBox += '<p class="c">';
						for(var key in config.button) {
							var button = config.button[key];
							button.id = button.id || 'button' + Math.floor(Math.random() * 100000);
							if(button.href) dialogBox += '<a href="' + button.href + '">';
							dialogBox += '<button id="' + button.id + '" class="button"' + (button.disabled ? ' disabled="disabled"' : '') + ' style="' + (button.width ? 'width:' + button.width + 'px;' : '') + '">' + button.value + '</button>';
							if(button.href) dialogBox += '</a>';
							if(button.callback) clickEvents.push([ button.id, button.callback ]);
							if(button.closedialog) clickEvents.push([ button.id, function() { dialog.close({ id: config.id }); } ]);
						}
						dialogBox += '</p>';
					}
					dialogBox += '</div>';
					dialogBox += '<div id="close' + config.id + '" class="dialogclose">×</div>';
					dialogBox += '</div>';
					dialogBox += '</div>';
					var dialogDiv = $('#' + config.id);
					dialogDiv.length > 0 ? dialogDiv.replaceWith(dialogBox) : wrap.append(dialogBox);
					dialogDiv = $('#' + config.id);
					var dialogHeight = dialogDiv.find('.dialog').height(config.height).width(config.width).height();
					if(config.follow) {
						dialogDiv.css({ 'left': config.follow.position().left - 8, 'top': config.follow.position().top + config.follow.height() });
					} else {
						dialogDiv.css({ 'left': (wrap.width() - config.width - 16) / 2, 'top': ($(window).height() - dialogHeight - 16) / 2 });
					}
					if(config.draggable) {
						dialogDiv.draggable(config.title ? { containment: 'parent', handle: 'h3' } : { containment: 'parent' });
					}
					if(config.onload) config.onload();
					for(var key in clickEvents) {
						$('#' + clickEvents[key][0]).on('click', clickEvents[key][1]);
					}
				break;
				case 'alert':
				break;
			}
		},
		//关闭浮动窗口
		close: function(config) {
			$('#' + config.id).remove();
			$('#bg' + config.id).remove();
			if(config.callback) config.callback();
		},
		//弹出说明
		alert: function(belong, txt) {
			belong = $('#' + belong);
			$('#alerttxt').html(txt);
			$('#alert').css({'left': belong.offset().left + belong.width() + 10 - $('#wrap').offset().left, 'top': belong.offset().top - $('#wrap').offset().top}).show();
			setTimeout(function() { $('#alert').hide(); }, 3000);
		}
	}
})(jQuery);