import { writeFile } from "node:fs/promises";
import { IWritable, Menu } from "./Interfaces"
import { EOL } from "node:os";

export class HtmlWriter implements IWritable {

    private _format(contents: string[]) {
        
        let menuObj: Menu = {};

        const menuItem = contents.forEach((content) => {
            const menuItemContents = content.split(",");
            const mealType = menuItemContents[0];

            if (mealType in menuObj) {

                menuObj[mealType].push(menuItemContents);
            } else {
                menuObj[mealType] = [];
                menuObj[mealType].push(menuItemContents);
            }
            menuObj[mealType].sort();
        });

        let formattedMenu = "";
        
        Object.keys(menuObj).forEach((mealType) => {
            
            let itemContentString = "";
            for (const item in (menuObj[mealType])) {
                let menuItem = menuObj[mealType][item];
                
                itemContentString = itemContentString + `<tr><td>${menuItem[3]}</td> <td>${menuItem[1]}</td> <td>${menuItem[2]}</td></tr>`
            }

            mealType = mealType[0].toUpperCase() + mealType.substring(1);

            formattedMenu = formattedMenu + `<th>* ${mealType} *</th> <tr>${itemContentString}</tr>`
        })

        return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Menu</title>
            </head>
            <body>
                <table>
                ${formattedMenu}
                </table>
            </body>
            </html>
        `
    }

    private async _write(basename: string, content: string) {
        return await writeFile(`${basename}.html`, content);
    }

    async formatAndWrite(basename: string, content: string[]) {
        const newContent = this._format(content)
        return await this._write(basename, newContent);
    }
}