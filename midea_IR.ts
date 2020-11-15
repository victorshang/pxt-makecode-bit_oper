enum mode_code {
    Auto_mode = 2,
    Cold_mode = 0, 
    Heat_mode = 3, 
    Dehum_mode = 1,     
    Wind_mode = 1,
}

enum wind_code {
    Auto_wind = 5,  
    Low_wind = 4, 
    Mid_wind = 2, 
    High_wind = 1, 
    Fixed_wind = 0
}

enum tmp_code {
    Tmp_17=0,
    Tmp_18=1,
    Tmp_19=3,
    Tmp_20=2,
    Tmp_21=6,
    Tmp_22=7,
    Tmp_23=5,
    Tmp_24=4,
    Tmp_25=12,
    Tmp_26=13,
    Tmp_27=9,
    Tmp_28=8,
    Tmp_29=10,
    Tmp_30=11,
    Tmp_undefine=14,
}
enum minute_code{
    minute_00=0,
    minute_30=2
}
enum hour_code {
    hour_1=3,
    hour_2=7,
    hour_3=11,
    hour_4=15,
    hour_5=19,
    hour_6=23,
    hour_7=27,
    hour_8=31,
    hour_9=35,
    hour_10=39,
    hour_11=43,
    hour_12=47,
    hour_13=51,
    hour_14=55,
    hour_15=59,
    hour_16=63,
    hour_17=67,
    hour_18=71,
    hour_19=75,
    hour_20=79,
    hour_21=83,
    hour_22=87,
    hour_23=91,
    hour_24=95,
}

let A_code= 178

namespace midea_ir{   
    /**
    * 返回定时开机码
    */
    //% block="开机码 %hour小时%minute分钟后,模式:%mode=Cold_mode,温度:%tmp,风量:%wind=High_wind"
    export function getTimeingOpenCode(hour:hour_code=hour_code.hour_1,minute:minute_code=minute_code.minute_30,mode:mode_code=mode_code.Heat_mode, tmp:tmp_code=tmp_code.Tmp_24, wind:wind_code=wind_code.High_wind):Array<number>{
        let result =[0b1011001001001101,0,0]
        let codeB=getOpenCodeB(wind) 
        let codeC=getOpenCodeC(tmp, mode)
        result[1]=((codeB * 256) & 0xff00) + (bitoperation.getInverse(codeB) & 0x00ff)
        if(mode==mode_code.Cold_mode){
            result[2]=((codeC * 256) & 0xff00) + ((hour+minute+0x80) & 0x00ff)
        }else{
            result[2]=((codeC * 256) & 0xff00) + ((hour+minute) & 0x00ff)
        }
        return result
    }

    /**
    * 返回取消定时
    */
    //% block="取消定时码"
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
    //% block="开机码，模式:%mode=Cold_mode,温度:%tmp,风量:%wind=High_wind"
    export function getOpenCode(mode:mode_code=mode_code.Heat_mode, tmp:tmp_code=tmp_code.Tmp_24, wind:wind_code=wind_code.High_wind):Array<number>{
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
