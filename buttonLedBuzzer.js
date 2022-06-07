/*     조건1) 버튼과 3색LED, 부져를 활용한다.
     조건2) 버튼을 첫 번째로 누르면 초록색 LED가 켜진다.  두 번째로 누르면 파랑색이 켜진다.
     조건3) 세 번째로 누르면 빨강색 LED가 켜진다. 
     조건4) LED가 켜질때마다 100ms동안 부져소리가 난다.    
     조건5) 무한반복 실행되며, ^C를 누르면 모든 LED와 부져가 모두 꺼진후 프로그램이 종료된다 */
     
const gpio = require ('pigpio').Gpio ;
const rled = new gpio (20 , {mode :gpio .OUTPUT });
const bled = new gpio (16 , {mode :gpio .OUTPUT });
const gled = new gpio (12 , {mode :gpio .OUTPUT });
const buzzer = new gpio (26 , {mode :gpio .OUTPUT });
const button = new gpio (21 , {
   mode :gpio .INPUT ,
   pullUpDown :gpio .PUD_UP ,
   edge :gpio .FALLING_EDGE
} );

var count = 0 ;
// 채터링문제 해결(Debouncing), 10ms 동안 안정화후 인터럽트 발생
button .glitchFilter (10000 );

const buzzerOff = function () {
     buzzer .digitalWrite (0 );
}

const Handler = (level , tick ) => {
if (level === 0 ) {
       buzzer .digitalWrite (1 );
       setTimeout (buzzerOff , 100 );
     if ((count %3 ) == 0 ){
       rled .digitalWrite (1);
       bled .digitalWrite (0);
       gled .digitalWrite (0);
}
     else if ((count %3 ) ==1 ){
       rled .digitalWrite (0);
       bled .digitalWrite (1);
       gled .digitalWrite (0);
}
     else if ((count %3 ) ==2 ){
       rled .digitalWrite (0);
       bled .digitalWrite (0);
       gled .digitalWrite (1);}
     console .log (++count +'Button down' +tick );
}

else {
     buzzer .digitalWrite (0);
     rled .digitalWrite (0);
     bled .digitalWrite (0);
     gled .digitalWrite (0);
} 
setTimeout (Handler , 200000 );
}

button .on ('interrupt', Handler );

process .on ('SIGINT', function () {
   rled .digitalWrite (0);
   bled .digitalWrite (0);
   gled .digitalWrite (0);
   buzzer .digitalWrite (0);
   console .log (" 프로그램이 종료됩니다….");
   process .exit ();
});
