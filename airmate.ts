/**
 * MakeCode extension for Airmate Fans
 * update: 2020-11-17
 * version:1.00
 */
enum fan_code {
    OnOff=0x907E,
    Plus=0x903C,
    Minus=0x9039,
    UpDown=0x905F,
    LeftRight=0x906F,
    BabyWind=0x9033,
    Timing=0x9077,
}

//% color=#32c853 icon="\u2741" block="Airmate"
namespace airmate_ir{   
    let waitCorrection=0;
    let irsend_Pin=AnalogPin.P1;
    // 识别码
    let L_MARK = 2500
    let L_MARK_SPACE = 3200;
    // 分隔码
    let S_MARK = 450;
    let S_MARK_SPACE = 6800;
    // 逻辑数字 1
    let ONE_MARK = 450;
    let ONE_SPACE = 1220;
    // 逻辑数字 0
    let ZERO_MARK = 1220;
    let ZERO_SPACE = 450;
    
    /**
    * 初始化IR
    */
    //% block="初始化IR发射器引脚:%ir_pin=AnalogPin"
    export function initIR(ir_pin:AnalogPin):void
     // Measure the time we need for a minimal bit (analogWritePin and waitMicros)
      {
        irsend_Pin=ir_pin;
        pins.analogWritePin(irsend_Pin, 0);
        pins.analogSetPeriod(irsend_Pin, 26.315);
        let runs = 32; 
        let start = input.runningTimeMicros();
        for (let i = 0; i < runs; i++) {
          transmitBit(1, 1);
        }
        let end = input.runningTimeMicros();
        waitCorrection = Math.idiv(end - start - runs * 2, runs * 2);
        //basic.showNumber(waitCorrection);
        L_MARK -= waitCorrection;
        L_MARK_SPACE -= waitCorrection;
        S_MARK -= waitCorrection;
        S_MARK_SPACE -= waitCorrection;
        ONE_MARK -= waitCorrection;
        ONE_SPACE -= waitCorrection;
        ZERO_MARK -= waitCorrection;
        ZERO_SPACE -= waitCorrection;    
      }
    
    function transmitBit(highMicros: number, lowMicros: number): void {
      pins.analogWritePin(irsend_Pin, 341);//占空比
      control.waitMicros(highMicros);
      pins.analogWritePin(irsend_Pin, 0);
      control.waitMicros(lowMicros);
    }

    /**
    * L码
    */
    function LCode(){
       transmitBit(L_MARK, L_MARK_SPACE);
    }
    /**
    * S码
    */
    function SCode(){
        transmitBit(S_MARK, S_MARK_SPACE);
    }
    /**
    * E码
    */
    function EndCode(){
         transmitBit(ONE_MARK, 2000);
    }
    /**
    * 0
    */
    function ZERO() {
        transmitBit(ZERO_MARK, ZERO_SPACE);
    }
    /**
    * 1
    */
    function ONE() {
        transmitBit(ONE_MARK, ONE_SPACE);
    }

     /**
    * 发送数据码
    * 发送格式为： L码+数据码+S码+L码+数据码+S码+L码+数据码+S码
    */
    //% block="发送数据:%data_str"
    export function sendCode(data:fan_code){
        let len = 16
        for(let j=0;j<3;j++){
            LCode()
            let mask=0x8000
            for(let i=0;i<len;i++){
                if (( data & mask)==0){
                    ZERO()
                }else{
                    ONE()
                }
                mask=mask >> 1
            }
            SCode()
        }
    }
}
