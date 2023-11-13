
namespace oled {
    let nOLEDArrays_8x8: oledarrays_8x8 = null // nur eine Instanz für mehrere Displays
    let nOLEDArrays_5x5: oledarrays_5x5 = null

    //% blockId=oled_new_oledarrays_5x5 block="aus Arrays 5x5" blockHidden=true
    export function new_oledarrays_5x5(): oledarrays_5x5 {
        if (nOLEDArrays_5x5 == null) {
            basic.showString("5")
            nOLEDArrays_5x5 = new oledarrays_5x5()
        }
        return nOLEDArrays_5x5
    }

    //% blockId=oled_new_oledarrays_8x8 block="aus Arrays 8x8" blockHidden=true
    export function new_oledarrays_8x8(): oledarrays_8x8 {
        if (nOLEDArrays_8x8 == null) {
            basic.showString("8")
            nOLEDArrays_8x8 = new oledarrays_8x8()
        }
        if (nOLEDArrays_8x8 == undefined) {
            basic.showString("u")
            //nOLEDArrays_8x8 = new oledarrays_8x8()
        }
        return nOLEDArrays_8x8
    }



    // ========== class oledarrays_5x5 ==========

    export class oledarrays_5x5 {
        private readonly x00: number // gleiche number für alle Steuerzeichen 00-31 0x00-0x1F
        private readonly x20: number[] // 32 number-Elemente je 32 Bit
        private readonly x40: number[]
        private readonly x60: number[]

        getPixel(inputString: string, screenBuf: Buffer, off: number) {
            let y = 0 // Zeile (page) auf Display 0-7
            let x = 0 // ist hier immer 0
            let col = 0
            let number32bit = 0
            let ind = 0
            for (let charindexOfString = 0; charindexOfString < inputString.length; charindexOfString++) {
                //charDisplayBytes = font[inputString.charCodeAt(charOfString)]
                number32bit = this.getFont(inputString.charCodeAt(charindexOfString))
                for (let i = 0; i < 5; i++) {  //for loop will take byte font array and load it into the correct register, the shift to the next byte to load into the next location
                    col = 0
                    for (let j = 0; j < 5; j++) {
                        if (number32bit & (1 << (5 * i + j)))
                            col |= (1 << (j + 1))
                    }

                    ind = (x + charindexOfString) * 5 + y * 128 + i + 1
                    screenBuf[off + ind] = col
                }
            }
        }

        getFont(pCharCode: number) {
            let number32bit: number = this.x00
            if (between(pCharCode, 0x20, 0x7F))
                switch (pCharCode & 0b11100000) { // 32 number-Elemente = 5 Bit
                    case 0x20: number32bit = this.x20.get(pCharCode & 0b00011111); break
                    case 0x40: number32bit = this.x40.get(pCharCode & 0b00011111); break
                    case 0x60: number32bit = this.x60.get(pCharCode & 0b00011111); break
                    //default: number32bit = this.x00; break
                }
            //else
            //    number32bit = this.x00
            return number32bit
        }

