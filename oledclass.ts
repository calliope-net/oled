
//% color=#0000BF icon="\uf108" block="OLED Display" weight=20
namespace oled
/* 230908 231103 https://github.com/calliope-net/oled-16x8

Grove - OLED Yellow&Blue Display 0.96(SSD1315)
https://wiki.seeedstudio.com/Grove-OLED-Yellow&Blue-Display-0.96-SSD1315_V1.0/

SparkFun Qwiic EEPROM Breakout - 512Kbit
https://www.sparkfun.com/products/18355

initdisplaycodes from https://gist.githubusercontent.com/pulsar256/564fda3b9e8fc6b06b89/raw/4bb559d4088e42f7b4859a8533be920434818617/ssd1306_init.c

https://cdn-shop.adafruit.com/datasheets/UG-2864HSWEG01.pdf (Seite 15, 20 im pdf)

OLED Display mit EEPROM neu programmiert von Lutz Elßner im September 2023
Objektvariablen und Zeichensatz aus Arrays von calliope-net/oled-eeprom im November 2023
*/ {

    //% group="OLED Display 0.96 + SparkFun Qwiic EEPROM Breakout - 512Kbit"
    //% block="i2c %pADDR || invert %pInvert flip %pFlip i2c-Check %ck EEPROM: Zeichensatz %pEEPROM_Startadresse i2c %pEEPROM_i2cADDR"
    //% pADDR.shadow="oled_eADDR_OLED"
    //% pInvert.shadow="toggleOnOff"
    //% pFlip.shadow="toggleOnOff"
    //% ck.shadow="toggleOnOff" ck.defl=1
    //% pEEPROM_Startadresse_8x8.shadow="oled_eEEPROM_Startadresse"
    //% pEEPROM_Startadresse_5x5.shadow="oled_eEEPROM_Startadresse"
    //% pEEPROM_Startadresse_5x5.defl=oled.eEEPROM_Startadresse.EC00
    //% pEEPROM_i2cADDR.shadow="oled_eADDR_EEPROM"
    //% inlineInputMode=inline
    //% blockSetVariable=OLED16x8
    export function new_oledclass(pADDR: number, pInvert?: boolean, pFlip?: boolean, ck?: boolean,
        pEEPROM_Startadresse_8x8?: number, pEEPROM_Startadresse_5x5?: number, pEEPROM_i2cADDR?: number): oledclass {

        return new oledclass(pADDR, (pInvert ? true : false), (pFlip ? true : false), (ck ? true : false),
            (pEEPROM_Startadresse_8x8 == undefined ? eEEPROM_Startadresse.F800 : pEEPROM_Startadresse_8x8),
            (pEEPROM_Startadresse_5x5 == undefined ? eEEPROM_Startadresse.EC00 : pEEPROM_Startadresse_5x5),
            (pEEPROM_i2cADDR == undefined ? eADDR_EEPROM.EEPROM_x50 : pEEPROM_i2cADDR))
        // optionaler Parameter kann undefined sein
    }




    // ========== class oledclass

    export class oledclass {
        private readonly i2cADDR_OLED: number
        private readonly i2cADDR_EEPROM: number
        private readonly i2cCheck: boolean // i2c-Check
        private readonly qEEPROM_Startadresse_8x8: number
        private readonly qEEPROM_Startadresse_5x5: number
        private qZeichenDrehen: eZeichenDrehen = eZeichenDrehen.nicht

        private i2cError_OLED: number = 0 // Fehlercode vom letzten WriteBuffer (0 ist kein Fehler)
        private i2cError_EEPROM: number = 0

        constructor(pADDR: number, pInvert: boolean, pFlip: boolean, ck: boolean,
            pEEPROM_Startadresse_8x8: number, pEEPROM_Startadresse_5x5: number, pEEPROM_i2cADDR: number) {

            this.i2cADDR_OLED = pADDR
            this.i2cCheck = ck
            this.qEEPROM_Startadresse_8x8 = pEEPROM_Startadresse_8x8
            this.qEEPROM_Startadresse_5x5 = pEEPROM_Startadresse_5x5
            this.i2cADDR_EEPROM = pEEPROM_i2cADDR
            this.i2cError_OLED = 0 // Reset Fehlercode
            this.i2cError_EEPROM = 0 // Reset Fehlercode

            this.init(pInvert, pFlip)
            this.getPixel8Byte(0x20)  // testet, ob EEPROM angeschlossen ist
        }


        // ========== group="OLED Display 0.96 + SparkFun Qwiic EEPROM Breakout - 512Kbit"

        //% group="OLED Display 0.96 + SparkFun Qwiic EEPROM Breakout - 512Kbit"
        //% block="init %OLED16x8 || invert %pInvert drehen %pFlip" weight=8
        //% pInvert.shadow="toggleOnOff" pInvert.defl=false
        //% pFlip.shadow="toggleOnOff" pFlip.defl=false
        init(pInvert?: boolean, pFlip?: boolean): void {

            // Vcc Generated by Internal DC/DC Circuit
            const vccext = false

            let bu = Buffer.create(23)   // muss Anzahl der folgenden setUint8 entsprechen
            let offset = 0               // Buffer offset (offset++ liest erst den Wert und erhöht ihn dann)

            bu.setUint8(offset++, eCONTROL.x00_xCom) // CONTROL Byte 0x00: folgende Bytes (im selben Buffer) sind alle command und kein CONTROL
            // CONTROL Byte 0x80: ignoriert 2. command-Byte (0xD5) und wertet es als CONTROL
            // CONTROL Byte 0x80: nach jedem command muss (im selben Buffer) wieder ein CONTROL 0x80 vor dem nächsten command kommen
            // CONTROL Byte 0x80: wenn ein CONTROL 0x40 folgt, können (im selben Buffer) auch Display-Daten GDDRAM folgen


            // https://cdn-shop.adafruit.com/datasheets/UG-2864HSWEG01.pdf (Seite 15, 20 im pdf)

            bu.setUint8(offset++, 0xAE)  // Set display OFF

            bu.setUint8(offset++, 0xD5)  // Set Display Clock Divide Ratio / OSC Frequency
            bu.setUint8(offset++, 0x80)  //     default 0x80

            bu.setUint8(offset++, 0xA8)  // Set Multiplex Ratio
            bu.setUint8(offset++, 0x3F)  //     Multiplex Ratio for 128x64 (64-1)

            bu.setUint8(offset++, 0xD3)  // Set Display Offset
            bu.setUint8(offset++, 0x00)  //     Display Offset

            bu.setUint8(offset++, 0x40)  // Set Display Start Line

            bu.setUint8(offset++, 0x8D)  // Set Charge Pump
            //bu.setUint8(offset++, 0x14)  //     Charge Pump (0x10 Disable; 0x14 7,5V; 0x94 8,5V; 0x95 9,0V)
            bu.setUint8(offset++, (vccext ? 0x10 : 0x14))

            //bu.setUint8(offset++, 0xA1)  // Set Segment Re-Map default 0xA0
            bu.setUint8(offset++, (!pFlip ? 0xA1 : 0xA0))

            //bu.setUint8(offset++, 0xC8)  // Set Com Output Scan Direction default 0xC0
            bu.setUint8(offset++, (!pFlip ? 0xC8 : 0xC0))

            bu.setUint8(offset++, 0xDA)  // Set COM Hardware Configuration
            bu.setUint8(offset++, 0x12)  //     COM Hardware Configuration

            bu.setUint8(offset++, 0x81)  // Set Contrast (Helligkeit)
            //bu.setUint8(offset++, 0xCF)  //     Contrast default 0x7F
            bu.setUint8(offset++, (vccext ? 0x9F : 0xCF))

            bu.setUint8(offset++, 0xD9)  // Set Pre-Charge Period
            //bu.setUint8(offset++, 0xF1)  //     Pre-Charge Period (0x22 External, 0xF1 Internal)
            bu.setUint8(offset++, (vccext ? 0x22 : 0xF1))

            bu.setUint8(offset++, 0xDB)  // Set VCOMH Deselect Level
            bu.setUint8(offset++, 0x40)  //     VCOMH Deselect Level default 0x20

            bu.setUint8(offset++, 0xA4)  // Set all pixels OFF

            bu.setUint8(offset++, (pInvert ? 0xA7 : 0xA6))  // Set display not inverted / A6 Normal A7 Inverse display

            //bu.setUint8(offset++, 0xAF)  // Set display ON

            this.i2cWriteBuffer_OLED(bu) // nur 1 Buffer wird gesendet


            bu = Buffer.create(135)
            offset = 0            //offset = setCursorBuffer6(bu, 0, 0, 0)

            bu.setUint8(offset++, eCONTROL.x80_1Com) // CONTROL+1Command
            bu.setUint8(offset++, 0xB0)// | (page & 0x07)) // page number

            bu.setUint8(offset++, eCONTROL.x80_1Com) // CONTROL+1Command
            bu.setUint8(offset++, 0x00)// | (col & 0x0F)) // lower start column address 0x00-0x0F 4 Bit

            bu.setUint8(offset++, eCONTROL.x80_1Com) // CONTROL+1Command
            bu.setUint8(offset++, 0x10)// | (col >> 4) & 0x07) // upper start column address 0x10-0x17 3 Bit

            bu.setUint8(offset++, eCONTROL.x40_Data) // CONTROL+DisplayData
            bu.fill(0x00, offset++, 128)

            for (let page = 0; page <= 7; page++) {
                bu.setUint8(1, 0xB0 | page) // an offset=1 steht die page number (Zeile 0-7)
                // sendet den selben Buffer 8 Mal mit Änderung an 1 Byte
                // true gibt den i2c Bus dazwischen nicht für andere Geräte frei
                this.i2cWriteBuffer_OLED(bu, true) // Clear Screen
            }

            // Set display ON
            bu = Buffer.create(2)
            bu.setUint8(0, eCONTROL.x80_1Com) // CONTROL+1Command
            bu.setUint8(1, 0xAF) // Set display ON
            this.i2cWriteBuffer_OLED(bu)

            control.waitMicros(100000) // 100ms Delay Recommended
        }

        // ========== group="OLED Display 0.96 + SparkFun Qwiic EEPROM Breakout - 512Kbit"


        //% group="OLED Display 0.96 + SparkFun Qwiic EEPROM Breakout - 512Kbit"
        //% block="Display %OLED16x8 löschen || von Zeile %vonZeile bis Zeile %bisZeile mit Bitmuster %charcode" weight=2
        //% pADDR.shadow="oled_eADDR"
        //% vonZeile.min=0 vonZeile.max=7 vonZeile.defl=0
        //% bisZeile.min=0 bisZeile.max=7 bisZeile.defl=7
        //% charcode.min=0 charcode.max=255 charcode.defl=0
        //% inlineInputMode=inline
        clearScreen(vonZeile?: number, bisZeile?: number, charcode?: number) {
            if (between(vonZeile, 0, 7) && between(bisZeile, 0, 7)) {
                let bu = Buffer.create(135)
                let offset = this.setCursorBuffer6(bu, 0, 0, 0)
                bu.setUint8(offset++, eCONTROL.x40_Data) // CONTROL+DisplayData
                bu.fill(charcode & 0xFF, offset++, 128)   // 128 Byte füllen eine Zeile pixelweise

                for (let page = vonZeile; page <= bisZeile; page++) {
                    bu.setUint8(1, 0xB0 | page) // an offset=1 steht die page number (Zeile 0-7)
                    // sendet den selben Buffer 8 Mal mit Änderung an 1 Byte
                    // true gibt den i2c Bus dazwischen nicht für andere Geräte frei
                    this.i2cWriteBuffer_OLED(bu, page < bisZeile) // Clear Screen
                }
                control.waitMicros(100000) // 100ms Delay Recommended
            }
        }


        // ========== group="Text 16x8 anzeigen (Zeichensatz muss im EEPROM programmiert sein)"

        //% group="Text 16x8 anzeigen (Zeichensatz muss im EEPROM programmiert sein)"
        //% block="16x8 %OLED16x8 Text Zeile %row von %col bis %end %pText || %pAlign" weight=8
        //% row.min=0 row.max=7 col.min=0 col.max=15 end.min=0 end.max=15 end.defl=15
        //% pText.shadow="oled_text"
        //% pAlign.defl=0
        //% inlineInputMode=inline
        writeText16x8(row: number, col: number, end: number, pText: any, pAlign?: eAlign) {
            let text: string = convertToText(pText)
            let len: number = end - col + 1
            if (between(row, 0, 7) && between(col, 0, 15) && between(len, 0, 16)) {

                if (text.length > len)
                    text = text.substr(0, len)
                else if (text.length < len && pAlign == eAlign.rechts)
                    text = "                ".substr(0, len - text.length) + text
                else if (text.length < len)
                    text = text + "                ".substr(0, len - text.length)
                // else { } // Original Text text.length == len

                let bu = Buffer.create(7 + text.length * 8)
                let offset = this.setCursorBuffer6(bu, 0, row, col) // setCursor

                this.writeTextBuffer(bu, offset, text)
            }
        }

        //% group="Text 16x8 anzeigen (Zeichensatz muss im EEPROM programmiert sein)"
        //% block="16x8 %OLED16x8 Cursor Zeile %row von %col" weight=6
        //% row.min=0 row.max=7 col.min=0 col.max=15
        setCursor(row: number, col: number) {
            if (between(row, 0, 7) && between(col, 0, 15)) {
                let bu = Buffer.create(6)
                this.setCursorBuffer6(bu, 0, row, col)
                this.i2cWriteBuffer_OLED(bu)
                control.waitMicros(50)
            }
        }

        //% group="Text 16x8 anzeigen (Zeichensatz muss im EEPROM programmiert sein)"
        //% block="16x8 %OLED16x8 Text ab Cursor %pText" weight=4
        //% pText.shadow="oled_text"
        writeText(pText: any) {
            let text: string = convertToText(pText)
            this.writeTextBuffer(Buffer.create(1 + text.length * 8), 0, text)
        }



        // ========== group="Text 8x16 anzeigen (Zeichensatz muss im EEPROM programmiert sein)"

        //% group="Text 8x16 anzeigen (Zeichensatz muss im EEPROM programmiert sein)"
        //% block="8x16 %OLED16x8 Text Zeile %row von %col bis %end %pText || %pAlign" weight=7
        //% row.min=0 row.max=15 col.min=0 col.max=7 end.min=0 end.max=7 end.defl=7
        //% pText.shadow="oled_text"
        //% pAlign.defl=0
        //% inlineInputMode=inline
        writeText8x16(row: number, col: number, end: number, pText: any, pAlign?: eAlign) {
            let text: string = convertToText(pText)
            let len: number = end - col + 1
            if (between(row, 0, 15) && between(col, 0, 7) && between(len, 0, 8)) {

                if (text.length > len)
                    text = text.substr(0, len)
                else if (text.length < len && pAlign == eAlign.rechts)
                    text = "        ".substr(0, len - text.length) + text
                else if (text.length < len)
                    text = text + "        ".substr(0, len - text.length)
                // else { } // Original Text text.length == len

                let bu = Buffer.create(7 + 8) // 7 CONTROL+command + 8 text
                let offset = this.setCursorBuffer6(bu, 0, 7 - col, row) // setCursor
                bu.setUint8(offset++, eCONTROL.x40_Data) // CONTROL Byte 0x40: Display Data

                for (let j = 0; j < text.length; j++) {
                    bu.setUint8(1, 0xB0 | (7 - (col + j)) & 0x07)      // page number 7-0 B7-B0
                    bu.write(8, this.getPixel8Byte(text.charCodeAt(j)))

                    this.i2cWriteBuffer_OLED(bu)
                }
                control.waitMicros(50)
            }
        }



        // ========== advanced=true

        // ========== group="kopiert 1024 Byte vom EEPROM auf ein Display (Text, Bild)"

        //% group="kopiert 1024 Byte vom EEPROM auf ein Display (Text, Bild)" advanced=true
        //% block="16x8 %OLED16x8 Display füllen %pEEPROM_Startadresse || von Zeile %vonZeile bis Zeile %bisZeile"
        //% pEEPROM_Startadresse.shadow="oled_eEEPROM_Startadresse"
        //% vonZeile.min=0 vonZeile.max=7 vonZeile.defl=0
        //% bisZeile.min=0 bisZeile.max=7 bisZeile.defl=7
        //% inlineInputMode=inline
        fillScreen(pEEPROM_Startadresse: number, vonZeile?: number, bisZeile?: number) {
            if (between(vonZeile, 0, 7) && between(bisZeile, 0, 7)) {
                let buEEPROM = Buffer.create(2)

                let buDisplay = Buffer.create(135)
                let offsetDisplay = this.setCursorBuffer6(buDisplay, 0, 0, 0)
                buDisplay.setUint8(offsetDisplay++, eCONTROL.x40_Data) // CONTROL+DisplayData

                for (let page = vonZeile; page <= bisZeile; page++) {

                    buEEPROM.setNumber(NumberFormat.UInt16BE, 0, pEEPROM_Startadresse + page * 128)

                    buDisplay.setUint8(1, 0xB0 | page) // an offset=1 steht die page number (Zeile 0-7)
                    //offsetDisplay = 7 // offset 7-135 sind 128 Byte für die Pixel in einer Zeile

                    this.i2cWriteBuffer_EEPROM(buEEPROM)

                    buDisplay.write(7, this.i2cReadBuffer_EEPROM(128))

                    this.i2cWriteBuffer_OLED(buDisplay)
                }
            }
        }


        // ========== group="Display Command" advanced=true

        //% group="Display Command" advanced=true
        //% block="Display %OLED16x8 Command %pDisplayCommand %pON" weight=6
        //% pON.shadow="toggleOnOff"
        displayCommand(pDisplayCommand: eDisplayCommand, pON: boolean) {
            let bu = Buffer.create(2)
            bu.setUint8(0, eCONTROL.x00_xCom)
            switch (pDisplayCommand) {
                case eDisplayCommand.ON: { bu.setUint8(1, (pON ? eCommand.AF_DISPLAY_ON : eCommand.AE_DISPLAY_OFF)); break; }
                case eDisplayCommand.INVERS: { bu.setUint8(1, (pON ? eCommand.A7_INVERT_DISPLAY : eCommand.A6_NORMAL_DISPLAY)); break; }
                case eDisplayCommand.FLIP: { bu.setUint8(1, (pON ? eCommand.A0_SEGMENT_REMAP : eCommand.A1_SEGMENT_REMAP)); break }
                case eDisplayCommand.REMAP: { bu.setUint8(1, (pON ? eCommand.C0_COM_SCAN_INC : eCommand.C8_COM_SCAN_DEC)); break; }
                case eDisplayCommand.ENTIRE_ON: { bu.setUint8(1, (pON ? eCommand.A4_ENTIRE_DISPLAY_ON : eCommand.A5_RAM_CONTENT_DISPLAY)); break; }
            }
            this.i2cWriteBuffer_OLED(bu)
        }

        //% group="Display Command" advanced=true
        //% block="Zeichen %OLED16x8 %pZeichenDrehen" weight=4
        zeichenDrehen(pZeichenDrehen: eZeichenDrehen) { this.qZeichenDrehen = pZeichenDrehen }


        // ========== group="i2c Fehlercode" advanced=true

        //% group="i2c Fehlercode" advanced=true
        //% block="%OLED16x8 i2c Fehlercode OLED" weight=4
        geti2cError_OLED() { return this.i2cError_OLED }

        //% group="i2c Fehlercode" advanced=true
        //% block="%OLED16x8 i2c Fehlercode EEPROM" weight=2
        geti2cError_EEPROM() { return this.i2cError_EEPROM }



        // ========== private

        //protected between(i0: number, i1: number, i2: number): boolean { return (i0 >= i1 && i0 <= i2) }

        protected setCursorBuffer6(bu: Buffer, offset: number, row: number, col: number) {
            // schreibt in den Buffer ab offset 6 Byte (CONTROL und Command für setCursor)
            // Buffer muss vorher die richtige Länge haben
            bu.setUint8(offset++, eCONTROL.x80_1Com) // CONTROL+1Command
            bu.setUint8(offset++, 0xB0 | row & 0x07)      // page number 0-7 B0-B7
            bu.setUint8(offset++, eCONTROL.x80_1Com) // CONTROL+1Command
            bu.setUint8(offset++, 0x00 | col << 3 & 0x0F) // (col % 16) lower start column address 0x00-0x0F 4 Bit
            bu.setUint8(offset++, eCONTROL.x80_1Com) // CONTROL+1Command
            bu.setUint8(offset++, 0x10 | col >> 1 & 0x07) // (col >> 4) upper start column address 0x10-0x17 3 Bit
            return offset
            //                    0x40               // CONTROL+Display Data
        }

        private writeTextBuffer(bu: Buffer, offset: number, pText: string) {
            // schreibt in den Buffer ab offset 1 Byte 0x40 + 8 Byte pro char im Text für die 8x8 Pixel
            // Buffer muss vorher die richtige Länge haben
            let font: string
            bu.setUint8(offset++, eCONTROL.x40_Data) // CONTROL Byte 0x40: Display Data
            for (let j = 0; j < pText.length; j++) {
                bu.write(offset, this.getPixel8Byte(pText.charCodeAt(j)))
                offset += 8
            }
            this.i2cWriteBuffer_OLED(bu)
            control.waitMicros(50)
        }

        private getPixel8Byte(pCharCode: number) {//, pDrehen: eZeichenDrehen
            if (this.i2cError_EEPROM == 0 && this.qEEPROM_Startadresse_8x8 != eEEPROM_Startadresse.kein_EEPROM) {
                let bu = Buffer.create(2)
                bu.setNumber(NumberFormat.UInt16BE, 0, this.qEEPROM_Startadresse_8x8 + pCharCode * 8)
                this.i2cWriteBuffer_EEPROM(bu, true)

                return drehen(this.i2cReadBuffer_EEPROM(8), this.qZeichenDrehen)
            } else {
                // wenn kein EEPROM angeschlossen, Zeichencode aus Array laden
                return Buffer.fromUTF8("\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF")
                //return drehen(getPixel8ByteArray(pCharCode), this.qZeichenDrehen)
            }
        }



        // ========== private i2cWriteBuffer i2cReadBuffer

        private i2cWriteBuffer_EEPROM(buf: Buffer, repeat: boolean = false) {
            //if (this.i2cADDR_EEPROM != undefined && this.i2cADDR_EEPROM != eEEPROM_Startadresse.kein_EEPROM)
            if (this.i2cError_EEPROM == 0) { // vorher kein Fehler
                this.i2cError_EEPROM = pins.i2cWriteBuffer(this.i2cADDR_EEPROM, buf, repeat)
                if (this.i2cCheck && this.i2cError_EEPROM != 0)  // vorher kein Fehler, wenn (n_i2cCheck=true): beim 1. Fehler anzeigen
                    basic.showString(Buffer.fromArray([this.i2cADDR_EEPROM]).toHex()) // zeige fehlerhafte i2c-Adresse als HEX
            } else if (!this.i2cCheck)  // vorher Fehler, aber ignorieren (n_i2cCheck=false): i2c weiter versuchen
                this.i2cError_EEPROM = pins.i2cWriteBuffer(this.i2cADDR_EEPROM, buf, repeat)
        }

        private i2cReadBuffer_EEPROM(size: number, repeat: boolean = false): Buffer {
            if (!this.i2cCheck || this.i2cError_EEPROM == 0)
                return pins.i2cReadBuffer(this.i2cADDR_EEPROM, size, repeat)
            else
                return Buffer.create(size)
        }


        protected i2cWriteBuffer_OLED(buf: Buffer, repeat: boolean = false) {
            if (this.i2cError_OLED == 0) { // vorher kein Fehler
                this.i2cError_OLED = pins.i2cWriteBuffer(this.i2cADDR_OLED, buf, repeat)
                if (this.i2cCheck && this.i2cError_OLED != 0)  // vorher kein Fehler, wenn (n_i2cCheck=true): beim 1. Fehler anzeigen
                    basic.showString(Buffer.fromArray([this.i2cADDR_OLED]).toHex()) // zeige fehlerhafte i2c-Adresse als HEX
            } else if (!this.i2cCheck)  // vorher Fehler, aber ignorieren (n_i2cCheck=false): i2c weiter versuchen
                this.i2cError_OLED = pins.i2cWriteBuffer(this.i2cADDR_OLED, buf, repeat)
            //else { } // n_i2cCheck=true und n_i2cError != 0: weitere i2c Aufrufe blockieren
        }

    } // class oledclass

    // namespace oled


    // ========== group="Text" advanced=true

    //% group="Text" advanced=true
    //% block="kehre %pText um"
    //% pText.shadow="oled_text"
    export function kehreum(pText: any): string {
        let text: string = convertToText(pText)
        let r: string = ""
        for (let j = 0; j < text.length; j++)
            r = text.charAt(j) + r
        return r
    }

    export function between(i0: number, i1: number, i2: number): boolean { return (i0 >= i1 && i0 <= i2) }


    function drehen(b0: Buffer, pDrehen: eZeichenDrehen) { // Buffer mit 8 Byte
        let b1 = Buffer.create(8)
        b1.fill(0b00000000)

        switch (pDrehen) {
            case eZeichenDrehen.nicht: {
                return b0
            }
            case eZeichenDrehen.links: {
                for (let i = 0; i <= 7; i++) { // 8x8 Bit 1/4 nach links drehen
                    if ((b0.getUint8(7 - i) & 2 ** 7) != 0) { b1.setUint8(7, b1.getUint8(7) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 6) != 0) { b1.setUint8(6, b1.getUint8(6) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 5) != 0) { b1.setUint8(5, b1.getUint8(5) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 4) != 0) { b1.setUint8(4, b1.getUint8(4) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 3) != 0) { b1.setUint8(3, b1.getUint8(3) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 2) != 0) { b1.setUint8(2, b1.getUint8(2) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 1) != 0) { b1.setUint8(1, b1.getUint8(1) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 0) != 0) { b1.setUint8(0, b1.getUint8(0) | 2 ** i) }
                }
                return b1
            }
            case eZeichenDrehen.rechts: {
                for (let i = 0; i <= 7; i++) { // 8x8 Bit 1/4 nach rechts drehen
                    if ((b0.getUint8(i) & 2 ** 0) != 0) { b1.setUint8(7, b1.getUint8(7) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 1) != 0) { b1.setUint8(6, b1.getUint8(6) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 2) != 0) { b1.setUint8(5, b1.getUint8(5) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 3) != 0) { b1.setUint8(4, b1.getUint8(4) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 4) != 0) { b1.setUint8(3, b1.getUint8(3) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 5) != 0) { b1.setUint8(2, b1.getUint8(2) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 6) != 0) { b1.setUint8(1, b1.getUint8(1) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 7) != 0) { b1.setUint8(0, b1.getUint8(0) | 2 ** i) }
                }
                return b1
            }
            case eZeichenDrehen.spiegeln: {
                for (let i = 0; i <= 7; i++) { // 8x8 Bit 1/2 nach rechts drehen
                    if ((b0.getUint8(i) & 2 ** 0) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 0) }
                    if ((b0.getUint8(i) & 2 ** 1) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 1) }
                    if ((b0.getUint8(i) & 2 ** 2) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 2) }
                    if ((b0.getUint8(i) & 2 ** 3) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 3) }
                    if ((b0.getUint8(i) & 2 ** 4) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 4) }
                    if ((b0.getUint8(i) & 2 ** 5) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 5) }
                    if ((b0.getUint8(i) & 2 ** 6) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 6) }
                    if ((b0.getUint8(i) & 2 ** 7) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 7) }
                }
                return b1
            }
            default: return b0
        }
    }

} // oledclass.ts