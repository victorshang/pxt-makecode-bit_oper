enum mode_code {
    Auto = 2,
    Cold = 0, 
    Heat = 3, 
    Dehum = 1,     
    Wind = 1,
}

enum wind_code {
    Auto = 5,  
    Low = 4, 
    Mid = 2, 
    High = 1, 
    Fixed = 0
}

enum tmp_code {
    T17=0,
    T18=1,
    T19=3,
    T20=2,
    T21=6,
    T22=7,
    T23=5,
    T24=4,
    T25=12,
    T26=13,
    T27=9,
    T28=8,
    T29=10,
    T30=11,
    Tundef=14,
}
enum minute_code{
    m_00=0,
    m_30=2
}
enum hour_code {
    h_1=3,
    h_2=7,
    h_3=11,
    h_4=15,
    h_5=19,
    h_6=23,
    h_7=27,
    h_8=31,
    h_9=35,
    h_10=39,
    h_11=43,
    h_12=47,
    h_13=51,
    h_14=55,
    h_15=59,
    h_16=63,
    h_17=67,
    h_18=71,
    h_19=75,
    h_20=79,
    h_21=83,
    h_22=87,
    h_23=91,
    h_24=95,
}
let A_code= 178

namespace midea_ir{   
    /**
    * 返回定时开机码
    */
    //% block="%hour小时%minute分钟后开,模式:%mode=Cold_mode,温度:%tmp,风量:%wind=High_wind"
    export function getTimeingOpenCode(hour:hour_code,minute:minute_code,mode:mode_code,tmp:tmp_code, wind:wind_code):Array<number>{
        let result =[0b1011001001001101,0,0]
        let codeB=getOpenCodeB(wind) 
        let codeC=getOpenCodeC(tmp, mode)
        result[1]=((codeB * 256) & 0xff00) + (bitoperation.getInverse(codeB) & 0x00ff)
        if(mode==mode_code.Cold){
            result[2]=((codeC * 256) & 0xff00) + ((hour+minute+0x80) & 0x00ff)
        }else{
            result[2]=((codeC * 256) & 0xff00) + ((hour+minute) & 0x00ff)
        }
        return result
    }
    /**
    * 返回定时关机码
    */
    //% block="%hour小时%minute分钟后关,模式:%mode=Cold_mode,温度:%tmp,风量:%wind=High_wind"
    export function getTimeingCloseCode(hour:hour_code,minute:minute_code,mode:mode_code,tmp:tmp_code, wind:wind_code):Array<number>{
        let result =[0b1011001001001101,0,0]
        let codeB=(getOpenCodeB(wind) & 0x00e0) | ((hour+minute) & 0x001f)
        let codeC=getOpenCodeC(tmp, mode) & 0x00fc | (((hour+minute)>> 5) & 0x0003)
        result[1]=((codeB * 256) & 0xff00) + (bitoperation.getInverse(codeB) & 0x00ff)
        result[2]=((codeC * 256) & 0xff00) + 0x00ff
        return result
    }
    /**
    * 返回取消定时开机
    */
    //% block="取消定时开机码"
    export function getCancleCode():Array<number>{
        let result =[0b1011001001001101,0b0111101110000100,0b1110000000011111]
        return result
    }
    /**
    * 返回关机码
    */
    //% block="关机码"
    export function getCloseCode():Array<number>{
        let result =[0b1011001001001101,0b0111101110000100,0b1110000000011111]
        return result
    }
    /**
    * 返回开机码数据码
    * 开机码数据码式为： A码+A码反码+B码+B码反码+C码+C码反码
    */
    //% block="模式:%mode=Cold_mode,温度:%tmp,风量:%wind=High_wind"
    export function getOpenCode(mode:mode_code=mode_code.Heat, tmp:tmp_code=tmp_code.T24, wind:wind_code=wind_code.High):Array<number>{
        let result =[0b1011001001001101,0,0]
        let codeB=getOpenCodeB(wind)
        let codeC=getOpenCodeC(tmp, mode)
        result[1]=((codeB * 256) & 0xff00) + (bitoperation.getInverse(codeB) & 0x00ff)
        result[2]=((codeC * 256) & 0xff00) + (bitoperation.getInverse(codeC) & 0x00ff)
        return result   
    }


    /**
    * 返回A码
    */
    //% block="A码"
    function getOpenCodeA():number{
        return A_code
    }

    /**
    * 返回B码
    */
    //% block="B码:%win"
    function getOpenCodeB(win:wind_code):number{
        return (win << 5) | 0x1F
    }

    /**
    * 返回C码
    */
    //% block="C码:%tmp,%mode"
    function getOpenCodeC(tmp:tmp_code,mode:mode_code):number{
        return (tmp << 4) | (mode << 2)
    }
    let irPin = DigitalPin.P1

    /**
    * 设置IR发射器引脚
    */
    //% block="IR发射器引脚:%ir_pin=DigitalPin"
    export function setIrPin(ir_pin:DigitalPin){
        irPin = ir_pin
    }

    function ledOn (d: number) {
        while (d > 32) {
            pins.digitalWritePin(irPin, 1)
            control.waitMicros(2)
            pins.digitalWritePin(irPin, 0)
            d = d - 32
        }
    }
    function ledOff (d: number) {
       control.waitMicros(d)
    }
    /**
    * L码
    */
    function LCode(){
        ledOn(4500)
        ledOff(4500)
    }
    /**
    * S码
    */
    function SCode(){
        ledOn(544)
        ledOff(5220)
    }
    /**
    * E码
    */
    function EndCode(){
        ledOn(544)
    }
    /**
    * 0
    */
    function ZERO() {
        ledOn(544)
        ledOff(544)
    }
    /**
    * 1
    */
    function ONE() {
        ledOn(544)
        ledOff(1587)
    }

     /**
    * 发送数据码
    * 发送格式为： L码+数据码+S码+L码+数据码+E码
    */
    //% block="发送数据:%data_str"
    export function sendCode(data_arr:Array<number>){
        let len = 16
        let codeA=data_arr[0]
        let codeB=data_arr[1]
        let codeC=data_arr[2]
        LCode()
        let mask=0x8000
        for(let j=0;j<3;j++){
            mask=0x8000
            let data=data_arr[j]
            for(let i=0;i<len;i++){
                if (( data & mask)==0){
                    ZERO()
                }else{
                    ONE()
                }
                mask=mask >> 1
            }
        }
        SCode()
        LCode()
        mask=0x8000
        for(let i=0;i<len;i++){
            if ((codeA & mask)==0){
                ZERO()
            }else{
                ONE()
            }
            mask=mask >> 1
        }
        mask=0x8000
        for(let i=0;i<len;i++){
            if ((codeB & mask)==0){
                ZERO()
            }else{
                ONE()
            }
            mask=mask >> 1
        }
        mask=0x8000
        for(let i=0;i<len;i++){
            if ((codeC & mask)==0){
                ZERO()
            }else{
                ONE()
            }
            mask=mask >> 1
        }
        EndCode()
    }
}
