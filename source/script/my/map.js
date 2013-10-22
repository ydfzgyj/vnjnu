/*
 *  地图相关操作
 */
define(function(require, exports, module) {

	var map = function() {
	}
	
	//地图初始化
	map.prototype.init = function() {
		//地图拖拽
		var $this = this;
		$('#drag').on('click', function(){ $(this).removeClass('noclick'); }).draggable({
			cancel: '.cannotdrag',
			containment: 'parent',
			drag: function() { $this.bgimg(); },
			start: function() { $(this).addClass('noclick').css('cursor', 'url(http://vnjnu.innu.cn/static/images/core/closedhand.cur),default'); },
			stop: function() { $(this).css('cursor', 'url(http://vnjnu.innu.cn/static/images/core/openhand.cur),default'); }
		});
		//滚轮变更显示层级
		require('ex/mousewheel.js');
		$('#drag').on('mousewheel', function(e, intDelta) {
			e.preventDefault();
			$this.zoom(intDelta > 0 ? 1 : -1, e.pageX, e.pageY);
		});
		//地图控制面板
		$('#closewq').on('click', function() { $('#wq').fadeOut(200).hide(); $('#wqmain').empty(); });
		$('#cleft').on('click', function() { $this.movemap(256, 0, true); });
		$('#cright').on('click', function() { $this.movemap(-256, 0, true); });
		$('#cup').on('click', function() { $this.movemap(0, 256, true); });
		$('#cdown').on('click', function() { $this.movemap(0, -256, true); });
		$('#czoomin').on('click', function() { $this.zoom(1); });
		$('#czoomout').on('click', function() { $this.zoom(-1); });
		//地图模式切换
		$('#mapmode').on('click', function(e) {
			var target = e.target;
			while(target.id == '') target = target.parentNode;
			$this.mapMode(target.id.substr(2));
		});
		$('#switchhotarea').on('click', function() {
			if(G.switchHotArea = !G.switchHotArea) {
				this.childNodes[0].className = 'showhotarea';
				$this.hotArea();
			} else {
				this.childNodes[0].className = 'hidehotarea';
				paper.clear();
			}
		});
		//缩略图拖拽
		$('#thumbrange').draggable({
			containment: 'parent',
			start: function() { $(this).css('cursor', 'url(http://vnjnu.innu.cn/static/images/core/closedhand.cur),default'); },
			stop: function(e, ui) {
				var thumb = $('#thumb'),
					x = ui.originalPosition.left - ui.position.left,
					y = ui.originalPosition.top - ui.position.top,
					p = Math.pow(2, G.level - 1) * 1536;
				$this.movemap(parseInt(x * p / thumb.width()), parseInt(y * p / thumb.height()), true);
				$(this).css('cursor', 'url(http://vnjnu.innu.cn/static/images/core/openhand.cur),default');
			}
		});
		$('#hidethumb').on('click', function(){ $('#thumb').hide(); $('#showthumb').show(); });
		$('#showthumb').on('click', function(){ $('#thumb').show(); $('#showthumb').hide(); });
	}
	
	//地图模式切换
	map.prototype.mapMode = function(mode) {
		var html;
		if(mode == '3d') {
			html = '<a id="tosate" href="javascript:;"><div style="background:url(./static/images/core/mapctrls.gif) 0 -30px;"><span></span><em>卫星</em></div></a> <a id="toreal" href="javascript:;"><div style="background:url(./static/images/core/mapctrls.gif) 0 -130px;"><span></span><em>实景</em></div></a>';
		} else if(mode == 'sate') {
			html = '<a id="to3d" href="javascript:;"><div style="background:url(./static/images/core/mapctrls.gif) 0 -80px;"><span></span><em>三维</em></div></a> <a id="toreal" href="javascript:;"><div style="background:url(./static/images/core/mapctrls.gif) 0 -130px;"><span></span><em>实景</em></div></a>';
		} else if(mode == 'real') {
            html = '<a id="tosate" href="javascript:;"><div style="background:url(./static/images/core/mapctrls.gif) 0 -30px;"><span></span><em>卫星</em></div></a> <a id="to3d" href="javascript:;"><div style="background:url(./static/images/core/mapctrls.gif) 0 -80px;"><span></span><em>三维</em></div></a>';
        }
		$('#mapmode').html(html);
        $('#wq').hide();
        var realmap = $('#realmap'),
            thumbrange = $('#thumbrange'),
            realthumb = $('#realthumb');
        if(mode == 'real') {
            realmap.show();
            thumbrange.hide();
            realthumb.show();
            if(G.sosoMap.pano == undefined) {
                G.sosoMap.map = new soso.maps.Map(document.getElementById("realthumb"), {
                    center: new soso.maps.LatLng(32.099982, 118.912648),
                    draggableCursor: 'pointer',
                    mapTypeControl: false,
                    panControl: false,
                    zoomControl: false,
                    zoom: 15
                });
                new soso.maps.PanoramaLayer().setMap(G.sosoMap.map);
                G.sosoMap.pano = new soso.maps.Panorama(document.getElementById('realmap'), {
                    pano: '10101122121120133114300',
                    pov: {
                        heading: 350,
                        pitch: 10
                    },
                    zoom: 1,
                    disableCompass:true,
                    disableFullScreen:true
                });
                G.sosoMap.marker = new soso.maps.Marker({
                    map: G.sosoMap.map,
                    position: new soso.maps.LatLng(32.099982, 118.912648),
                    draggable: true,
                    icon: new soso.maps.MarkerImage(
                        'http://s.map.soso.com/themes/default/img/streetview-ani.gif',
                        new soso.maps.Size(25, 29),
                        new soso.maps.Point(0, 0),
                        new soso.maps.Point(14, 25)
                    )
                });
                G.sosoMap.service = new soso.maps.PanoramaService();
                soso.maps.event.addListener(G.sosoMap.marker, 'dragend', function(evt) {
                    G.sosoMap.service.getPano(evt.latLng, undefined, function(result) {
                        G.sosoMap.pano.setPano(result.svid);
                    });
                });
                soso.maps.event.addListener(G.sosoMap.map, 'click', function(evt) {
                    G.sosoMap.service.getPano(evt.latLng, undefined, function(result) {
                        G.sosoMap.pano.setPano(result.svid);
                    });
                });
                soso.maps.event.addListener(G.sosoMap.pano, 'pano_changed', function() {
                    setTimeout(function() {
                        var pos = G.sosoMap.pano.getPosition();
                        G.sosoMap.map.panTo(pos);
                        G.sosoMap.marker.setPosition(pos);
                    }, 500);
                });
            }
        } else if(mode == G.mapMode) {
            if(G.byId('thumb').style.background == '') {
                G.byId('thumb').style.background = 'url(./static/images/' + mode + '/thumb.jpg)';
                if(G.switchHotArea) this.hotArea();
            } else {
                realmap.hide();
                thumbrange.show();
                realthumb.hide();
            }
        } else {
            realmap.hide();
            thumbrange.show();
            realthumb.hide();
            G.mapMode = mode;
            G.byId('thumb').style.background = 'url(./static/images/' + mode + '/thumb.jpg)';
            $('#map').empty();
            this.bgimg();
            if(G.switchHotArea) this.hotArea();
        }
	}
	
	//显示背景图片
	map.prototype.bgimg = function() {
		var a = $('#container'),
			b = $('#drag'),
			mainmap = $('#mainmap'),
			mw = mainmap.width(),
			mh = mainmap.height(),
			x = -a.position().left - b.position().left,
			y = -a.position().top - b.position().top,
			xmin = parseInt(x / 256),
			xmax = (x + mw) / 256,
			ymin = parseInt(y / 256),
			ymax = (y + mh) / 256,
			mapImg = '',
			i, j;
		for(i = xmin; i < xmax; i ++)
			for(j = ymin; j < ymax; j ++)
				if(G.byId(G.level + '-' + i + '-' + j) == null)
					mapImg += '<img src="./static/images/' + G.mapMode + '/' + G.level + '/' + i + ',' + j + '.jpg" class="mapblock" id="' + G.level + '-' + i + '-' + j + '" style="left:' + i * 256 + 'px;top:' + j * 256 + 'px;" />';
		$('#map').append(mapImg);
		var thumb = $('#thumb'),
			w = thumb.width(),
			h = thumb.height(),
			p = Math.pow(2, G.level - 1) * 1536;
		$('#thumbrange').css({'left': parseInt(x * w / p), 'top': parseInt(y * h / p), 'width': parseInt(mw * w / p) - 5, 'height': parseInt(mh * h / p) - 3});
	}
	
	//移动地图
	map.prototype.movemap = function(x, y, animate) {
		var a = $('#container'),
			b = $('#drag'),
			c = a.width() - b.width(),
			d = a.height() - b.height(),
			e = b.position().left + x,
			f = b.position().top + y;
		if(e < 0) e = 0;
		if(e > c) e = c;
		if(f < 0) f = 0;
		if(f > d) f = d;
		if(animate) {
			b.animate({left: e, top: f}, 500, this.bgimg);
		} else {
			b.css({left: e, top: f});
			this.bgimg();
		}
	}
	
	//放大缩小
	map.prototype.zoom = function(m, x, y) {
		var a = $('#container'),
			b = $('#drag'),
			mainmap = $('#mainmap'),
			mw = mainmap.width(),
			mh = mainmap.height(),
			levelMin = 1,
			levelMax = 3,
			p;
		if(G.level + m > levelMax || G.level + m < levelMin) return false;
		G.level += m;
		$('#cscroll').css('top', 162 - (G.level - 1) * 39);
		$('#czoomin').css('cursor', G.level == levelMax ? 'default' : 'pointer');
		$('#czoomout').css('cursor', G.level == levelMin ? 'default' : 'pointer');
		p = Math.pow(2, G.level - 1) * 1536;
		a.css({'left': mw - p, 'top': mh - p, 'width': p * 2 - mw, 'height': p * 2 - mh});
		if(x == undefined) {
			x = mw / 2;
			y = mh / 2;
		} else {
			x = mw - (x - mainmap.position().left);
			y = mh - (y - mainmap.position().top);
		}
		if(m == 1) {
			b.css({'left': b.position().left * 2 + x, 'top': b.position().top * 2 + y, 'width': p, 'height': p});
		} else {
			b.css({'left': b.position().left / 2 - x / 2, 'top': b.position().top / 2 - y / 2, 'width': p, 'height': p});
		}
		$('#wq').hide();
		$('#map').empty();
		this.movemap(0, 0, false);
		this.zoomhotspot();
	}
	
	//热区生成及显示
	map.prototype.hotArea = function() {
		var $this = this;
		paper.clear();
		$.getJSON('./index.php?mod=mapcover&mode=' + G.mapMode).done(function(json) {
			var drag = $('#drag'),
				len = json.length,
				name, path, center, svgPath, svgItem, i, j;
			for(i = 0; i < len; i ++) {
				name = json[i].name.split(',');
				name = name[1] == undefined ? name[0] : name[0] + '\n' + name[1];
				switch(json[i].type) {
				case 'building':
				case 'land':
				case 'area':
					center = json[i].center.split(',');
					if(json[i].path != '') {
						svgPath = 'M';
						path = json[i].path.split(',');
						svgPath += path[0] + ',' + path[1];
						for(j = 2; j < path.length; j += 2) {
							svgPath += 'L';
							svgPath += path[j] + ',' + path[j + 1];
						}
						svgPath += 'Z';
						svgItem = paper.path(svgPath).attr({ cursor: 'pointer', fill: '#f00', 'fill-opacity': 0, stroke: '#a22', 'stroke-width': 2, title: name }).data('level', json[i].level).mouseover(function() {
							this.animate({ 'fill-opacity': 0.2, stroke: '#f00' }, 0);
						}).mouseout(function() {
							this.animate({ 'fill-opacity': 0, stroke: '#a22' }, 0);
						});
					} else {
						svgItem = paper.text(center[0], center[1], name).data('level', json[i].level);
						if(json[i].type == 'building') {
							svgItem.attr({ cursor: 'pointer', font: 'bold 12px "微软雅黑"', fill: '#fff', 'stroke-width': 0 });
						} else if(json[i].type == 'land') {
							svgItem.attr({ cursor: 'pointer', font: 'bold 12px "微软雅黑"', fill: '#f2f279', 'stroke-width': 0 });
						} else if(json[i].type == 'area') {
							svgItem.attr({ cursor: 'pointer', font: 'bold 14px "微软雅黑"', fill: '#feaeae', 'stroke-width': 0 });
						}
						svgItem.node.style.textShadow = '#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0';
					}
					(function() {
						var id = json[i].id,
							name = json[i].name.split(','),
							x = center[0],
							y = center[1];
						if(name.length == 2) y -= 7;
						name = name.join('');
						svgItem.click(function() {
							drag.hasClass('noclick') ? drag.removeClass('noclick') : $this.showWq(id, name, x, y);
						});
					})();
					break;
				case 'bus':
					if(json[i].id == 101) {
						paper.path(json[i].path).attr({ stroke: '#ff0', 'stroke-opacity': 0.5, 'stroke-width': 4 });
					} else {
						paper.path(json[i].path).attr({ stroke: '#f00', 'stroke-dasharray': '.', 'stroke-opacity': 0.5, 'stroke-width': 4 });
					}
					break;
				case 'station':
					center = json[i].center.split(',');
					paper.circle(center[0], center[1], 6).attr({ cursor: 'default', fill: '#f00', title: name });
					break;
				}
			}
			$this.zoomhotspot();
		});
	}

    //弹出简介
    map.prototype.showWq = function(id, name, x, y) {
        var $this = this;
        $('#wqtitle').text(name);
        $('#wqmain').load('./index.php', { mod: 'hotarea', id: id }, function() {
            var wq = $('#wq'),
                a = $('#container'),
                b = $('#drag'),
                moveX = 0,
                moveY = 0,
                pow = Math.pow(2, G.level - 1),
                temp, diff;
            wq.show();
            diff = 169 - $('#wqmain').outerHeight();
            wq.css({'height': 200 - diff, 'left': x * pow - 132, 'top': y * pow - (239 - diff)});
            temp = wq.position().left + wq.width() + a.offset().left + b.position().left - $(window).width() + 90;
            if(temp > 0) moveX = temp;
            else {
                temp = wq.position().left + a.position().left + b.position().left - 65;
                if(temp < 0) moveX = temp;
            }
            temp = wq.position().top + wq.height() + a.offset().top + b.position().top - $(window).height() + 80;
            if(temp > 0) moveY = temp;
            else {
                temp = wq.position().top + a.position().top + b.position().top - 20;
                if(temp < 0) moveY = temp;
            }
            if(moveX != 0 || moveY != 0) {
                $this.movemap(-moveX, -moveY, true);
            }
        });
    }
	
	//放大缩小热区
	map.prototype.zoomhotspot = function() {
		var lv = G.level,
			p = Math.pow(2, lv - 1) * 1536;
		if(lv == 3) lv = 4;
		paper.setSize(p, p);
		cc=[];
		paper.forEach(function(el) {
			cc.push(el);
			if(el.type == 'text') {
				el.transform('t' + el.attr('x') * (lv - 1) + ',' + el.attr('y') * (lv - 1));
				el.node.style.filter = 'Dropshadow(color=#88000000,offx=1,offy=0) Dropshadow(color=#88000000,offx=0,offy=1) Dropshadow(color=#88000000,offx=0,offy=-1) Dropshadow(color=#88000000,offx=-1,offy=0)';
				el.node.style.padding = '1px';
			} else if(el.type == 'circle') {
				el.transform('t' + el.attr('cx') * (lv - 1) + ',' + el.attr('cy') * (lv - 1));
			} else {
				el.transform('s' + lv + ',' + lv + ',0,0');
				if(lv == 1) el.attr('stroke-width', el.attr('stroke-width'));
			}
			var dataLv = el.data('level');
			if(dataLv > 1) dataLv > lv ? el.hide() : el.show();
			if(dataLv == 0) lv > 1 ? el.hide() : el.show();
		});
	}
	
	module.exports = map;
});