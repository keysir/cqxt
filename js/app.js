var bodyWidth = $("body").css("width");
// $("div.items").css("width",(bodyWidth.substring(0,bodyWidth.length-2)-380)+"px");

//参与抽奖人数初始值
var itemCount= 84;

//每次抽人数
var itemcqCount=10;

//跑马灯循环
var tx;
var runtx;
//是否正在运行跑马灯
var isRun=false;
//是否跑马灯暂停状态
var pause =false;
//排名分组显示算法已经取消
//var ts=20
//默认跑马灯频率
var pl=50;
//程序是否开始运行用于判断程序是否开始运行
var isStart=false;

var datename=eval('(' +'{'+ $("#datavalue").val() +'}'+')');//;


var zzs = "#98ff98";
//跑马灯音效
var runingmic=document.getElementById("runingmic");
runingmic.volume=0.5;
//中奖音效
var pausemic=document.getElementById("pausemic");
pausemic.volume=1.0;

var keyStatus=false;

$("document").ready(function(){
    
    //初始化皮肤
    if(localStorage.getItem("pf")){
		var	pf = localStorage.getItem("pf");
		dynamicLoading.css("./css/style"+pf+".css");
		$("#bodybg img").attr("src","./images/bodybg"+pf+".jpg");
		$("input[name=pf][value="+pf+"]").attr("checked",true);
		if(pf!=1){
		    zzs="#ba3030";
		}
	}
    //初始化标题
    if(localStorage.getItem("title")){
		$("#title").val(localStorage.getItem("title"));
	}
	if($("#title").val()){
		$(".top").text($("#title").val());
	}
    //频率模式本地存储  	 
	if(localStorage.getItem("ms")){
		pl = localStorage.getItem("ms");
		$("input[name=ms][value="+pl+"]").attr("checked",true);
	}
	//排名信息本地存储
	if(localStorage.getItem("sequence")){
        var ssHtml = localStorage.getItem("sequence");
		$(".ss").html(ssHtml);
	}
	
	//已经取消的输入
	//var inputItemCount = prompt("请输入参与抽奖人数(请输入数字，输入非数字会按默认人数计算)。");
	
	//本地排名信息存储
	if(localStorage.getItem("itemCount")){
		itemCount=localStorage.getItem("itemCount");
	}
    //本地设定回显  	 
	$("#personCount").val(itemCount);

	//每次抽签人数信息存储
	if(localStorage.getItem("itemcqCount")){
		itemcqCount=localStorage.getItem("itemcqCount");
	}
	//本地设定回显  	 
	$("#cqCount").val(itemcqCount);

	
	//创建item小方格
	for(var i=1;i<=itemCount;i++){
		$("div.items").append("<div class='item i"+i+"' item-data='"+i+"'>"+datename[i]+"</div>");
    }
	//本地存储item宽度信息
	if(localStorage.getItem("itemk")){
		$("div.item").css("width",localStorage.getItem("itemk")+"px");
	}
    //本地存储item高度信息
	if(localStorage.getItem("itemg")){
		$("div.item").css("height",localStorage.getItem("itemg")+"px");
		$("div.item").css("line-height",localStorage.getItem("itemg")+"px");
	}
    //回显设定item宽高
	$("#itemk").attr("placeholder",$(".i1").css("width"));
	$("#itemg").attr("placeholder",$(".i1").css("height"));
	
	//初始化排序信息
	$(".ss li").each(function(idx,item){
		$(".i"+$(item).attr("data-number")).addClass("ignore");
	});
	
	//$("div.menu").css("height",$("div.items").css("height"));
    $("body").keyup(function(e){
    	keyStatus=false;
	});
	//全局键盘事件监听
	$("body").keydown(function(e){
		if(isStart){
			if(!keyStatus){
			keyStatus=true;
			}else{
				return false;
			}
		}
		if(e.keyCode==116||e.keyCode==8){
			return true;
		}
		//按F1弹出帮助窗口
		if(e.keyCode==112){
			e.preventDefault();
			showReadme();
			return false;
		}
		if(e.keyCode==113){
			e.preventDefault();
			showmenu();
			return false;
		}
		if(e.keyCode==114){
			e.preventDefault();
			showdatavalue();
			return false;
		}

		
		//ESC案件呼出隐藏菜单
		if(e.keyCode==27){
			if($(".help:hidden").size()>0)
				$(".help").show();
			else
				$(".help").hide();
			
			return false;
		}
        
		if(e.keyCode==37){
			$(".prev").click();
			return false;
		}
		if(e.keyCode==39){
			$(".next").click();
			return false;
		}
		//当程序出于暂停状态
		if(pause){
			//以下按键有效 数字键 0-9 和 小键盘 0-9
			return true;
		}
		//存在未中奖用户切程序出于未开始运行状态执行开始方法
		if((e.keyCode==32||e.keyCode==65)&&$("div.item:not(.ignore)").size()!=0){

			if(!isStart&&!isRun){
				on_run=0;
				isRun=true;
				isStart=true;
				$(".item.active").removeClass("active");
				startApp();
				return false;
			}
			if(isStart&&isRun){
				isRun=false;
				$(".item.active").removeClass("active");
				nextApp();
				return false;

			}
			
		}
		
		if(e.keyCode==32||e.keyCode==65){
			
			//当所有抽奖号全部抽取完毕则销毁跑马和音效循环
			if($("div.item:not(.ignore)").size()==0){
				clearInterval(tx);
				clearInterval(runtx);	
				alert("抽签已经全部结束。");
				return false;
			}
		}
		
		//e.preventDefault();
	});
	
	//打开高级设置窗口	 
	$("a.config").click(function(){
		pause=true;
		runingmic.pause();
		
		var d = dialog({
			title: '抽签参数设定',
		    content: $(".model"),
		    okValue: '确定',
		    ok: function () {
		    	
		    	if($("#reset:checked").val()&&confirm("点击确定将清空抽奖结果。")){
		    		localStorage.removeItem("sequence");
		    	}
		    	if($("#personCount").val()){
		    		localStorage.setItem("itemCount",$("#personCount").val());
		    	}
		    	if($("#cqCount").val()){
		    		localStorage.setItem("itemcqCount",$("#cqCount").val());
		    	}
		   		if($("#itemk").val()){
		   			localStorage.setItem("itemk",$("#itemk").val());
		    	}
		   		if($("#itemg").val()){
		    		localStorage.setItem("itemg",$("#itemg").val());
		    	}
		    	localStorage.setItem("title",$("#title").val());
		    	localStorage.setItem("ms",$("input[name=ms]:checked").val());
		    	localStorage.setItem("pf",$("input[name=pf]:checked").val());
		    	
		    	window.location.reload();


		    },onclose: function () {
		        pause=false;
		    }
			}).show();

		 });
	
	//清除错误中奖号
	$("body").on("click",".item.ignore",function(){
		var inputItemCount = prompt("请输入点击的号码来进行删除中奖号码（例如“12”）。");
		if(inputItemCount == $(this).attr("item-data")){
			$("li[data-number="+$(this).attr("item-data")+"]").remove();
			$(this).removeClass("ignore");
			localStorage.setItem("sequence",$(".ss").html());	
			}
		
	});
});

