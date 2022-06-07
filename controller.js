/*
     조건1) 2개의 센서(광센서, 터치센서) 2개의 액츄레이터(부져, LED)를 활용한다. 
     조건2) Touch센서에 터치할때마다, 3색 LED를 모두 켠다. 
     조건3) 3색 LED가 모두 켜져 있을때만, 광센서가 빛을 센싱을 할 수 있다.
     조건5) 광센서에서 변화(밝음->어두움)가 측정되면 부져가 0.2초동안 울린다(삐).
     조건6) 광센서에서 변화(어두움->밝음)가 측정되면 부져가 0.1초동안 연속2번을 울린다(삐삐).
*/

   <소프트웨어 코드,   controller.js  완벽히 완성된 소스코드를 복사-붙여넣기로 넣는다. 
     단, 들여쓰기, 줄맞추기 등 최적의 가독성을 위해서 최적의 포맷팅을 하여야 한다. >
 

const gpio = require ('pigpio').Gpio ;
const LIGHT =4 ;
const TOUCH =13 ;
const BUZZER = 26 ;
const RED = 16 ;
const GREEN = 20 ;
const BLUE = 21 ;
const touch = new gpio (TOUCH , { mode :gpio .INPUT });
const buzzer = new gpio (BUZZER , { mode :gpio .OUTPUT });
const light = new gpio (LIGHT , { mode :gpio .INPUT });
const rled = new gpio (RED , { mode :gpio .OUTPUT });
const gled = new gpio (GREEN , { mode :gpio .OUTPUT });
const bled = new gpio (BLUE , { mode :gpio .OUTPUT });


rled .digitalWrite (0 );
gled .digitalWrite (0 );
bled .digitalWrite (0 );
var count = 0 ;
const TurnOnBuzzer = ( ) => {
   buzzer .digitalWrite (1 );
}
const TurnOffBuzzer = ( ) => {
   buzzer .digitalWrite (0 );
}
const TurnOnLED = ( ) => {
   rled .digitalWrite (1 );
   gled .digitalWrite (1 );
   bled .digitalWrite (1 );
}
const TurnOffLED = ( ) => {
   rled .digitalWrite (0 );
   gled .digitalWrite (0 );
   bled .digitalWrite (0 );
}
const OneBuzzer = function () {
   buzzer .digitalWrite (1 );
   setTimeout (TurnOffBuzzer , 100);
}
const TwoBuzzer = function () {
   buzzer .digitalWrite (1 );
   setTimeout (TurnOffBuzzer , 100);
}
const CheckTouch = ( ) => {
   let data1 = touch .digitalRead ();
   if (data1 ){
    console .log ("터치!!");
    rled .digitalWrite (1);
    gled .digitalWrite (1);
    bled .digitalWrite (1);
    count ++;
    if ((count %2 ) == 1) {
     let data2 = light .digitalRead ();
     if (!data2 ) {
      console .log ("어두움 -> 밝음");
      setImmediate (OneBuzzer );
      setTimeout (TwoBuzzer , 300 );
      /* 
         setInterval(TurnOnBuzzer, 30);
         setTimeout(TurnOffBuzzer, 100);
         */
     }
     else {
      console .log ("밝음 -> 어두움");
      buzzer .digitalWrite (1 );
      setTimeout (TurnOffBuzzer , 200);}
    } else {
     setTimeout (TurnOffBuzzer , 100);
     setTimeout (TurnOffLED , 100);}}
   else {
   }
   setTimeout (CheckTouch ,200);
}


process .on ('SIGINT', function () {
   rled .digitalWrite (0);
   gled .digitalWrite (0);
   bled .digitalWrite (0);
   buzzer .digitalWrite (0);
console .log ("종료되었습니다");
porcess .exit ();
});

setImmediate (CheckTouch);




   
