
namespace oled {

    // ========== blockId=oled_ === für pADDR.shadow="oled_eADDR_OLED"

    export enum eADDR_OLED { OLED_16x8_x3C = 0x3C, OLED_16x8_x3D = 0x3D }
    //% blockId=oled_eADDR_OLED block="%pADDR" blockHidden=true
    export function oled_eADDR_OLED(pADDR: eADDR_OLED): number { return pADDR }

    export enum eADDR_EEPROM { EEPROM_x50 = 0x50 }
    //% blockId=oled_eADDR_EEPROM block="%pADDR" blockHidden=true
    export function oled_eADDR_EEPROM(pADDR: eADDR_EEPROM): number { return pADDR }

    export enum eEEPROM_Startadresse {
        //% block="F800 Standard Zeichensatz"
        F800 = 0xF800,
        //% block="F000 zweiter Zeichensatz"
        F000 = 0xF000,
        //% block="F400 Grafikzeichen"
        F400 = 0xF400,
        //% block="FC00 Sonderzeichen"
        FC00 = 0xFC00,
        //% block="EC00 5x5 Zeichensatz"
        EC00 = 0xEC00
    }
    //% blockId=oled_eEEPROM_Startadresse block="%p" blockHidden=true
    export function oled_eEEPROM_Startadresse(p: eEEPROM_Startadresse): number { return p }

    //% blockId=oled_text block="%s" blockHidden=true
    export function oled_text(s: string): string { return s }


    // ========== i2c Register

    export enum eCONTROL { // Co Continuation bit(7); D/C# Data/Command Selection bit(6); following by six "0"s
        // CONTROL ist immer das 1. Byte im Buffer
        x00_xCom = 0x00, // im selben Buffer folgen nur Command Bytes ohne CONTROL dazwischen
        x80_1Com = 0x80, // im selben Buffer nach jedem Command ein neues CONTROL [0x00 | 0x80 | 0x40]
        x40_Data = 0x40  // im selben Buffer folgen nur Display-Data Bytes ohne CONTROL dazwischen
    }

    export enum eCommand {
        A0_SEGMENT_REMAP = 0xA0, // column address 0 is mapped to SEG0 (RESET) // using 0xA0 will flip screen
        A1_SEGMENT_REMAP = 0xA1, // column address 127 is mapped to SEG0
        A4_ENTIRE_DISPLAY_ON = 0xA4,
        A5_RAM_CONTENT_DISPLAY = 0xA5,
        A6_NORMAL_DISPLAY = 0xA6, // invert Hintergrund schwarz
        A7_INVERT_DISPLAY = 0xA7, // invert Hintergrund leuchtet
        AE_DISPLAY_OFF = 0xAE,
        AF_DISPLAY_ON = 0xAF,
        C0_COM_SCAN_INC = 0xC0, // COM Output Scan Direction
        C8_COM_SCAN_DEC = 0xC8, // remapped mode Scan from COM[N-1] to COM0
    }

    export enum eDisplayCommand {
        //% block="AF AE Set Display ON/OFF"
        ON,
        //% block="A7 A6 Set Normal/Inverse Display"
        INVERS,
        //% block="A0 A1 Set Segment Remap"
        FLIP,
        //% block="C0 C8 Set COM Output Scan Direction"
        REMAP,
        //% block="A4 A5 Entire Display"
        ENTIRE_ON
    }


    // ==========

    export enum eZeichenDrehen {
        //%block="nicht drehen"
        nicht,
        //%block="nach links drehen"
        links,
        //%block="nach rechts drehen"
        rechts,
        //%block="spiegeln"
        spiegeln
    }

    export enum eAlign {
        //% block="linksbündig"
        links,
        //% block="rechtsbündig"
        rechts
    }

} // oledenums.ts
