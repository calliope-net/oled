
namespace oled {

    //% blockId=oled_new_oledarrays_5x5 block="aus Arrays" blockHidden=true
    export function new_oledarrays_5x5(): oledarrays_5x5 {
        return new oledarrays_5x5()
    }

    //% blockId=oled_new_oledarrays_8x8 block="aus Arrays" blockHidden=true
    export function new_oledarrays_8x8(): oledarrays_8x8 {
        return new oledarrays_8x8()
    }


    export class oledarrays_5x5 {

    }


    export class oledarrays_8x8 {
        private readonly x20: string[]
        private readonly x30: string[]
        private readonly x40: string[]
        private readonly x50: string[]
        private readonly x60: string[]
        private readonly x70: string[]
        private readonly x80: string[]


        getPixel8ByteArray(pCharCode: number): Buffer {
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
    }
} // oledarrays.ts