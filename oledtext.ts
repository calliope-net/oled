
namespace oled
/*
*/ {


    // ========== group="Text // Kommentar" subcategory=Text

    //% group="Text" subcategory=Text
    //% block="kehre %pText um" weight=4
    //% pText.shadow="oled_text"
    export function kehreum(pText: any): string {
        let text: string = convertToText(pText)
        let r: string = ""
        for (let j = 0; j < text.length; j++)
            r = text.charAt(j) + r
        return r
    }

    //% group="Kommentar" subcategory=Text
    //% block="// %text"
    export function comment(text: string): void { }


} // oledtext.ts
