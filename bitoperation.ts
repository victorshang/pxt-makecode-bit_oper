/**
 * MakeCode extension for bit game.gameOver() 
 * update: 2020-11-17
 * version:1.00
 */
//% color=#972145 icon="\u2702" block="BitOper"

namespace bitoperation {
    /**
    * 返回data中index位的数据（1或0）
    */
    //% block="获取%data中第%index位的数值"
    export function getBit(data:number ,index:number):number {
        index= (1 << index)
        if ((data & index) > 0){
            return 1
        }else{
            return 0
        }
    }

    /**
    * 返回data的反码
    */
    //% block="返回%data的反码数值"
    export function getInverse(data:number):number {
        return ~ data
    }
}