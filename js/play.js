var playList = [{
	    title:'陪你度过漫长岁月',
	    author:'陈奕迅',
	    src:'audio/陪你度过漫长岁月.mp3', 
	    lrc:'./audio/陪你度过漫长岁月.lrc'
	    },{
	    title:'andy',
	    author:'阿杜',
	    src:'audio/Andy.mp3', 
	  	lrc:'./audio/andy.lrc'
	  },{
	    title:'剑魂',
	    author:'李炜',
	    src:'audio/剑魂.mp3', 
	   	lrc:'./audio/剑魂.lrc'
	}];
	window.onload =function(){
	var Songlist= document.getElementById("Songs");
	var audioTag = document.getElementsByTagName("audio");
	for(var key in playList){
        Songlist.innerHTML = Songlist.innerHTML + "<li><span class='songName'>" +playList[key].title +
        "</span><span class='singer'>"+ playList[key].author +"</span></li>";
	}
	var lis = Songlist.getElementsByTagName("li");
	for(var i=0;i<lis.length;i++){
        lis[i].addEventListener("click",(function(i){
              return function(){
    	 	playChoo(i);//如果直接写方法，则不能实现点击一次访问一次，只会一次性全部执行完
    	 }
        })(i));
	}
	
	function playChoo(i){
        lis[i].style.background = "rgb(209, 223, 226)";
        document.getElementById("Sindex").value = i; 
        for(var j=0;j<lis.length;j++){
        	if(j!=i){
        		lis[j].style.background = "#EFE0E0";
        	}
        }
        audioTag[0].src=playList[i].src;
        audioTag[0].play();
	  }   
 }  	
 function changeLyric(){
    var Songs= document.getElementById("Songlist");
 	var lyric= document.getElementById("lyric");
 	var audioTag = document.getElementsByTagName("audio");
 	//var src = audioTag[0].src;
 	//src = src.match("([^/]+)\/([^/]+)\.mp3")[0];//此时取得的src是绝对路径，用正则表达式转换成相对路径
 	if(lyric.style.display == "none"){
		 Songs.style.display = "none";
	     lyric.style.display = "block";
	     if(audioTag[0].paused){
		   lyric.innerHTML ="<img src='img/lion.gif'>"+"<div>还没播放音乐呢</div>";

		 }
		 else{
		 	lyric.innerHTML ="";
		 	 var Sindex = document.getElementById("Sindex").value;
    		 var ly = reorganizeLyric(Sindex);
    		 //动态显示歌词
    		 DynamicLyric(ly);

             //监听ontimeupdate事件
			// audioTag[0].ontimeupdate = function() {
			 //遍历所有歌词，看哪句歌词的时间与当然时间吻合
			  //  for (var i = 0, l = __lis.length; i < l; i++) {
			        /*当前播放的时间*/
			 //       if (this.currentTime>__lis[i][0]) {
			            //显示到页面
			           // lyric.textContent = ly[i][1];
			//           __go.bind(this, _lineno+1), _time
			//       };
			//   }; 
			//};
    		
	 }
 	}else{
        Songs.style.display = "block";
	    lyric.style.display = "none";
 	}
}
  //处理lrc歌词,需用Ajax才能获得文本内容
  function reorganizeLyric(key){
  	//提取文本
  	//doAjaxCall(playList[key].lrc);  ajax的方法是异步获取文本，程序需要同步获取
  	var url = playList[key].lrc;
  	doAjaxCall(url);
  	var lines = document.getElementById("hiddenV").innerHTML;

  // $("#hiddenV").load("./Getfile.php",{"url" : "url"});
   //将文本分隔成一行一行，存入数组
   //var lines = $("#hiddenV").val();
 
   if(lines !="" && lines != undefined){
     lines = lines.split('\n'),
        //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
        pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
        //保存最终结果的数组
        result = [];
    //去掉不含时间的行
    while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
    };
    //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function(v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {
        //提取出时间[xx:xx.xx]
        var time = v.match(pattern),
            //提取歌词
            value = v.replace(pattern, '');
        //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
        time.forEach(function(v1, i1, a1) {
            //去掉时间里的中括号得到xx:xx.xx
            var t = v1.slice(1, -1).split(':');
            //将结果压入最终数组
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
        });
    });
    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function(a, b) {
        return a[0] - b[0];
    });
    return result;
   }
}
function doAjaxCall(the_request)
    {
        var request=null;
        if(window.XMLHttpRequest)
        {
            request=new XMLHttpRequest();
        }else if(window.ActiveXObject)
        {
            request=new ActiveXObject("Microsoft.XMLHTTP");
        }
        if(request)
        {
            request.open("GET",the_request,false);
            request.onreadystatechange=function()
            {
                if(request.readyState===4)
                {
                    if (request.status == 200 || request.status == 0)
                    {
                       document.getElementById("hiddenV").innerHTML =  request.responseText;
                       //return request.responseText;
                    }
                }
            }
            request.send(null);
        }else{
            alert("error");
            }
    }  
    function DynamicLyric(__lis){
    	var lyric= document.getElementById("lyric");
    	//lyric.innerHTML ="<img src='img/lion.gif'>";

        var audioTag = document.getElementsByTagName("audio");
        var __eul = document.createElement("ul");
        lyric.appendChild(__eul);
		(function(){
		for (var i = 0; i < __lis.length; i++) {
			var eli = document.createElement("li");
			eli.innerHTML = __lis[i][1];
			__eul.appendChild(eli);
		}
		})();

		var __freq = 30; // 滚动频率（ms）
		var __fraction = 2/5; // 高亮显示行在歌词显示区域中的固定位置百分比 
        
		/**
		 * 当前歌词行（lineno）滚动
		 */
		var __go = function(_lineno){
			if(_lineno < __lis.length){
			var _time;
			if (_lineno === 0) {
				_time = __lis[_lineno][0];
			} else {
				
				_time = __lis[_lineno][0] - __lis[_lineno-1][0];
			 }
			var _timer = setTimeout(__go.bind(this, _lineno+1), _time*1000);
			// 高亮下一行歌词
			if (_lineno > 0) {
				__eul.children[_lineno-1].setAttribute("class", "");//让这一行颜色
			}
			__eul.children[_lineno].setAttribute("class", "z-crt");

			var _ep = __eul.children[_lineno];
			
			// 满足需求5，6__eul
			var _scrollTop;
			if (_ep.offsetTop < lyric.clientHeight*__fraction){
				_scrollTop = 0;
			} else if (_ep.offsetTop > (lyric.scrollHeight - lyric.clientHeight*(1-__fraction))){
				_scrollTop = lyric.scrollHeight - lyric.clientHeight;
			} else {
				_scrollTop = _ep.offsetTop - lyric.clientHeight*__fraction;
			}

			// 如用户拖动滚动条导致当前显示行超出显示区域范围，下一行直接定位到当前显示行
			if (lyric.scrollTop > (_scrollTop + lyric.clientHeight*__fraction)
				|| (lyric.scrollTop + lyric.clientHeight*__fraction) < _scrollTop){
				lyric.scrollTop = _scrollTop;
			} else { // 单行滚动
				// 获取滚动步长
				var _step = Math.ceil(Math.abs(lyric.scrollTop - _scrollTop)/(_time/__freq));
				__scroll(lyric.scrollTop, _scrollTop, _step);	
			}

			}
            
		};
		/**
		 * 歌词单行滚动实现
		 */
		__scroll = function(_crt, _dst, _step){
			if(Math.abs(_crt - _dst) < _step){
				return;
			}
			if(_crt < _dst){
				__eul.scrollTop += _step;
				_crt += _step;
			} else {
				__eul.scrollTop -= _step;
				_crt -= _step;
			}
			setTimeout(__scroll.bind(this, _crt, _dst, _step), __freq);
		};

		__go(0);

		};



