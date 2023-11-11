/**
 * Kitronik VIEW 128x64 Display blocks
 * LCD chip SSD1306
 * angepasst an Calliope mini und erweitert von M.Klein 26.05.22-03.06.22
 **/
//% weight=27 color=#00A654 icon="\uf26c" block="oledco2"
namespace CO2OLED
/*  https://github.com/mkleinsb/pxt-CO2OLED
    "pxt-CO2OLED": "github:MKleinSB/pxt-CO2OLED#v0.1.0",
*/ {
    /* 
        //Screen buffers for sending data to the display
        let screenBuf = pins.createBuffer(240); //1025
        let ackBuf = pins.createBuffer(2);
        let writeOneByteBuf = pins.createBuffer(2);
        let writeTwoByteBuf = pins.createBuffer(3);
        let writeThreeByteBuf = pins.createBuffer(4);
        let initalised = 0
    
        //default address for the display
        let DISPLAY_ADDR_1 = 60
        let DISPLAY_ADDR_2 = 10
        let displayAddress = DISPLAY_ADDR_1;
    
        //function write one byte of data to the display
        function writeOneByte(regValue: number) {
            writeOneByteBuf[0] = 0;
            writeOneByteBuf[1] = regValue;
            pins.i2cWriteBuffer(displayAddress, writeOneByteBuf);
        }
    
        //function write two byte of data to the display
        function writeTwoByte(regValue1: number, regValue2: number) {
            writeTwoByteBuf[0] = 0;
            writeTwoByteBuf[1] = regValue1;
            writeTwoByteBuf[2] = regValue2;
            pins.i2cWriteBuffer(displayAddress, writeTwoByteBuf);
        }
    
        //function write three byte of data to the display
        function writeThreeByte(regValue1: number, regValue2: number, regValue3: number) {
            writeThreeByteBuf[0] = 0;
            writeThreeByteBuf[1] = regValue1;
            writeThreeByteBuf[2] = regValue2;
            writeThreeByteBuf[3] = regValue3;
            pins.i2cWriteBuffer(displayAddress, writeThreeByteBuf);
        }
    
        function set_pos(col: number = 0, page: number = 0) {
            writeOneByte(0xb0 | page) // page number
            writeOneByte(0x00 | (col % 16)) // lower start column address
            writeOneByte(0x10 | (col >> 4)) // upper start column address    
        }
    
        // clear bit
        function clearBit(d: number, b: number): number {
            if (d & (1 << b))
                d -= (1 << b)
            return d
        }
    
        // sorts the value and return the correct address
        function setScreenAddr(selection: number): number {
            let addr = 0
            if (selection == 1) {
                addr = DISPLAY_ADDR_1
            }
            else if (selection == 2) {
                addr = DISPLAY_ADDR_2
            }
            else {
                addr = DISPLAY_ADDR_1
            }
            return addr
        }
    
        function initDisplay(screen?: number): void {
    
            displayAddress = setScreenAddr(screen)
            //load the ackBuffer to check is there is a display there before starting initalising of ths display
            ackBuf[0] = 0
            ackBuf[1] = 0xAF
            let ack = pins.i2cWriteBuffer(displayAddress, ackBuf)
            if (ack == -1010) { //if value return back is -1010, there is no display and show error message
                basic.showString("ERROR - no display")
            }
            else {   //start initalising of the display
                writeOneByte(0xAE)       // SSD1306_DISPLAYOFF
                writeOneByte(0xA4)       // SSD1306_DISPLAYALLON_RESUME
                writeTwoByte(0xD5, 0xF0) // SSD1306_SETDISPLAYCLOCKDIV
                writeTwoByte(0xA8, 0x3F) // SSD1306_SETMULTIPLEX
                writeTwoByte(0xD3, 0x00) // SSD1306_SETDISPLAYOFFSET
                writeOneByte(0 | 0x0)    // line #SSD1306_SETSTARTLINE
                writeTwoByte(0x8D, 0x14) // SSD1306_CHARGEPUMP
                writeTwoByte(0x20, 0x00) // SSD1306_MEMORYMODE
                writeThreeByte(0x21, 0, 127) // SSD1306_COLUMNADDR
                writeThreeByte(0x22, 0, 63)  // SSD1306_PAGEADDR
                writeOneByte(0xa0 | 0x1) // SSD1306_SEGREMAP
                writeOneByte(0xc8)       // SSD1306_COMSCANDEC
                writeTwoByte(0xDA, 0x12) // SSD1306_SETCOMPINS
                writeTwoByte(0x81, 0xCF) // SSD1306_SETCONTRAST
                writeTwoByte(0xd9, 0xF1) // SSD1306_SETPRECHARGE
                writeTwoByte(0xDB, 0x40) // SSD1306_SETVCOMDETECT
                writeOneByte(0xA6)       // SSD1306_NORMALDISPLAY
                writeTwoByte(0xD6, 0)    // zoom is set to off
                writeOneByte(0xAF)       // SSD1306_DISPLAYON
                initalised = 1
                clear()
            }
        }
    
        let quer = matrix22x6(`
            . . # # # # # # # # # # # # # # # # # # . .
            . # # # # # # # # # # # # # # # # # # # # .
            # # # # # # # # # # # # # # # # # # # # # #
            # # # # # # # # # # # # # # # # # # # # # #
            . # # # # # # # # # # # # # # # # # # # # .
            . . # # # # # # # # # # # # # # # # # # . .
            `)
        let hoch = matrix6x24(`
        . . # # . .
        . # # # # .
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        # # # # # #
        . # # # # .
        . . # # . .
        `)
        let Punkt = matrix8x8(`
            . . . # # . . .
            . # # # # # # .
            . # # # # # # .
            # # # # # # # #
            # # # # # # # #
            . # # # # # # .
            . # # # # # # .
            . . . # # . . .
            `)
    
        //% blockId=zeigeProz block="show 7-segment |\\% %num"
        //% block.loc.de="zeige 7-Segment |\\% %num"
        //% weight=90
        export function zeigeProz(num: number) {
            let zahlAlsText = ""
            screenBuf.fill(0)       //Puffer löschen
            screenBuf[0] = 0x40
            set_pos()               // auf Start setzen
    
            if (num < 101 && num >= 0) {
                zahlAlsText = convertToText(Math.round(num))
                for (let Index = 0; Index <= zahlAlsText.length - 1; Index++) {
                    drawnum(parseFloat(zahlAlsText.substr(Index, 1)), Index + 3 - zahlAlsText.length)
                    writeImageOLED(Punkt, 117, 9)
                    writeImageOLED(Punkt, 116, 12)
                    writeImageOLED(Punkt, 115, 15)
                    writeImageOLED(Punkt, 114, 18)
                    writeImageOLED(Punkt, 113, 21)
                    writeImageOLED(Punkt, 112, 23)
                    writeImageOLED(Punkt, 111, 26)
                    writeImageOLED(Punkt, 110, 29)
                    writeImageOLED(Punkt, 109, 32)
                    writeImageOLED(Punkt, 108, 35)
                    writeImageOLED(Punkt, 107, 38)
                    writeImageOLED(Punkt, 106, 41)
                    writeImageOLED(Punkt, 120, 34)
                    writeImageOLED(Punkt, 103, 14)
                }
            } else {
                drawsegment("A", 0)
                drawsegment("D", 0)
                drawsegment("E", 0)
                drawsegment("F", 0)
                drawsegment("G", 0)
                drawsegment("E", 32)
                drawsegment("G", 32)
                drawsegment("E", 64)
                drawsegment("G", 64)
            }
            refresh() //Puffer anzeigen
        }
    
        //% blockId=zeigeGrad block="show 7-segment °C %num"
        //% block.loc.de="zeige 7-Segment °C %num"
        //% weight=90
        export function zeigeGrad(num: number) {
            let zahlAlsText = ""
            screenBuf.fill(0)       //Puffer löschen
            screenBuf[0] = 0x40
            set_pos()               // auf Start setzen
    
            if (num < 99 && num >= -9) {
                zahlAlsText = convertToText(Math.round(num))
                if (num < 0) {
                    drawsegment("G", 0)
                }
                for (let Index = 0; Index <= zahlAlsText.length - 1; Index++) {
                    drawnum(parseFloat(zahlAlsText.substr(Index, 1)), Index + 2 - zahlAlsText.length)
                    writeImageOLED(Punkt, 80, 0)
                    drawsegment("A", 96)
                    drawsegment("F", 96)
                    drawsegment("E", 96)
                    drawsegment("D", 96)
                }
            } else {
                drawsegment("A", 0)
                drawsegment("D", 0)
                drawsegment("E", 0)
                drawsegment("F", 0)
                drawsegment("G", 0)
                drawsegment("E", 32)
                drawsegment("G", 32)
                drawsegment("E", 64)
                drawsegment("G", 64)
            }
            refresh() //Puffer anzeigen
        }
    
    
        //% blockId=zeigeZahl block="show 7-segment number %num"
        //% block.loc.de="zeige 7-Segment Zahl %num"
        //% weight=91
        export function zeigeZahl(num: number) {
            let zahlAlsText = ""
            screenBuf.fill(0)       //Puffer löschen
            screenBuf[0] = 0x40
            set_pos()               // auf Start setzen
            if (num < 10000 && num >= 0) {
                zahlAlsText = convertToText(num)
                for (let Index = 0; Index <= zahlAlsText.length - 1; Index++) {
                    drawnum(parseFloat(zahlAlsText.substr(Index, 1)), Index + 4 - zahlAlsText.length)
                }
            } else {
                drawsegment("A", 0)
                drawsegment("D", 0)
                drawsegment("E", 0)
                drawsegment("F", 0)
                drawsegment("G", 0)
                drawsegment("E", 32)
                drawsegment("G", 32)
                drawsegment("E", 64)
                drawsegment("G", 64)
            }
            refresh()
        }
    
        function drawsegment(seg: string, pos: number) {
            switch (seg) {
                case "A": {
                    writeImageOLED(quer, pos + 4, 0)
                    break
                }
                case "F": {
                    writeImageOLED(hoch, pos, 4)
                    break
                }
                case "E": {
                    writeImageOLED(hoch, pos, 29)
                    break
                }
                case "G": {
                    writeImageOLED(quer, pos + 4, 25)
                    break
                }
                case "B": {
                    writeImageOLED(hoch, pos + 24, 4)
                    break
                }
                case "C": {
                    writeImageOLED(hoch, pos + 24, 29)
                    break
                }
                case "D": {
                    writeImageOLED(quer, pos + 4, 50)
                    break
                }
            }
        }
    
    
    
        //% blockId=zeigeppm block="show ppm"
        //% block.loc.de="zeige ppm"
        //% weight=91
        export function ppm() {
            screenBuf.fill(0)       //Puffer löschen
            screenBuf[0] = 0x40
            set_pos()
            drawsegment("A", 0)
            drawsegment("B", 0)
            drawsegment("G", 0)
            drawsegment("E", 0)
            drawsegment("F", 0)
            drawsegment("A", 32)
            drawsegment("B", 32)
            drawsegment("G", 32)
            drawsegment("E", 32)
            drawsegment("F", 32)
            drawsegment("A", 64)
            drawsegment("B", 64)
            drawsegment("F", 64)
            drawsegment("B", 88)
            drawsegment("A", 88)
            refresh()
        }
    
    
        function drawnum(num: number, pos: number) {
            switch (pos) {
                case 0: {
                    pos = 0
                    break
                }
                case 1: {
                    pos = 32
                    break
                }
                case 2: {
                    pos = 64
                    break
                }
                case 3: {
                    pos = 96
                    break
                }
            }
            switch (num) {
                case 0: {
                    drawsegment("A", pos)
                    drawsegment("B", pos)
                    drawsegment("C", pos)
                    drawsegment("D", pos)
                    drawsegment("E", pos)
                    drawsegment("F", pos)
                    break
                }
                case 1: {
                    drawsegment("B", pos)
                    drawsegment("C", pos)
                    break
                }
                case 2: {
                    drawsegment("A", pos)
                    drawsegment("B", pos)
                    drawsegment("G", pos)
                    drawsegment("E", pos)
                    drawsegment("D", pos)
                    break
                }
                case 3: {
                    drawsegment("A", pos)
                    drawsegment("B", pos)
                    drawsegment("C", pos)
                    drawsegment("D", pos)
                    drawsegment("G", pos)
                    break
                }
                case 4: {
                    drawsegment("B", pos)
                    drawsegment("C", pos)
                    drawsegment("F", pos)
                    drawsegment("G", pos)
                    break
                }
                case 5: {
                    drawsegment("A", pos)
                    drawsegment("C", pos)
                    drawsegment("D", pos)
                    drawsegment("F", pos)
                    drawsegment("G", pos)
                    break
                }
                case 6: {
                    drawsegment("A", pos)
                    drawsegment("C", pos)
                    drawsegment("D", pos)
                    drawsegment("E", pos)
                    drawsegment("F", pos)
                    drawsegment("G", pos)
                    break
                }
                case 7: {
                    drawsegment("A", pos)
                    drawsegment("B", pos)
                    drawsegment("C", pos)
                    break
                }
                case 8: {
                    drawsegment("A", pos)
                    drawsegment("B", pos)
                    drawsegment("C", pos)
                    drawsegment("D", pos)
                    drawsegment("E", pos)
                    drawsegment("F", pos)
                    drawsegment("G", pos)
                    break
                }
                case 9: {
                    drawsegment("A", pos)
                    drawsegment("B", pos)
                    drawsegment("C", pos)
                    drawsegment("D", pos)
                    drawsegment("F", pos)
                    drawsegment("G", pos)
                    break
                }
            }
        }
    
    
        //% imageLiteral=1
        //% imageLiteralColumns=8
        //% imageLiteralRows=8
        //% shim=images::createImage
        function matrix8x8(i: string): Image {
            const im = <Image><any>i;
            return im
        }
    
        //% imageLiteral=1
        //% imageLiteralColumns=6
        //% imageLiteralRows=24
        //% shim=images::createImage
        function matrix6x24(i: string): Image {
            const im = <Image><any>i;
            return im
        }
    
        //% imageLiteral=1
        //% imageLiteralColumns=22
        //% imageLiteralRows=6
        //% shim=images::createImage
        function matrix22x6(i: string): Image {
            const im = <Image><any>i;
            return im
        }
    
        function writeImageOLED(im: Image, xpos: number, ypos: number) {
            for (let y = 0; y <= im.height() - 1; y++) {
                for (let x = 0; x <= im.width() - 1; x++) {
                    if ((im.pixel(x, y) ? 1 : 0)) {
                        setPixelbuffer(x + xpos, y + ypos)
                    }
                }
            }
        }
    
        function setPixelbuffer(x: number, y: number, screen?: 1) {
            displayAddress = setScreenAddr(screen)
            if (initalised == 0) {
                initDisplay()
            }
    
            let page = y >> 3
            let shift_page = y % 8                                  //calculate the page to write to
            let ind = x + page * 128 + 1                            //calculate which register in the page to write to.
            let screenPixel = (screenBuf[ind] | (1 << shift_page))  //set the screen data byte
            screenBuf[ind] = screenPixel                            //store data in screen buffer
        }
    
        export function clear(screen?: number) {
            displayAddress = setScreenAddr(screen)
            if (initalised == 0) {
                initDisplay(1)
            }
    
            screenBuf.fill(0)       //fill the screenBuf with 0
            screenBuf[0] = 0x40
            set_pos()               //set position to the start of the screen
            pins.i2cWriteBuffer(displayAddress, screenBuf)  //write clear buffer to the screen
        }
    
        export function clearbuffer() {
            screenBuf.fill(0)       //fill the screenBuf with 0
            screenBuf[0] = 0x40
            set_pos()               //set position to the start of the screen
        }
    
        export function refresh(screen?: 1) {
            displayAddress = setScreenAddr(screen)
            if (initalised == 0) {
                initDisplay(1)
            }
            set_pos()
            pins.i2cWriteBuffer(displayAddress, screenBuf)
        }
     */
}