//程序开始入口
function startApp(){

	//开始播放跑马灯音效
	runingmic.play();
	if (dd_dialog) {
		dd_dialog.close();
	}
	
 	//产生随机数临时变量
	var rand =0;
	//存储上一次随机数的临时变量
	
	tx=setInterval(function(){
	    if(isRun){
			rand=Math.floor(Math.random()*($("div.item:not(.ignore)").size()));		 	
			$(".item.active").removeClass("active");
			$("div.item:not(.ignore):not(.active)").eq(rand).addClass("active");
		}
	},pl);
	runtx = setInterval(function(){runingmic.currentTime = 0;},7000);//循环播放
}
var on_run=0;
//程序开始入口
function nextApp(){
	
    if(on_run<Number(itemcqCount)&&$("div.item:not(.ignore)").size()>0){
		
		 	//产生随机数临时变量
			var rand =0
			rand=Math.floor(Math.random() * ( $("div.item:not(.ignore)").size()));			 

			// if (typeof($("div.item:not(.ignore):not(.active)").eq(rand).attr("item-data")) == "undefined") {
			// 	console.log("KKKKKK"+rand);
			//    console.log($("div.item:not(.ignore):not(.active)").eq(rand).html());
			// }

			$('.ss ol').append('<li data-number='+$("div.item:not(.ignore):not(.active)").eq(rand).attr("item-data")+'>('
				+(new Date()).Format("yyyy-MM-dd")
				+')&nbsp;'
				+fnum($("div.item:not(.ignore):not(.active)").eq(rand).attr("item-data"))+'号：'
				+$("div.item:not(.ignore):not(.active)").eq(rand).text()+'</li>');
			
			localStorage.setItem("sequence",$(".ss").html()); 
			console.log(itemcqCount+"on_run"+on_run+","+rand);
			console.log("text"+$("div.item:not(.ignore):not(.active)").eq(rand).text());
			
			$("div.item:not(.ignore):not(.active)").eq(rand).addClass("active");
			$(".item.active").addClass("ignore");
			
			setTimeout(function(){
				on_run++;
				nextApp();
				
			},100)
			
	}else{
	 	setTimeout(function(){
	 		on_run=0;
			endrun();
		},pl)
	 }

}


