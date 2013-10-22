$(function(){
	$('#textarea').on('keyup mouseup', function(e) {
		$('#postsubmit').prop('disabled', $(this).val().length == 0 ? true : false);
	}).on('keydown', function(e) {
		if(e.ctrlKey && e.keyCode=='13') $('#postsubmit').click();
	});
});
(function($) {
	editor = {
		//UBB按钮
		ubb: function(ubbDiv, ubbArr) {
			var ubbList = {
				//第一个属性是未选中文本,a(action)代表直接对文本进行操作,p(popbox)代表弹出下拉框
				//第二个属性是已选中文本
				//第三个属性是弹出下拉框类型,i(input)代表输入框,s(select)代表选择菜单
				//第四个属性是对应的HTML文本
				style:['p','p','s','<span id="ubb_style" title="文字装饰效果"></span><div id="ubb_style_main"><span id="ubb_style_b" title="加粗"></span><span id="ubb_style_i" title="斜体"></span><span id="ubb_style_u" title="下划线"></span><span id="ubb_style_s" title="删除线"></span></div>'],
				color:['p','p','s','<span id="ubb_color" title="设置文字颜色"></span><div id="ubb_color_main"><span id="ubb_color_black" title="黑色"></span> <span id="ubb_color_red" title="红色"></span> <span id="ubb_color_green" title="绿色"></span> <span id="ubb_color_blue" title="蓝色"></span><br /><span id="ubb_color_purple" title="紫色"></span> <span id="ubb_color_brown" title="棕色"></span> <span id="ubb_color_cyan" title="天蓝色"></span> <span id="ubb_color_grey" title="灰色"></span></div>'],
				align:['p','p','s','<span id="ubb_align" title="文本对齐"></span><div id="ubb_align_main"><span id="ubb_align_left" title="左对齐"></span><span id="ubb_align_center" title="居中对齐"></span><span id="ubb_align_right" title="右对齐"></span><span id="ubb_align_justify" title="两端对齐"></span></div>'],
				size:['p','p','s','<span id="ubb_size" title="设置文字大小"></span><div id="ubb_size_main"><span id="ubb_size_12">12px</span><span id="ubb_size_14">14px</span><span id="ubb_size_16">16px</span><span id="ubb_size_18">18px</span><span id="ubb_size_20">20px</span><span id="ubb_size_24">24px</span><span id="ubb_size_28">28px</span></div>'],
				img:['p','a','i','<span id="ubb_img" title="添加图片"></span><div id="ubb_img_main" class="ubb_main">图片地址：<input id="ubb_img_src" type="url" class="ubb_input_long" /><br />宽：<input id="ubb_img_x" class="ubb_input_short" /> 高：<input id="ubb_img_y" class="ubb_input_short" /> <button id="ubb_img_submit" class="button">确定</button></div>'],
				url:['p','a','i','<span id="ubb_url" title="添加链接"></span><div id="ubb_url_main" class="ubb_main">链接地址：<input id="ubb_url_href" type="url" class="ubb_input_long" /><br />链接文字：<input id="ubb_url_title" class="ubb_input_long" /><br /><button id="ubb_url_submit" class="button">确定</button></div>'],
				quote:['p','a','i','<span id="ubb_quote" title="添加引用文字"></span><div id="ubb_quote_main" class="ubb_main">要插入的引用文字：<br /><textarea id="ubb_quote_text"></textarea><br /><button id="ubb_quote_submit" class="button">确定</button></div>'],
				code:['p','a','i','<span id="ubb_code" title="添加代码文字"></span><div id="ubb_code_main" class="ubb_main">要插入的代码：<br /><textarea id="ubb_code_text"></textarea><br /><button id="ubb_code_submit" class="button">确定</button></div>'],
				flash:['p','p','i','<span id="ubb_flash" title="添加Flash"></span><div id="ubb_flash_main" class="ubb_main">Flash地址：<input id="ubb_flash_src" type="url" class="ubb_input_long" /><br />宽：<input id="ubb_flash_x" class="ubb_input_short" /> 高：<input id="ubb_flash_y" class="ubb_input_short" /> <button id="ubb_flash_submit" class="button">确定</button></div>'],
				at:['p','p','i','<span id="ubb_at" title="@好友"></span><div id="ubb_at_main" class="ubb_main">要@的用户名：<br /><input id="ubb_at_text" class="ubb_input_long" /><br /><ul id="ubb_at_user"></ul><button id="ubb_at_submit" class="button">确定</button></div>'],
				table:['p','p','i','<span id="ubb_table" title="添加表格"></span><div id="ubb_table_main" class="ubb_main">行数：<input id="ubb_table_row" class="ubb_input_short" /> 列数：<input id="ubb_table_col" class="ubb_input_short" /><br /><button id="ubb_table_submit" class="button">确定</button></div>'],
				hr:['a','a',undefined,'<span id="ubb_hr" title="分隔线"></span>'],
				clear:['a','a',undefined,'<span id="ubb_clear" title="清除文本格式"></span>'],
				delurl:['a','a',undefined,'<span id="ubb_delurl" title="移除链接"></span>'],
				attach:['p','p','i','<span id="ubb_attach" title="添加附件"></span><div id="ubb_attach_main" class="ubb_main"><div id="attachment"></div><img id="imgthumb" src="about:blank" /></div>'],
				face:['p','p','i','<span id="ubb_face" title="添加表情"></span><div id="ubb_face_main" class="ubb_main"></div>']
			};
			var html = '';
			$.each(ubbArr, function(key, val) {
				html += ubbList[val][3];
			});
			$('#' + ubbDiv).html(html);
			$.each(ubbArr, function(key, val) {
				var base = $('#ubb_' + val),
					ta = $('#textarea');
				if(ubbList[val][0] == 'a') {
					base.on('click', function() {
						switch(val) {
						case 'hr':
							editor.addUBB('', val);
							ta.focus();
							break;
						case 'clear':
							if(editor.getTextPos(ta[0]).isSelect) {
								editor.removeUBB(undefined, ['b', 'i', 'u', 's'], ['align', 'color', 'size']);
							}
							break;
						case 'delurl':
							if(editor.getTextPos(ta[0]).isSelect) {
								editor.removeUBB(undefined, ['url'], ['url']);
							}
							break;
						}
					});
				} else {
					var ulmain = $('#ubb_' + val + '_main');
					if(ubbList[val][2] == 's') {
						base.on('click', function() {
							ulmain.css('left', base.position().left).show();
						}).on('mouseover', function() {
							clearTimeout(base[0].timer);
						}).on('mouseout', function() {
							base[0].timer = setTimeout(function() { ulmain.hide(); }, 100);
						});
						ulmain.on('click', function(e) {
							clearTimeout(base[0].timer);
							var id = $(e.target).attr('id');
							if(id != 'ubb_' + val + '_main') {
								var subType = id.substr(val.length + 5);
								if(val == 'style') {
									editor.addUBB(undefined, subType, subType, true);
								} else {
									editor.addUBB(undefined, val + '=' + subType, val, true);
								}
							}
							ulmain.hide();
							ta.focus();
						}).on('mouseover', function() {
							clearTimeout(base[0].timer);
						}).on('mouseout', function() {
							base[0].timer = setTimeout(function() { ulmain.hide(); }, 100);
						});
					} else if(ubbList[val][2] == 'i') {
						base.on('click', function() {
							if(ubbList[val][1] == 'a' && editor.getTextPos(ta[0]).isSelect) {
								editor.addUBB(undefined, val, val, true);
								ta.focus();
							} else {
								if(ulmain.css('display') == 'block') {
									ulmain.find('input').val('').end().find('textarea').val('').end().hide();
									ta.focus();
								} else {
									$('#ubb').find('input').val('').end().find('textarea').val('').end().find('.ubb_main').hide();
									ulmain.css('left', base.position().left).show();
									switch(val) {
									case 'img':
										$('#ubb_img_src').val('http://').on('change', function() {
											var s = {};
											s.img = new Image();
											s.img.src = $(this).val();
											s.loadCheck = function () {
												if(s.img.complete) {
													$('#ubb_img_x').val(s.img.width || '');
													$('#ubb_img_y').val(s.img.height || '');
												} else {
													setTimeout(function () {s.loadCheck();}, 100);
												}
											};
											s.loadCheck();
										});
									case 'flash':
										$('#ubb_flash_src').val('http://');
										break;
									case 'url':
										$('#ubb_url_href').val('http://');
										break;
									case 'at':
										editor.autoComplete($('#ubb_at_text'), $('#ubb_at_user'));
										break;
									case 'table':
										$('#ubb_table_row').val('2');
										$('#ubb_table_col').val('2');
										break;
									case 'attach':
										$('#attachment').load('./source/include/editor.php', {'mod':'attach','action':'list','tid': $('#ubb').data('tid') || 0 });
										ulmain.on('mouseover', '.viewattach', function(e) {
											var target = $(e.target);
											$("#imgthumb").attr('src', target.attr('name')).css({'left': target.position().left + target.width(), 'top': target.position().top, 'height': 100}).show();
										}).on('mouseout', '.viewattach', function() {
											$("#imgthumb").hide();
										});
										break;
									case 'face':
										ulmain.load('./source/include/editor.php', {'mod': 'face'}, function() {
											$(this).find('img').on('click', function(e) {
												var target = $(e.target);
												editor.addUBB('', 'face=' + target.attr('alt') + ',' + target.attr('title'));
											});
										});
										break;
									}
								}
							}
						});
						$('#ubb_' + val + '_submit').on('click', function() {
							switch(val) {
							case 'img':
							case 'flash':
								var src = $('#ubb_' + val + '_src').val(),
									srcx = $('#ubb_' + val + '_x').val(),
									srcy = $('#ubb_' + val + '_y').val(),
									newval;
								if(isNaN(srcx)) srcx = 0;
								if(isNaN(srcx)) srcx = 0;
								newval = srcx == 0 || srcy == 0 ? val : val + '=' + srcx + ',' + srcy;
								editor.addUBB(src, newval, val, true);
								break;
							case 'url':
								var href = $('#ubb_' + val + '_href').val(),
									title = $('#ubb_' + val + '_title').val(),
									str = title.length ? title : href;
									newval = title.length ? val + '=' + href : val;
								editor.addUBB(str, newval, val, true);
								break;
							case 'quote':
							case 'code':
							case 'at':
								var text = $.trim($('#ubb_' + val + '_text').val());
								if(text.length != 0) editor.addUBB(text, val, val, true);
								break;
							case 'table':
								var row = $('#ubb_' + val + '_row').val(),
									col = $('#ubb_' + val + '_col').val(),
									str = '\n';
								if(isNaN(row)) row = 2;
								if(isNaN(col)) col = 2;
								for(var i = 0; i < row; i ++) {
									str += '[tr]';
									for(var j = 0; j < col; j ++) {
										str += '[td] [/td]';
									}
									str += '[/tr]\n';
								}
								editor.addUBB(str, val, val);
								break;
							}
							ulmain.find('input').val('').end().find('textarea').val('').end().hide();
							ta.focus();
							return false;
						});
					}
				}
			});
		},
		//添加UBB
		addUBB: function(str, openTag, closeTag, select) {
			var ta = document.getElementById('textarea'),
				value = ta.value,
				position = editor.getTextPos(ta),
				pStart = position.start,
				pEnd = position.end;
			str = str == undefined ? value.substring(pStart, pEnd) : str;
			openTag = '[' + openTag + ']';
			closeTag = closeTag == undefined ? '' : '[/' + closeTag + ']';
			str = openTag + str + closeTag;
			ta.value = value.substr(0, pStart) + str + value.substr(pEnd);
			editor.selectText(ta, select ? pStart + openTag.length : pStart + str.length - closeTag.length, pStart + str.length - closeTag.length);
		},
		//去除UBB
		removeUBB: function(str, simpleTags, complexTags) {
			var ta = document.getElementById('textarea'),
				value = ta.value,
				position = editor.getTextPos(ta),
				pStart = position.start,
				pEnd = position.end,
				removeChars = 0,
				openTag, closeTag, startIndex, stopIndex;
			str = str == undefined ? value.substring(pStart, pEnd) : str;
			for(var i in simpleTags) {
				openTag = '[' + simpleTags[i] + ']';
				closeTag = '[/' + simpleTags[i] + ']';
				while((startIndex = editor.stripos(str, openTag)) != -1 && (stopIndex = editor.stripos(str, closeTag)) != -1) {
					var text = str.substr(startIndex + openTag.length, stopIndex - startIndex - openTag.length);
					str = str.substr(0, startIndex) + text + str.substr(stopIndex + closeTag.length);
					removeChars += openTag.length + closeTag.length;
				}
			}
			for(var i in complexTags) {
				openTag = '[' + complexTags[i] + '=';
				closeTag = '[/' + complexTags[i] + ']';
				while((startIndex = editor.stripos(str, openTag)) != -1 && (stopIndex = editor.stripos(str, closeTag)) != -1) {
					var openEnd = editor.stripos(str, ']', startIndex);
					if(openEnd > startIndex && openEnd < stopIndex) {
						var text = str.substr(openEnd + 1, stopIndex - openEnd - 1);
						str = str.substr(0, startIndex) + text + str.substr(stopIndex + closeTag.length);
						removeChars += openEnd + 1 - startIndex + closeTag.length;
					} else {
						break;
					}
				}
			}
			ta.value = value.substr(0, pStart) + str + value.substr(pEnd);
			editor.selectText(ta, pStart, pEnd - removeChars);
		},
		//查找文本所处的位置
		stripos: function(source, search, offset) {
			offset = offset == 'undefined' ? 0 : offset;
			return source.toLowerCase().indexOf(search.toLowerCase(), offset);
		},
		//获取选中文本的范围
		getTextPos: function(ta){
			var start = 0, end = 0, value = ta.value, range, range_all;
			if(typeof(ta.selectionStart) == 'number') {
				start = ta.selectionStart;
				end = ta.selectionEnd;
			} else if(document.selection) {
				ta.focus();
				range = document.selection.createRange();
				if(range.parentElement() == ta) {
					range_all = document.body.createTextRange();
					range_all.moveToElementText(ta);
					for(start = 0; range_all.compareEndPoints('StartToStart', range) < 0; start ++) {
						range_all.moveStart('character', 1);
					}
					for(var i = 0; i <= start; i ++) {
						if(ta.value.charAt(i) == '\n') {
							start ++;
						}
					}
					range_all.moveToElementText(ta);
					for(end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; end ++) {
						range_all.moveStart('character', 1);
					}
					for(var i = 0; i <= end; i ++) {
						if(ta.value.charAt(i) == '\n') {
							end ++;
						}
					}
				}
			} else {
				start = value.length;
				end = value.length;
			}
			return {
				start: start,
				end: end,
				isSelect: start != end
			}
		},
		//选取文本
		selectText: function(ta, start, stop) {
			var range;
			if(ta.setSelectionRange) {
				ta.setSelectionRange(start, stop);
			} else {
				range = ta.createTextRange();
				range.collapse(true);
				range.moveStart('character', start);
				range.moveEnd('character', stop - start);
				range.select();
			}
			ta.focus();
		},
		//用户名提示
		autoComplete: function(input, list) {
			input.on('keyup paste focus', function() {
				var user = $.trim($(this).val());
				if(user.length != 0) {
					list.load('./source/include/editor.php', {'mod': 'at', 'user': user}, function() {
						if($(this).text() != '') {
							$(this).show().find('li').on('click', function() {
								input.val($(this).text());
							});
						} else {
							$(this).hide();
						}
					});
				} else {
					list.hide();
				}
			}).on('blur', function() {
				setTimeout(function() { list.hide(); }, 100);
			});
		},
		//上传附件
		uploadAttach: function(tid) {
			$('#loading').ajaxStart(function() { $(this).show(); }).ajaxComplete(function() { $(this).hide(); });
			$.ajaxFileUpload({
				url: './source/include/editor.php?mod=attach&action=upload&tid=' + tid,
				secureuri: false,
				fileElementId: 'ufFile',
				dataType: 'json',
				success: function(response) {
					console.log(response);
					console.log(1);
					if(response.success) {
						$('#attachment').html('').load('./source/include/editor.php', {'mod':'attach', 'action':'list', 'tid': tid});
					} else {
						$('#ufSubmit').next().html(response.msg);
					}
				}
			});
			return false;
		},
		//删除附件
		deleteAttach: function(aid, tid){
			$.ajax({
				type: 'POST',
				async: false,
				url: './source/include/editor.php',
				data: 'mod=attach&action=delete&aid=' + aid,
				success: function(){
					$('#attachment').html('').load('./source/include/editor.php', {'mod':'attach', 'action':'list', 'tid': tid});
				}
			});
		}
	}
})(jQuery);