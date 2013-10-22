//定义全局变量
var G = {
	byId: function(name) { return document.getElementById(name); },
	byTag: function(name) { return document.getElementsByTagName(name); },
	isIE6: !-[1,] && !window.XMLHttpRequest,
	level: 1,  //显示层级
	ring: true,  //播放铃声
	timer: null,  //定时器缓存
	mapMode: 'sate',  //显示图片类型
    sosoMap: {},  //实景地图
	switchHotArea: true,  //显示热区
	schedule: {},  //校历
	bus: {},  //校车
	busType: null,  //校车状态
	paper: null  //Raphael画布
};
define(function(require) {
	(function($) {
		$.extend({
			//当前校车班次显示
			bus: function(y, m, d, h, i) {
				var time = new Date(y, m - 1, d, h, i, 0),
					more1 = '', more2 = '',
					stations, totalTime, html, tempTime, cTime,
					j, k;

				html = '<p><a href="javascript:;" onclick="$.showInfo(\'basic\',401);"><strong>茶苑-北区</strong> 班车时刻表</a></p><table class="f12 w100"><tr><td></td><td>开往北区</td><td>开往' + ((h + i > 1830 && h + i < 2051) ? '化成楼' : '茶苑') + '</td></tr>';
				totalTime = (h + i > 1830) ? 6 : 10;
				tempTime = new Date(y, m - 1, d, h, i - totalTime, 0);

				stations = ['学行楼', '学行楼', '学行楼', '广乐楼', '学海楼', '世纪广场', '化成楼', '校医院', '体育中心', '3号门', '茶苑'];
				for(j in G.bus.a1) {
					if(G.busType[0] == 0 && G.bus.a1[j][2] == 0) continue;
					cTime = new Date(y, m - 1, d, G.bus.a1[j][0], G.bus.a1[j][1], 0);
					if(cTime <= time && cTime > tempTime) {
						k = totalTime - (time - cTime) / 60000;
						html += '<tr><td>当前班车</td><td>' + stations[k] + '</td><td></td></tr>';
					} else if(cTime > time) {
						more1 = G.bus.a1[j][0] + ':' + G.bus.a1[j][1];
						break;
					}
				}
				stations = ['学行楼', '广乐楼', '广乐楼', '广乐楼', '学海楼', '世纪广场', '化成楼', '校医院', '体育中心', '3号门', '茶苑'];
				for(j in G.bus.a2) {
					if(G.busType[0] == 0 && G.bus.a2[j][2] == 0) continue;
					cTime = new Date(y, m - 1, d, G.bus.a2[j][0], G.bus.a2[j][1], 0);
					if(cTime <= time && cTime > tempTime) {
						k = (time - cTime) / 60000;
						html += '<tr><td>当前班车</td><td></td><td>' + stations[k] + '</td></tr>';
					} else if(cTime > time) {
						more2 = G.bus.a2[j][0] + ':' + G.bus.a2[j][1];
						break;
					}
				}
				if(more1 == '') {
                    if(G.busType[1] == 2) {
                        more1 = G.busType[2] + ' ' + G.bus.a1[0][0] + ':' + G.bus.a1[0][1];
                    } else {
                        for(j in G.bus.a1) {
                            if(G.bus.a1[j][2] == G.busType[1]) continue;
                            more1 = '明天 ' + G.bus.a1[j][0] + ':' + G.bus.a1[j][1];
                            break;
                        }
                    }
				}
				if(more2 == '') {
                    if(G.busType[1] == 2) {
                        more2 = G.busType[2] + ' ' + G.bus.a2[0][0] + ':' + G.bus.a2[0][1];
                    } else {
                        for(j in G.bus.a2) {
                            if(G.bus.a2[j][2] == G.busType[1]) continue;
                            more2 = '明天 ' + G.bus.a2[j][0] + ':' + G.bus.a2[j][1];
                            break;
                        }
                    }
				}
				html += '<tr><td>下一班车</td><td>' + more1 + '</td><td>' + more2 + '</td></tr></table>';

				html += '<p><hr /></p><p><a href="javascript:;" onclick="$.showInfo(\'basic\',402);"><strong>茶苑-新北</strong> 班车时刻表</a></p><table class="f12 w100"><tr><td></td><td>开往新北</td><td>开往茶苑</td></tr>';
				totalTime = 11;
				tempTime = new Date(y, m - 1, d, h, i - totalTime, 0);
				more1 = '';
				more2 = '';

				stations = ['新北区', '新北区', '新北区', '学行楼', '学行楼', '学行楼', '广乐楼', '学海楼', '学海楼', '化成楼', '化成楼', '茶苑'];
				for(j in G.bus.b1) {
					if(G.busType[0] == 0) break;
					cTime = new Date(y, m - 1, d, G.bus.b1[j][0], G.bus.b1[j][1], 0);
					if(cTime <= time && cTime > tempTime) {
						k = totalTime - (time - cTime) / 60000;
						html += '<tr><td>当前班车</td><td>' + stations[k] + '</td><td></td></tr>';
					} else if(cTime > time) {
						more1 = G.bus.b1[j][0] + ':' + G.bus.b1[j][1];
						break;
					}
				}
				stations = ['新北区', '学行楼', '学行楼', '学行楼', '广乐楼', '广乐楼', '广乐楼', '学海楼', '化成楼', '化成楼', '茶苑', '茶苑'];
				for(j in G.bus.b2) {
					if(G.busType[0] == 0) break;
					cTime = new Date(y, m - 1, d, G.bus.b2[j][0], G.bus.b2[j][1], 0);
					if(cTime <= time && cTime > tempTime) {
						k = (time - cTime) / 60000;
						html += '<tr><td>当前班车</td><td></td><td>' + stations[k] + '</td></tr>';
					} else if(cTime > time) {
						more2 = G.bus.b2[j][0] + ':' + G.bus.b2[j][1];
						break;
					}
				}
                if(more1 == '') {
                    if(G.busType[1] != 1) {
                        more1 = G.busType[2] + ' ' + G.bus.b1[0][0] + ':' + G.bus.b1[0][1];
                    } else {
                        more1 = '明天 ' + G.bus.b1[0][0] + ':' + G.bus.b1[0][1];
                    }
                }
                if(more2 == '') {
                    if(G.busType[1] != 1) {
                        more2 = G.busType[2] + ' ' + G.bus.b2[0][0] + ':' + G.bus.b2[0][1];
                    } else {
                        more2 = '明天 ' + G.bus.b2[0][0] + ':' + G.bus.b2[0][1];
                    }
                }
				html += '<tr><td>下一班车</td><td>' + more1 + '</td><td>' + more2 + '</td></tr></table>';

				$('#bus').html(html);
			},
			//当日状态
			dayType: function(y, m, d, isBus) {
                var date = y + m + d,
                    start1 = G.schedule.start1,
                    start2 = G.schedule.start2;
                if(isBus) {
                    var w = new Date(y, m - 1, d).getDay(),
                        busType, tomorrowType, nextBusDay;
                    if((date >= start1 && date < G.schedule.end1) || (date >= start2 && date < G.schedule.end2)) {
                        busType = (w == 0 || w == 6 || G.schedule.holiday[date]) ? 0 : 1;
                        var tempD = parseInt(d),
                            tempDate, tempType, tempY, tempM, tempD2, tempW;
                        do {
                            tempD += 1;
                            tempDate = new Date(y, m - 1, tempD);
                            tempY = tempDate.getFullYear().toString();
                            tempM = (tempDate.getMonth() + 1).toString();
                            tempD2 = tempDate.getDate().toString();
                            tempW = tempDate.getDay();
                            if(tempM.length == 1) tempM = '0' + tempM;
                            if(tempD2.length == 1) tempD2 = '0' + tempD2;
                            tempType = (tempW == 0 || tempW == 6 || G.schedule.holiday[tempY + tempM + tempD2]) ? 0 : 1;
                            if(tomorrowType == undefined) tomorrowType = tempType;
                        } while(tempType != 1);
                        nextBusDay = tempM + '/' + tempD2;
                    } else if(date == G.schedule.end1 || date == G.schedule.end2) {
                        busType = (w == 0 || w == 6) ? 0 : 1;
                        tomorrowType = 2;
                        nextBusDay = (date == G.schedule.end1) ? start2 : start1;
                        nextBusDay = nextBusDay.substr(4, 2) + '/' + nextBusDay.substr(6);
                    } else {
                        busType = 2;
                        tomorrowType = 2;
                        nextBusDay = (date < start2 && (date > start1 || start1 > start2)) ? start2 : start1;
                        nextBusDay = nextBusDay.substr(4, 2) + '/' + nextBusDay.substr(6);
                    }
                    return [busType, tomorrowType, nextBusDay];
                } else {
                    var classType, dayTip = '', odd = 0;
                    if((date >= start1 && date <= G.schedule.end1) || (date >= start2 && date <= G.schedule.end2)) {
                        var tempDate = (date >= start2 && date <= G.schedule.end2) ? start2 : start1,
                            d1 = new Date(tempDate.substr(0, 4), tempDate.substr(4, 2) - 1, tempDate.substr(6, 2) - 1),
                            d2 = new Date(y, m - 1, d),
                            w = d2.getDay();
                        odd = Math.ceil((d2 - d1) / 86400000 / 7 % 2);
                        if(G.schedule.holiday[date]) {
                            classType = 8;
                            dayTip = G.schedule.holiday[date];
                        } else if(G.schedule.makeup[date]) {
                            classType = G.schedule.makeup[date][1];
                            dayTip = G.schedule.makeup[date][0];
                        } else if(G.schedule.rest[date]) {
                            classType = 9;
                            dayTip = G.schedule.rest[date];
                        } else {
                            classType = w == 0 ? 7 : w;
                        }
                    } else {
                        classType = 0;
                    }
                    return [classType, dayTip, odd];
                }
			},
			//界面初始化
			init: function() {
				var winWidth = $(window).width(),
					winHeight = $(window).height(),
					p = Math.pow(2, G.level - 1) * 1536,
					left = $('aside').height(winHeight - 61).position().left + 220;
				$('header').width(winWidth);
				$('#mainmenu').height(winHeight - 116);
				$('#submenu').height(winHeight - 136);
				$('#maininfo').css('left', left).width(winWidth - left).height(winHeight - 61);
				$('#mainmap').css('left', left).width(winWidth - left).height(winHeight - 61);
				$('#container').css({'left': winWidth - left - p, 'top': winHeight - 61 - p, 'width': p * 2 - winWidth + left, 'height': p * 2 - winHeight + 61});
				if(winWidth < 800 || winHeight < 400) {
					$('#showthumb').hide();
					$('#thumb').hide();
				} else {
					$('#showthumb').hide();
					$('#thumb').show();
				}
				if(winWidth < 600 || winHeight < 400) $('#maininfo').hide();
				var map = new (require('my/map.js'))();
				map.movemap(0, 0, false);
			},
			//左栏菜单显示
			subMenu: function(id) {
                $('#submenu').load('./index.php', { mod: 'menu', id: id }, function() {
                    $(this).show();
                    if(id == 4) {
                        var date = G.schedule.start1.substr(0, 4);
                        if(G.schedule.start1 > G.schedule.start2) date --;
                        $('#datepicker').datetimepicker({
                            changeMonth: true,
                            changeYear: true,
                            dateFormat: 'yy-mm-dd',
                            minDate: new Date(date.substr(0, 4), 8, 1),
                            maxDate: new Date(parseInt(date.substr(0, 4)) + 1, 7, 31),
                            altField: '#timepicker'
                        });
                        var today = new Date(),
                            y = today.getFullYear().toString(),
                            m = (today.getMonth() + 1).toString(),
                            d = today.getDate().toString(),
                            h = today.getHours().toString(),
                            i = today.getMinutes().toString();
                        if(m.length == 1) m = '0' + m;
                        if(d.length == 1) d = '0' + d;
                        if(h.length == 1) h = '0' + h;
                        if(i.length == 1) i = '0' + i;
                        $('#datepicker').val(y + '-' + m + '-' + d);
                        $('#timepicker').val(h + ':' + i);
                    }
                });
			},
			//弹出满屏
			showInfo: function(page, id, date, time, week) {
                var mi = $('#maininfo');
                switch(page) {
                case 'basic':
                    if($(window).width() < 600 || $(window).height() < 400) {
                        alert('您的屏幕分辨率太小！');
                    } else {
                        mi.html('<div class="loading"></div>').fadeIn(700)
                            .load('./index.php', { mod: 'basic', id: id }, function() {
                                $('#infoscroll').height(mi.height() - 60);
                                $('#biglist').css('marginLeft', $('#bigtitle').width() + 27);
                                $(window).on('resize', function() { $('#infoscroll').height(mi.height() - 60); });
                            });
                    }
                    break;
                case 'room':
                    if($(window).width() < 600 || $(window).height() < 400) {
                        alert('您的屏幕分辨率太小！');
                    } else {
                        if(G.byId('datepicker') == null) {
                            $.subMenu(4);
                        }
                        if($('#datepicker').val() == undefined) {
                            var today = new Date(),
                                y = today.getFullYear().toString(),
                                m = (today.getMonth() + 1).toString(),
                                d = today.getDate().toString(),
                                h = today.getHours().toString(),
                                i = today.getMinutes().toString();
                            if(m.length == 1) m = '0' + m;
                            if(d.length == 1) d = '0' + d;
                            if(h.length == 1) h = '0' + h;
                            if(i.length == 1) i = '0' + i;
                            date = y + m + d;
                            time = h + i;
                            week = $.dayType(y, m, d);
                        } else {
                            date = $('#datepicker').val().replace(/-/g, '');
                            time = $('#timepicker').val().replace(':', '');
                            week = $.dayType(date.substr(0, 4), date.substr(4, 2), date.substr(6));
                        }
                        mi.html('<div class="loading"></div>').fadeIn(700)
                            .load('./index.php', { mod: 'room', id: id, 'date': date, 'time': time, 'week': week[0] }, function() {
                            $('#infoscroll').height(mi.height() - 60);
                            $('#biglist').css('marginLeft', $('#bigtitle').width() + 27);
                            $(window).on('resize', function() { $('#infoscroll').height(mi.height() - 60); });
                            $('#roominfo').draggable({
                                handle: '#dragroominfo',
                                containment: 'parent'
                            });
                            $('#floors').on('click', function(e) {
                                e.preventDefault();
                                var target = e.target.hash;
                                $(this).find('.current').removeClass('current');
                                $(e.target).addClass('current');
                                $('#infoscroll').find('.roommain').hide();
                                $(target).show();
                            });
                        });
                    }
                break;
                case 'info':
                    $('#infoscroll').find('.roommain').hide();
                    $('#roominfo').load('./index.php', {'mod': 'roominfo', 'id': id, 'date': date, 'time': time, 'week': week}, function() {
                        $('#closeroominfo').on('click', function() {
                            var target = $('#floors').find('.current').attr('href');
                            $('#roominfo').hide().empty();
                            $(target).show();
                        });
                    }).show();
                    break;
                }
			},
			//取得当前时间
			startTime: function() {
				var today = new Date(),
					y = today.getFullYear().toString(),
					m = (today.getMonth() + 1).toString(),
					d = today.getDate().toString(),
					h = today.getHours().toString(),
					i = today.getMinutes().toString(),
					s = today.getSeconds().toString(),
					l = '星期' + '日一二三四五六'.charAt(today.getDay());
				if(m.length == 1) m = '0' + m;
				if(d.length == 1) d = '0' + d;
				if(h.length == 1) h = '0' + h;
				if(i.length == 1) i = '0' + i;
				if(s.length == 1) s = '0' + s;
				$('#time').html(y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s + ' ' + l);
				if(G.ring) {
					var ringArr = ['080000', '084500', '094000', '103500', '112000', '133000', '141500', '151000', '155500', '183000', '192000', '201000'];
					if($.inArray(h + i + s, ringArr) >= 0) $('#ring').jPlayer('setMedia', { mp3: './static/sound/ring-1.mp3' }).jPlayer('play');
					ringArr = ['084000', '092500', '102000', '111500', '120000', '141000', '145500', '155000', '163500', '191000', '200000', '205000'];
					if($.inArray(h + i + s, ringArr) >= 0) $('#ring').jPlayer('setMedia', { mp3: './static/sound/ring-2.mp3' }).jPlayer('play');
				}
                var bus = G.byId('bus');
				if(bus != null && (s == 0 || bus.innerHTML == '')) {
                    if(G.busType == null || h + i + s == '000000') {
                        G.busType = $.dayType(y, m, d, true);
                    }
                    $.bus(y, m, d, h, i);
                }
				setTimeout(function(){ $.startTime() }, 500);
			}
		});
	})(jQuery);
	$(function() {
		//history
		// var obj = require('my/history.js'),
			// history = new obj();
		//铃声
		$('#ring').jPlayer({ swfPath: './source/script/jq' });
		$.init();
		$(window).on('resize', function() { $.init(); });
		//校历
		$.getJSON('./source/script/my/date.json').done(function(json) { G.schedule = json; });
        $.getJSON('./source/script/my/bus.json').done(function(json) { G.bus = json; });
		$.startTime();
		//map
		var cv = G.byId('canvas');
		paper = new Raphael(cv, cv.clientWidth, cv.clientHeight);
		cv.childNodes[0].style.position = 'static';
		var map = new (require('my/map.js'))();
		map.init();
		map.mapMode(G.mapMode);
		if(G.level == 1 && $(window).width() > 1600) map.zoom(1);
		//导航栏
		$('#nav').on('click', function(e) {
			switch(e.target.id) {
			case 'loginsubmit':
				$.ajax({
					type: 'POST',
					url: './index.php',
					async: false,
					data: 'mod=logging&action=login&' + $('#loginform').serialize(),
					success: function(response) {
						if(response.length > 10) {
							$('#nav').html(response);
						} else {
							alert(response);
						}
					}
				});
				break;
			case 'logout':
				$.ajax({
					type: 'POST',
					url: './index.php',
					async: false,
					data: 'mod=logging&action=logout',
					success: function(response) {
						$('#nav').html(response);
					}
				});
				break;
			case 'admin':
				$.getScript('./index.php?mod=admin');
				break;
			default:
			}
		});
		//切换边栏显示
		$('#toggleaside').on('click', function() {
			var left = $('aside');
			if(left.position().left == 0) {
				left.css('left', -220);
				$(this).attr('title', '显示左栏').find('div').css('backgroundPosition', '-50px -100px');
			} else {
				left.css('left', 0);
				$(this).attr('title', '收起左栏').find('div').css('backgroundPosition', '-57px -100px');
			}
			$.init();
		});
		//主内容关闭
		$(document).on('click', '#closeinfo', function(){ $('#maininfo').fadeOut(700).empty(); });
		//切换铃声
		$('#ctrlring').on('click', function() {
			if(G.ring) {
				$(this).find('div').css('backgroundPosition', '-220px -55px').end()
					.find('p').text('开启铃声');
				$('#ring').jPlayer('stop');
			} else {
				$(this).find('div').css('backgroundPosition', '-165px -55px').end()
					.find('p').text('关闭铃声');
			}
			G.ring = !G.ring;
		});
		$.datepicker.setDefaults({
            closeText: '关闭',
            prevText: '&lt;&lt;',
            nextText: '&gt;&gt;',
            monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            dayNames: ['周日','周一','周二','周三','周四','周五','周六'],
            dayNamesMin: ['日','一','二','三','四','五','六'],
            firstDay: 1,
            showMonthAfterYear: true
        });
        $.timepicker.setDefaults({
            currentText: '当前时间',
            closeText: '确认',
            timeOnlyTitle: '选择时间',
            timeText: '时间',
            hourText: '时',
            minuteText: '分',
            secondText: '秒',
            millisecText: '毫秒',
            microsecText: '微秒',
            timezoneText: '时区'
        });
	});

});