        constructor() {
            this.x00 = 0x0022d422 // 00-31 0x00-0x1F
            this.x20 = [ // 32-63 x20-x3F
                0x00000000, 0x000002e0, 0x00018060, 0x00afabea, 0x00aed6ea, 0x01991133, 0x010556aa, 0x00000060,
                0x000045c0, 0x00003a20, 0x00051140, 0x00023880, 0x00002200, 0x00021080, 0x00000100, 0x00111110,
                0x0007462e, 0x00087e40, 0x000956b9, 0x0005d629, 0x008fa54c, 0x009ad6b7, 0x008ada88, 0x00119531,
                0x00aad6aa, 0x0022b6a2, 0x00000140, 0x00002a00, 0x0008a880, 0x00052940, 0x00022a20, 0x0022d422
            ]
            this.x40 = [ // 64-95 x40-x5F
                0x00e4d62e, 0x000f14be, 0x000556bf, 0x0008c62e, 0x0007463f, 0x0008d6bf, 0x000094bf, 0x00cac62e,
                0x000f909f, 0x000047f1, 0x0017c629, 0x0008a89f, 0x0008421f, 0x01f1105f, 0x01f4105f, 0x0007462e,
                0x000114bf, 0x000b6526, 0x010514bf, 0x0004d6b2, 0x0010fc21, 0x0007c20f, 0x00744107, 0x01f4111f,
                0x000d909b, 0x00117041, 0x0008ceb9, 0x0008c7e0, 0x01041041, 0x000fc620, 0x00010440, 0x01084210
            ]
            this.x60 = [ // 96-127 x60-x7F
                0x00000820, 0x010f4a4c, 0x0004529f, 0x00094a4c, 0x000fd288, 0x000956ae, 0x000097c4, 0x0007d6a2,
                0x000c109f, 0x000003a0, 0x0006c200, 0x0008289f, 0x000841e0, 0x01e1105e, 0x000e085e, 0x00064a4c,
                0x0002295e, 0x000f2944, 0x0001085c, 0x00012a90, 0x010a51e0, 0x010f420e, 0x00644106, 0x01e8221e,
                0x00093192, 0x00222292, 0x00095b52, 0x0008fc80, 0x000003e0, 0x000013f1, 0x00841080, 0x0022d422
            ]
        } // constructor
    } // class oledarrays_5x5





    // ========== class oledarrays_8x8 ==========

    export class oledarrays_8x8 {
        private readonly x20: string[]
        private readonly x30: string[]
        private readonly x40: string[]
        private readonly x50: string[]
        private readonly x60: string[]
        private readonly x70: string[]
        private readonly x80: string[]


        getPixel_8x8(pCharCode: number): Buffer {
            let s8: string
            if (between(pCharCode, 0x20, 0x7F))
                switch (pCharCode & 0xF0) { // 16 string-Elemente je 8 Byte = 128
                    case 0x20: s8 = this.x20.get(pCharCode & 0x0F); break
                    case 0x30: s8 = this.x30.get(pCharCode & 0x0F); break
                    case 0x40: s8 = this.x40.get(pCharCode & 0x0F); break
                    case 0x50: s8 = this.x50.get(pCharCode & 0x0F); break
                    case 0x60: s8 = this.x60.get(pCharCode & 0x0F); break
                    case 0x70: s8 = this.x70.get(pCharCode & 0x0F); break
                    default: s8 = this.x70.get(15); break
                }
            else
                switch (pCharCode) {
                    case "Ä".charCodeAt(0) & 0xFF: s8 = this.x80.get(0); break
                    case "Ö".charCodeAt(0) & 0xFF: s8 = this.x80.get(1); break
                    case "Ü".charCodeAt(0) & 0xFF: s8 = this.x80.get(2); break
                    case "ä".charCodeAt(0) & 0xFF: s8 = this.x80.get(3); break
                    case "ö".charCodeAt(0) & 0xFF: s8 = this.x80.get(4); break
                    case "ü".charCodeAt(0) & 0xFF: s8 = this.x80.get(5); break
                    case "ß".charCodeAt(0) & 0xFF: s8 = this.x80.get(6); break
                    case "€".charCodeAt(0) & 0xFF: s8 = this.x80.get(7); break
                    case "°".charCodeAt(0) & 0xFF: s8 = this.x80.get(8); break
                    default: s8 = this.x70.get(15); break
                }
            return Buffer.fromUTF8(s8)
        }

