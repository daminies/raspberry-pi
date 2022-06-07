/*
 실습1) 미확인물체를 탐지하고, 시청각경보를 알려주는 보안시스템을 만들고자 한다. 
        아래와 같은 조건에 부합되도록 securitySystem.js  을 작성하시요.
    조건1) 버튼을 클릭하면 보안시스템이 가동한다.
    조건2) 가동되면 초음파센서가 150ms 주기로 미확인물체를 탐지한다. 
    조건3)  다음 근접거리에 탐지되면 경보를 발동한다.
           5cm 이하에서 탐지: 빨강LED매우 밝게
           6cm ~ 10cm  탐지: 빨강LED밝게
           11cm ~ 20cm 탐지: 빨강LED 어둡게
           21cm 이상에서 탐지: LED꺼짐
    조건4) 조건3에서 10cm 이하 탐지될때만 릴레이 스위치를 ON시켜 부져소리가 나도록 한다.
            11cm 이상에서는 릴레이스위치가 OFF되어 부져소리가 중단된다. 
    조건5) 터치센서를 터치하면 부져소리 기능이 비활성화된다 (즉 릴레이가 OFF)
    조건6) 버튼을 한번 더 클릭하면 보안시스템이 중단된다. 
    조건7) 무한반복 실행되며, ^c를 누르면 모든 LED,부져가 모두 꺼진후 프로그램이 종료된다.
*/

const gpio = require('pigpio').Gpio;
const led= new gpio(21,{mode:gpio.OUTPUT});
const trig = new gpio(20,{mode:gpio.OUTPUT});
const echo = new gpio(16,{mode:gpio.INPUT,alert:true});
const button = new gpio(6, {mode:gpio.INPUT});
const buzzer = new gpio(13, {mode:gpio.OUPuT});
const touch = new gpio(25, {mode:gpio.INPUT});
const TurnOn = () =>{relay.digitalWrite(1);}
const TurnOff = ()=>{relay.digitalWrite(0);}



trig.digitalWrite(0);

const Triggering = () => {
        let startTick, distance, diff;
        //라즈베리파이로 echo신호 보내는 형태
        echo.on('alert',(level,tick) =>{
                if(level == 1){startTick = tick;}
                else{
                        const endTick = tick;
                        diff = endTick - startTick;
                        distance = diff/58;
                        if(distance<400){
                                console.log('근접거리:%i cm', distance);
                                PWMled(distance);
                                if(distance <= 10){
                                        buzzer.digitalWrite(1);
                                        let sense = touch.digitalRead();
                                        if(sense){
                                             buzzer.digitalWrite(0)};
                                }
                                else{
                                        buzzer.digitalWrite(0);
                                }
                        }
                }
        })
}

const PWMled = (dis) =>{
        if(dis <=5)
        led.pwmWrite(255);
        else if(dis>5 && dis <= 10)  led.pwmWrite(100);
        else if(dis>10 && dis <=20)  led.pwmWrite(5);
        else led.pwmWrite(0);
}

 
var count = 1;

const ButtonCheck = () =>{
        let data = button.digitalRead();
        if(!data){
                console.log("pressed" + count);
                if(count== 1){
                        Triggering();
                        let setInt = setInterval(()=>{trig.trigger(10,1);}, 150);
                        count++;
                }
                else{
                        console.log("종료");
                        led.digitalWrite(0);
                        clearInterval(setInt);
                }
        }
        setTimeout(ButtonCheck,200);
}

process.on('SIGNT',() =>{
        led.digitalWrite(0);
        console.log("프로그램종료");
        process.exit();
});


setImmediate(ButtonCheck);

