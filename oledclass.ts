
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

    //% group="nur Text anzeigen; mit EEPROM (am wenigsten Speicherplatz)" subcategory="beim Start"
    //% block="i2c %pADDR nur Text || invert %pInvert flip %pFlip i2c-Check %ck"
    //% pADDR.shadow="oled_eADDR_OLED"
    //% pInvert.shadow="toggleOnOff"
    //% pFlip.shadow="toggleOnOff"
    //% ck.shadow="toggleOnOff" ck.defl=1
    //% inlineInputMode=inline
    //% blockSetVariable=OLEDtext
    export function new_oledclass(pADDR: number, pInvert?: boolean, pFlip?: boolean, ck?: boolean): oledclass {

        return new oledclass(pADDR, (pInvert ? true : false), (pFlip ? true : false), (ck ? true : false))
        // optionaler Parameter kann undefined sein
    }


    //% group="Grafik und Text; mit EEPROM (beide Blöcke verwenden)" subcategory="beim Start"
    //% block="i2c %pADDR Grafik und Text || invert %pInvert flip %pFlip i2c-Check %ck" weight=4
    //% pADDR.shadow="oled_eADDR_OLED"
    //% pInvert.shadow="toggleOnOff"
    //% pFlip.shadow="toggleOnOff"
    //% ck.shadow="toggleOnOff" ck.defl=1
    //% inlineInputMode=inline
    //% blockSetVariable=OLEDpaint
    export function new_oledpaint(pADDR: number, pInvert?: boolean, pFlip?: boolean, ck?: boolean): oledpaint {

        return new oledpaint(pADDR, (pInvert ? true : false), (pFlip ? true : false), (ck ? true : false))
        // optionaler Parameter kann undefined sein
    }



    // ========== class oledclass

    export class oledclass {
        private readonly i2cADDR: eADDR_OLED
        private readonly i2cCheck: boolean // i2c-Check
        private i2cError: number = 0 // Fehlercode vom letzten WriteBuffer (0 ist kein Fehler)

        private qZeichenDrehen: eZeichenDrehen = eZeichenDrehen.nicht
        // class
        private qOLEDeeprom: oledeeprom
        private qOLEDArrays_8x8: oledarrays_8x8
        private qOLEDArrays_5x5: oledarrays_5x5

        constructor(pADDR: number, pInvert: boolean, pFlip: boolean, ck: boolean) {
            this.i2cADDR = pADDR
            this.i2cCheck = ck
            this.i2cError = 0 // Reset Fehlercode
            this.init(pInvert, pFlip)
        }



        // ========== group="Text 16x8 anzeigen"

        //% group="Text 16x8 anzeigen"
        //% block="16x8 %OLEDtext Text Zeile %row von %col bis %end %pText || %pAlign" weight=8
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

        //% group="Text 16x8 anzeigen"
        //% block="16x8 %OLEDtext Cursor Zeile %row von %col" weight=6
        //% row.min=0 row.max=7 col.min=0 col.max=15
        setCursor(row: number, col: number) {
            if (between(row, 0, 7) && between(col, 0, 15)) {
                let bu = Buffer.create(6)
                this.setCursorBuffer6(bu, 0, row, col)
                this.i2cWriteBuffer(bu)
                control.waitMicros(50)
            }
        }

        //% group="Text 16x8 anzeigen"
        //% block="16x8 %OLEDtext Text ab Cursor %pText" weight=4
        //% pText.shadow="oled_text"
        writeText(pText: any) {
            let text: string = convertToText(pText)
            this.writeTextBuffer(Buffer.create(1 + text.length * 8), 0, text)
        }



        // ========== group="Text 8x16 anzeigen"

        //% group="Text 8x16 anzeigen"
        //% block="8x16 %OLEDtext Text Zeile %row von %col bis %end %pText || %pAlign" weight=7
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
                    bu.write(8, this.getPixel_8x8(text.charCodeAt(j)))

                    this.i2cWriteBuffer(bu)
                }
                control.waitMicros(50)
            }
        }



        // ========== group="OLED Display"


        //% group="OLED Display"
        //% block="Display %OLEDtext löschen || von Zeile %vonZeile bis Zeile %bisZeile mit Bitmuster %charcode" weight=2
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
                    this.i2cWriteBuffer(bu, page < bisZeile) // Clear Screen
                }
                control.waitMicros(100000) // 100ms Delay Recommended
            }
        }




        // ========== group="OLED Display" advanced=true

        //% group="OLED Display" advanced=true
        //% block="Display %OLEDtext initialisieren || invert %pInvert drehen %pFlip" weight=6
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

            this.i2cWriteBuffer(bu) // nur 1 Buffer wird gesendet


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
                this.i2cWriteBuffer(bu, true) // Clear Screen
            }

            // Set display ON
            bu = Buffer.create(2)
            bu.setUint8(0, eCONTROL.x80_1Com) // CONTROL+1Command
            bu.setUint8(1, 0xAF) // Set display ON
            this.i2cWriteBuffer(bu)

            control.waitMicros(100000) // 100ms Delay Recommended
        }



        // ========== subcategory="beim Start" ==========


        // ========== group="Zeichensatz einstellen (ohne EEPROM)" subcategory="beim Start"

        //% group="wenn kein EEPROM vorhanden (Zeichensatz im Speicher)" subcategory="beim Start"
        //% block="Zeichen 8x8 %OLEDtext %p_8x8" weight=4
        //% p_8x8.shadow="oled_new_oledarrays_8x8"
        set_oledarrays_8x8(p_8x8: oledarrays_8x8) { this.qOLEDArrays_8x8 = p_8x8 }

        //% group="wenn kein EEPROM vorhanden (Zeichensatz im Speicher)" subcategory="beim Start"
        //% block="Zeichen 5x5 %OLEDtext %p_5x5" weight=3
        //% p_5x5.shadow="oled_new_oledarrays_5x5"
        set_oledarrays_5x5(p_5x5: oledarrays_5x5) { this.qOLEDArrays_5x5 = p_5x5 }


        // ========== group="Zeichensatz einstellen (mit EEPROM)" subcategory="beim Start"

        //% group="Blöcke nur verwenden, um Standardwerte zu ändern" subcategory="beim Start"
        //% block="Zeichen 8x8 %OLEDtext %pEEPROM_Startadresse_8x8 || i2c %pEEPROM_i2cADDR" weight=4
        //% pEEPROM_Startadresse_8x8.shadow=oled_eEEPROM_Startadresse
        //% pEEPROM_Startadresse_8x8.defl=oled.eEEPROM_Startadresse.F800
        //% pEEPROM_i2cADDR.shadow=oled_eADDR_EEPROM
        set_eeprom_8x8(pEEPROM_Startadresse_8x8: number, pEEPROM_i2cADDR?: number) { // pEEPROM_i2cADDR.defl funktioniert nicht
            if (this.qOLEDeeprom == null)
                this.qOLEDeeprom = new oledeeprom(pEEPROM_i2cADDR, this.i2cCheck)
            this.qOLEDeeprom.qEEPROM_Startadresse_8x8 = pEEPROM_Startadresse_8x8
            //if (pEEPROM_i2cADDR != undefined) this.i2cADDR_EEPROM = pEEPROM_i2cADDR
        }

        //% group="Blöcke nur verwenden, um Standardwerte zu ändern" subcategory="beim Start"
        //% block="Zeichen 5x5 %OLEDtext %pEEPROM_Startadresse_5x5 || i2c %pEEPROM_i2cADDR" weight=2
        //% pEEPROM_Startadresse_5x5.shadow=oled_eEEPROM_Startadresse
        //% pEEPROM_Startadresse_5x5.defl=oled.eEEPROM_Startadresse.EC00
        //% pEEPROM_i2cADDR.shadow=oled_eADDR_EEPROM
        set_eeprom_5x5(pEEPROM_Startadresse_5x5: number, pEEPROM_i2cADDR?: number) { // pEEPROM_i2cADDR.defl funktioniert nicht
            if (this.qOLEDeeprom == null)
                this.qOLEDeeprom = new oledeeprom(pEEPROM_i2cADDR, this.i2cCheck)
            this.qOLEDeeprom.qEEPROM_Startadresse_5x5 = pEEPROM_Startadresse_5x5
            //if (pEEPROM_i2cADDR != undefined) this.i2cADDR_EEPROM = pEEPROM_i2cADDR
        }



        // ========== advanced=true

        // ========== group="kopiert 1024 Byte vom EEPROM auf ein Display (Text, Bild)"

        //% group="kopiert 1024 Byte vom EEPROM auf ein Display (Text, Bild)" advanced=true
        //% block="16x8 %OLEDtext Display füllen %pEEPROM_Startadresse || von Zeile %vonZeile bis Zeile %bisZeile"
        //% pEEPROM_Startadresse.shadow="oled_eEEPROM_Startadresse"
        //% vonZeile.min=0 vonZeile.max=7 vonZeile.defl=0
        //% bisZeile.min=0 bisZeile.max=7 bisZeile.defl=7
        //% inlineInputMode=inline
        fillScreen(pEEPROM_Startadresse: number, vonZeile?: number, bisZeile?: number) {
            if (between(vonZeile, 0, 7) && between(bisZeile, 0, 7)) {

                if (this.qOLEDeeprom == null) { this.qOLEDeeprom = new oledeeprom() }

                //let buEEPROM = Buffer.create(2)

                let buDisplay = Buffer.create(135)
                let offsetDisplay = this.setCursorBuffer6(buDisplay, 0, 0, 0)
                buDisplay.setUint8(offsetDisplay++, eCONTROL.x40_Data) // CONTROL+DisplayData

                for (let page = vonZeile; page <= bisZeile; page++) {

                    //buEEPROM.setNumber(NumberFormat.UInt16BE, 0, pEEPROM_Startadresse + page * 128)

                    buDisplay.setUint8(1, 0xB0 | page) // an offset=1 steht die page number (Zeile 0-7)
                    //offsetDisplay = 7 // offset 7-135 sind 128 Byte für die Pixel in einer Zeile

                    //this.qOLEDeeprom.i2cWriteBuffer(buEEPROM)
                    //buDisplay.write(7, this.qOLEDeeprom.i2cReadBuffer(128))

                    buDisplay.write(7, this.qOLEDeeprom.read(pEEPROM_Startadresse + page * 128, 128))

                    this.i2cWriteBuffer(buDisplay)
                }
            }
        }


        // ========== group="Display Command" advanced=true

        //% group="Display Command" advanced=true
        //% block="Display %OLEDtext Command %pDisplayCommand %pON" weight=6
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
            this.i2cWriteBuffer(bu)
        }

        //% group="Display Command" advanced=true
        //% block="Zeichen %OLEDtext %pZeichenDrehen" weight=4
        zeichenDrehen(pZeichenDrehen: eZeichenDrehen) { this.qZeichenDrehen = pZeichenDrehen }


        // ========== group="i2c Fehlercode" advanced=true

        //% group="i2c Fehlercode" advanced=true
        //% block="%OLEDtext i2c Fehlercode OLED" weight=4
        geti2cError_OLED() { return this.i2cError }

        //% group="i2c Fehlercode" advanced=true
        //% block="%OLEDtext i2c Fehlercode EEPROM" weight=2
        geti2cError_EEPROM() { return this.qOLEDeeprom.i2cError_EEPROM }



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
                bu.write(offset, this.getPixel_8x8(pText.charCodeAt(j)))
                offset += 8
            }
            this.i2cWriteBuffer(bu)
            control.waitMicros(50)
        }

        private getPixel_8x8(pCharCode: number): Buffer {//, pDrehen: eZeichenDrehen
            if (this.qOLEDArrays_8x8 != null)
                return drehen(this.qOLEDArrays_8x8.getPixel_8x8(pCharCode), this.qZeichenDrehen)

            /* else if (this.i2cError_EEPROM == 0 && this.qEEPROM_Startadresse_8x8 != eEEPROM_Startadresse.kein_EEPROM) {
                let bu = Buffer.create(2)
                bu.setNumber(NumberFormat.UInt16BE, 0, this.qEEPROM_Startadresse_8x8 + pCharCode * 8)
                this.i2cWriteBuffer_EEPROM(bu, true)

                return drehen(this.i2cReadBuffer_EEPROM(8), this.qZeichenDrehen)
            } */
            //else if (this.qOLEDArrays_8x8 != null) {
            //    return drehen(this.qOLEDArrays_8x8.getPixel8ByteArray(pCharCode), this.qZeichenDrehen)
            else {

                if (this.qOLEDeeprom == null) { this.qOLEDeeprom = new oledeeprom() }

                return drehen(this.qOLEDeeprom.getPixel_8x8(pCharCode), this.qZeichenDrehen)

                // wenn kein EEPROM angeschlossen, Zeichencode aus Array laden
                //return Buffer.fromUTF8("\xFF\xFF\xFF\xFF\x00\xFF\xFF\xFF")


                //return drehen(getPixel8ByteArray(pCharCode), this.qZeichenDrehen)
            }
        }



        // ========== protected i2cWriteBuffer (i2cReadBuffer entfällt beim Display)

        protected i2cWriteBuffer(buf: Buffer, repeat: boolean = false) {
            if (this.i2cError == 0) { // vorher kein Fehler
                this.i2cError = pins.i2cWriteBuffer(this.i2cADDR, buf, repeat)
                if (this.i2cCheck && this.i2cError != 0)  // vorher kein Fehler, wenn (n_i2cCheck=true): beim 1. Fehler anzeigen
                    basic.showString(Buffer.fromArray([this.i2cADDR]).toHex()) // zeige fehlerhafte i2c-Adresse als HEX
            } else if (!this.i2cCheck)  // vorher Fehler, aber ignorieren (n_i2cCheck=false): i2c weiter versuchen
                this.i2cError = pins.i2cWriteBuffer(this.i2cADDR, buf, repeat)
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

} // oledclass.ts