        constructor() {

            this.x20 = [
                "\x00\x00\x00\x00\x00\x00\x00\x00", // " "
                "\x00\x00\x5F\x00\x00\x00\x00\x00", // "!"
                "\x00\x00\x07\x00\x07\x00\x00\x00", // """
                "\x00\x14\x7F\x14\x7F\x14\x00\x00", // "#"
                "\x00\x24\x2A\x7F\x2A\x12\x00\x00", // "$"
                "\x00\x23\x13\x08\x64\x62\x00\x00", // "%"
                "\x00\x36\x49\x55\x22\x50\x00\x00", // "&"
                "\x00\x00\x05\x03\x00\x00\x00\x00", // "'"
                "\x00\x1C\x22\x41\x00\x00\x00\x00", // "("
                "\x00\x41\x22\x1C\x00\x00\x00\x00", // ")"
                "\x00\x08\x2A\x1C\x2A\x08\x00\x00", // "*"
                "\x00\x08\x08\x3E\x08\x08\x00\x00", // "+"
                "\x00\xA0\x60\x00\x00\x00\x00\x00", // ","
                "\x00\x08\x08\x08\x08\x08\x00\x00", // "-"
                "\x00\x60\x60\x00\x00\x00\x00\x00", // "."
                "\x00\x20\x10\x08\x04\x02\x00\x00" // "/"
            ]
            this.x30 = [
                "\x00\x3E\x51\x49\x45\x3E\x00\x00", // "0"
                "\x00\x00\x42\x7F\x40\x00\x00\x00", // "1"
                "\x00\x62\x51\x49\x49\x46\x00\x00", // "2"
                "\x00\x22\x41\x49\x49\x36\x00\x00", // "3"
                "\x00\x18\x14\x12\x7F\x10\x00\x00", // "4"
                "\x00\x27\x45\x45\x45\x39\x00\x00", // "5"
                "\x00\x3C\x4A\x49\x49\x30\x00\x00", // "6"
                "\x00\x01\x71\x09\x05\x03\x00\x00", // "7"
                "\x00\x36\x49\x49\x49\x36\x00\x00", // "8"
                "\x00\x06\x49\x49\x29\x1E\x00\x00", // "9"
                "\x00\x00\x36\x36\x00\x00\x00\x00", // ":"
                "\x00\x00\xAC\x6C\x00\x00\x00\x00", // ";"
                "\x00\x08\x14\x22\x41\x00\x00\x00", // "<"
                "\x00\x14\x14\x14\x14\x14\x00\x00", // "="
                "\x00\x41\x22\x14\x08\x00\x00\x00", // ">"
                "\x00\x02\x01\x51\x09\x06\x00\x00" // "?"
            ]
            this.x40 = [
                "\x00\x32\x49\x79\x41\x3E\x00\x00", // "@""
                "\x00\x7E\x09\x09\x09\x7E\x00\x00", // "A"
                "\x00\x7F\x49\x49\x49\x36\x00\x00", // "B"
                "\x00\x3E\x41\x41\x41\x22\x00\x00", // "C"
                "\x00\x7F\x41\x41\x22\x1C\x00\x00", // "D"
                "\x00\x7F\x49\x49\x49\x41\x00\x00", // "E"
                "\x00\x7F\x09\x09\x09\x01\x00\x00", // "F"
                "\x00\x3E\x41\x41\x51\x72\x00\x00", // "G"
                "\x00\x7F\x08\x08\x08\x7F\x00\x00", // "H"
                "\x00\x41\x7F\x41\x00\x00\x00\x00", // "I"
                "\x00\x20\x40\x41\x3F\x01\x00\x00", // "J"
                "\x00\x7F\x08\x14\x22\x41\x00\x00", // "K"
                "\x00\x7F\x40\x40\x40\x40\x00\x00", // "L"
                "\x00\x7F\x02\x0C\x02\x7F\x00\x00", // "M"
                "\x00\x7F\x04\x08\x10\x7F\x00\x00", // "N"
                "\x00\x3E\x41\x41\x41\x3E\x00\x00" // "O"
            ]
            this.x50 = [
                "\x00\x7F\x09\x09\x09\x06\x00\x00", // "P"
                "\x00\x3E\x41\x51\x21\x5E\x00\x00", // "Q"
                "\x00\x7F\x09\x19\x29\x46\x00\x00", // "R"
                "\x00\x26\x49\x49\x49\x32\x00\x00", // "S"
                "\x00\x01\x01\x7F\x01\x01\x00\x00", // "T"
                "\x00\x3F\x40\x40\x40\x3F\x00\x00", // "U"
                "\x00\x1F\x20\x40\x20\x1F\x00\x00", // "V"
                "\x00\x3F\x40\x38\x40\x3F\x00\x00", // "W"
                "\x00\x63\x14\x08\x14\x63\x00\x00", // "X"
                "\x00\x03\x04\x78\x04\x03\x00\x00", // "Y"
                "\x00\x61\x51\x49\x45\x43\x00\x00", // "Z"
                "\x00\x7F\x41\x41\x00\x00\x00\x00", // """
                "\x00\x02\x04\x08\x10\x20\x00\x00", // "\"
                "\x00\x41\x41\x7F\x00\x00\x00\x00", // """
                "\x00\x04\x02\x01\x02\x04\x00\x00", // "^"
                "\x00\x80\x80\x80\x80\x80\x00\x00" // "_"
            ]
            this.x60 = [
                "\x00\x01\x02\x04\x00\x00\x00\x00", // "`"
                "\x00\x20\x54\x54\x54\x78\x00\x00", // "a"
                "\x00\x7F\x48\x44\x44\x38\x00\x00", // "b"
                "\x00\x38\x44\x44\x28\x00\x00\x00", // "c"
                "\x00\x38\x44\x44\x48\x7F\x00\x00", // "d"
                "\x00\x38\x54\x54\x54\x18\x00\x00", // "e"
                "\x00\x08\x7E\x09\x02\x00\x00\x00", // "f"
                "\x00\x18\xA4\xA4\xA4\x7C\x00\x00", // "g"
                "\x00\x7F\x08\x04\x04\x78\x00\x00", // "h"
                "\x00\x00\x7D\x00\x00\x00\x00\x00", // "i"
                "\x00\x80\x84\x7D\x00\x00\x00\x00", // "j"
                "\x00\x7F\x10\x28\x44\x00\x00\x00", // "k"
                "\x00\x41\x7F\x40\x00\x00\x00\x00", // "l"
                "\x00\x7C\x04\x18\x04\x78\x00\x00", // "m"
                "\x00\x7C\x08\x04\x7C\x00\x00\x00", // "n"
                "\x00\x38\x44\x44\x38\x00\x00\x00" // "o"
            ]
            this.x70 = [
                "\x00\xFC\x24\x24\x18\x00\x00\x00", // "p"
                "\x00\x18\x24\x24\xFC\x00\x00\x00", // "q"
                "\x00\x00\x7C\x08\x04\x00\x00\x00", // "r"
                "\x00\x48\x54\x54\x24\x00\x00\x00", // "s"
                "\x00\x04\x7F\x44\x00\x00\x00\x00", // "t"
                "\x00\x3C\x40\x40\x7C\x00\x00\x00", // "u"
                "\x00\x1C\x20\x40\x20\x1C\x00\x00", // "v"
                "\x00\x3C\x40\x30\x40\x3C\x00\x00", // "w"
                "\x00\x44\x28\x10\x28\x44\x00\x00", // "x"
                "\x00\x1C\xA0\xA0\x7C\x00\x00\x00", // "y"
                "\x00\x44\x64\x54\x4C\x44\x00\x00", // "z"
                "\x00\x08\x36\x41\x00\x00\x00\x00", // "{"
                "\x00\x00\x7F\x00\x00\x00\x00\x00", // "|"
                "\x00\x41\x36\x08\x00\x00\x00\x00", // "}"
                "\x00\x02\x01\x01\x02\x01\x00\x00", // "~"
                "\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF"  // 127
            ]
            this.x80 = [
                "\x00\x7D\x0A\x09\x0A\x7D\x00\x00", // "Ä"
                "\x00\x3D\x42\x41\x42\x3D\x00\x00", // "Ö"
                "\x00\x3D\x40\x40\x40\x3D\x00\x00", // "Ü"
                "\x00\x21\x54\x54\x55\x78\x00\x00", // "ä"
                "\x00\x39\x44\x44\x39\x00\x00\x00", // "ö"
                "\x00\x3D\x40\x40\x7D\x00\x00\x00", // "ü"
                "\x00\xFE\x09\x49\x36\x00\x00\x00", // "ß"
                "\x00\x14\x3E\x55\x55\x55\x14\x00", // "€"
                "\x00\x02\x05\x02\x00\x00\x00\x00"  // "°"
            ]
        } // constructor
    } // class oledarrays_8x8
} // oledarrays.ts