var dd_dialog=null;
function endrun(){
	pause=true;
	var it = "";
	//console.log(it);
	var xi=0;
	$(".item.active").each(function(){
		xi++;
         if(it!=""){
         	if(xi%5==0){
         		it=it+"&nbsp;&nbsp;"+$(this).text()+"<br>";
         	}else if(xi%5==1){
         		it=it+$(this).text();
         	}else{
         		it=it+"&nbsp;&nbsp;"+$(this).text();
         	}

			 
		 }else{
			it=$(this).text();
		 }
        
    });

	runingmic.pause();
	
	//播放中奖音效
	pausemic.currentTime = 0;
	pausemic.play();


	//中奖号处理
	// var it=Number(it);
    var r;
     r='<div class="cq-title-one">恭喜以下同学被抽中了！</div><br><div class="cq-content">'+it+'</div>';
   
    var  dd_dialog = dialog({
            // title: '抽签结果',
     //       width: $(window).width()*0.9+'px',
		   // height: $(window).height()*0.9+'px',
	
		   // padding:0,
		    fixed: true,
		    top:350,
            content: r,
            okValue: '关闭',
			ok:function(){
		    },
		    onclose: function () {
		        pause=false;
		    }
        })
    // .width($(window).width()*0.9).height($(window).height()*0.9);
    dd_dialog.show();
    isStart=false;
    localStorage.setItem("sequence",$(".ss").html()); 
	$(".item.active").pulsate({
		color: zzs,        //#98ff98
		repeat: 5
	});

};

function fnum(num){
	if(num<10){
		return "0"+num;
	}else{
		return num;
	}
}

function showReadme(){
	dd_dialog = dialog({
		    title: '帮助信息',
		    content: $(".readme") ,
		    width:'400px',
		    okValue: '关闭',
			ok:function(){
		    },
		    onclose: function () {
		        pause=false;
		    }
	}).show();
}
function showmenu(){
	dd_dialog = dialog({
		    title: '抽签结果',
		    content: $(".menu") ,
		    width:'400px',
		    height:'400px',
		    okValue: '关闭',
			ok:function(){
		    },
		    onclose: function () {
		        pause=false;
		    }
	}).show();
}
function showdatavalue(){
	dd_dialog = dialog({
		    title: '学生数据',
		    content: $(".datavalue") ,
		    width:'400px',
		    height:'400px',
		    okValue: '关闭',
			ok:function(){
		    },
		    onclose: function () {
		        pause=false;
		    }
	}).show();
}

var dynamicLoading = {
    css: function(path){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function(path){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}