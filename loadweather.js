var xmlhttp = new XMLHttpRequest();
//xmlhttp.onload = function () {//以下の処理とほぼおなじ（loadがうまくいったとき呼ばれる）

var data//APIをたたいた時のjson
var index2=0;
var tableTemplate = [["時刻", , , , , , , ,], //表のテンプレート
                     ["天気", , , , , , , ,],
                     ["" , , , , , , , , ,],
                     ["気温(度)", , , , , , , ,],
                     ["湿度(%)", , , , , , , ,],
                     ["降水量(mm)", , , , , , , ,],
                     ["風速(m/s)", , , , , , , ,],
                     ["風向", , , , , , , ,]];

var T=tableTemplate;
var weathers=[];//天気の状態を格納した配列
var images=[];//画像のリンクの一部
var imagesurl=[];//画像リンク
var temperatures=[];//温度を格納した配列
var humids=[];//湿度を格納した配列
var precipitations=[];//降水量を格納した配列
var windDirections=[];//風向きを格納した配列
var windSpeeds=[];//風力を格納した配列
var currentTimes=[];//時刻を格納した配列
var days=[];//〇月×日△曜日を格納した配列


xmlhttp.onreadystatechange = function () {
 if (xmlhttp.readyState == 4) {
   if (xmlhttp.status == 200) {
      data = JSON.parse(xmlhttp.responseText);

      weathers=[];//天気の状態を格納した配列
      images=[];//画像のリンクの一部 0~d
      imagesurl=[];//画像リンク
      temperatures=[];//温度を格納した配列
      humids=[];//湿度を格納した配列
      precipitations=[];//降水量を格納した配列
      windDirections=[];//風向きを格納した配列
      windSpeeds=[];//風力を格納した配列
      currentTimes=[];//時刻を格納した配列
      days=[];//〇月×日△曜日を格納した配列

      var city =document.getElementById("cityname");
      city.textContent=data["city"]["name"]+"の天気";
      var listsize=data["list"]["length"];

      //検索するたびに存在するノードを消す
      var parent = document.getElementById('table');
      while(parent.lastChild){
        parent.removeChild(parent.lastChild);
      }
      console.log(data);
      for(var i=0;i<listsize;i++){//40件のデータを処理(5日分)

        var nowWeather=data["list"][i]["weather"][0]["description"]; //その時点での天気の状態を取得
        var png=data["list"][i]["weather"][0]["icon"]; //天気画像を取得
        var nowTemp=data["list"][i]["main"]["temp"]; //気温を取得
        var nowHumid=data["list"][i]["main"]["humidity"]; //湿度を取得
        var now_Precipitation=data["list"][i]["rain"];//降水量を取得
        var windSpeed=data["list"][i]["wind"]["speed"];//風力を取得
        var windDirection=data["list"][i]["wind"]["deg"];//風向きを取得
        var currentTime=data["list"][i]["dt"];//現在時刻の取得
        currentTime*=1000;
        var date=new Date();

        weathers.push(nowWeather);
        imagesurl.push('http://openweathermap.org/img/wn/'+ png +'@2x.png');

        temperatures.push(nowTemp);
        humids.push(nowHumid);

        if(now_Precipitation===undefined){
          precipitations.push(0);
        }else{
          precipitations.push(now_Precipitation["3h"]);
        }

        windSpeeds.push(windSpeed);
        windDirections.push(Decide_direction(windDirection));

        date.setTime(currentTime);
        time=date.getHours();
        currentTimes.push(time+"時");
        
        var dateString=((date.getMonth()+1)+"月 "+date.getDate()+"日 ");
        dateString+=" "+Decide_day(date.getDay());
        days.push(dateString);
      }
  
      for(i=1;i<=5;i++){
        Show_forecast(8*(i-1),8*i-1)
      }
      index2=0;
   }
 }
};

function Decide_day(n){
  var answer;
  if(n==1) {answer="月曜日"; return answer;}
  else if(n==2) {answer="火曜日"; return answer;}
  else if(n==3) {answer="水曜日"; return answer;}
  else if(n==4) {answer="木曜日"; return answer;}
  else if(n==5) {answer="金曜日"; return answer;}
  else if(n==6) {answer="土曜日"; return answer;}
  else {answer="日曜日"; return answer;}
}

function Show_forecast(start,end){
  var index1=1;
  for(var i=start;i<=end;i++){
    var image=new Image();
    T[0][index1]=currentTimes[i];
    T[1][index1]=weathers[i];
    T[2][index1]=image;
    T[3][index1]=temperatures[i];
    T[4][index1]=humids[i];
    T[5][index1]=precipitations[i];
    T[6][index1]=windSpeeds[i];
    T[7][index1]=windDirections[i];
    index1++;
  }

  // 表の動的作成
  makeTable(start);
  T=tableTemplate;
}

// 表の動的作成
function makeTable(start){
  // 表の作成開始
  var rows=[];
  var table_data = document.createElement("table");
  var day_data=document.createElement("p");

  // 表に2次元配列の要素を格納
  var hight=T.length;
  var wide=T[0].length;

  for(var i=0;i<hight;i++){
      rows.push(table_data.insertRow(-1));  // 行の追加
      for(var j=0;j<wide;j++){
          if(i==2){
            if(j==0){
              cell=rows[i].insertCell(-1);
              cell.appendChild(document.createTextNode(T[i][j]));
              cell.style="text-align:center";
              cell.style="";
              cell.style.border="2.5px solid gray";
              cell.style.backgroundColor = "99FFFF";
              continue;
            }
            cell=rows[i].insertCell(-1);
            var img=document.createElement("img");
            img.src=imagesurl[index2++];
            cell.appendChild(img);
            cell.style="text-align:center";
            cell.style.border="2.5px solid gray";
            cell.style.backgroundColor = "99FFFF";
          }else{
            cell=rows[i].insertCell(-1);
            cell.appendChild(document.createTextNode(T[i][j]));
            cell.style="text-align:center";
            cell.style.border="2.5px solid gray";
            if(i==3&&T[i][j]>=30&&j!=0){
              cell.style.backgroundColor = "f57878";
            }else{
              cell.style.backgroundColor = "99FFFF";
            }
          }
      }
  }
  // 指定したdiv要素に表を加える
  day_data.textContent=days[start];
  document.getElementById("table").appendChild(day_data);
  document.getElementById("table").appendChild(table_data);
}


function Decide_direction(digree){ //度数法から方角を求める
  var answer
  if(22.5<digree&&digree<=67.5){
    answer="北東";
    return answer;
  }else if(67.5<digree&&digree<=112.5){
    answer="東";
    return answer;
  }else if(112.5<digree&&digree<=157.5){
    answer="南東";
    return answer;
  }else if(157.5<digree&&digree<=202.5){
    answer="南";
    return answer;
  }else if(202.5<digree&&digree<=247.5){
    answer="南西";
    return answer;
  }else if(247.5<digree&&digree<=292.5){
    answer="西";
    return answer;
  }else if(292.5<digree&&digree<=337.5){
    answer="北西";
    return answer;
  }else{
    answer="北";
    return answer;
  }
};

window.onload=function(){
  document.getElementById("submit").onclick=function(){
    var town=document.getElementById("input").value;
    var url = "https://api.openweathermap.org/data/2.5/forecast?q="+town+"&appid=bcdaa4423568428273e853c7bcc59c79&units=metric&lang=ja";
    xmlhttp.open("GET", url);
    xmlhttp.send();
  };
};
