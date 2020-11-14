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

let A_code= 178

namespace midea_ir{   

    /**
    * 返回开机码
    */
    //% block="开机码，模式：%mode=Cold_mode 温度:%tmp=Tmp_24 风量:%wind=High_wind"
    export function getOpenCode(mode:mode_code, tmp:tmp_code, wind:wind_code):string{
        let result="1011001001001101"
        let codeB=getOpenCodeB(wind)
        let codeC=getOpenCodeC(tmp, mode)
        for(let i = 7; i >= 0; i--) {
            result +=  convertToText(bitoperation.getBit(codeB, i))
        }      
        for(let i = 7; i >= 0; i--){
            result+=convertToText(bitoperation.getBit(bitoperation.getInverse(codeB), i))
        }
        for(let i = 7; i >= 0; i--){
            result+=convertToText(bitoperation.getBit(codeC, i))
        }
        for(let i = 7; i >= 0; i--){
            result+=convertToText(bitoperation.getBit(bitoperation.getInverse(codeC), i))
        }
        return result
        
    }


    /**
    * 返回A码
    */
    //% block="A码"
    export function getOpenCodeA():number{
        return A_code
    }

    /**
    * 返回B码
    */
    //% block="B码:%win"
    export function getOpenCodeB(win:wind_code):number{
        return (win << 5) | 0x1F
    }

    /**
    * 返回C码
    */
    //% block="C码:%tmp,%mode"
    export function getOpenCodeC(tmp:tmp_code,mode:mode_code):number{
        return (tmp << 4) | (mode << 2)
    }
}