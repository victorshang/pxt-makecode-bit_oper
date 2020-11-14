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
    tmp_17=0,
    tmp_18=1,
    tmp_19=3,
    tmp_20=2,
    tmp_21=6,
    tmp_22=7,
    tmp_23=5,
    tmp_24=4,
    tmp_25=12,
    tmp_26=13,
    tmp_27=9,
    tmp_28=8,
    tmp_29=10,
    tmp_30=11,
    tmp_undef=14,
}

let A_code= 178

namespace midea_ir{   
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