import { writeFile } from "node:fs/promises";
import { IWritable, Menu } from "./Interfaces";
import { EOL } from "node:os";

export class TextWriter implements IWritable {

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
                
                itemContentString = itemContentString + `${menuItem[3]} ${menuItem[1]} ${menuItem[2]} ${EOL}`
            }

            mealType = mealType[0].toUpperCase() + mealType.substring(1);

            formattedMenu = formattedMenu + `* ${mealType} * ${EOL}${itemContentString} ${EOL}`
        })

        return formattedMenu;
    }

        private async _write(basename: string, content: string) {
        return await writeFile(`${basename}.txt`, content);
    }

    async formatAndWrite(basename: string, content: string[]) {
        const newContent = this._format(content);
        return await this._write(basename, newContent);
    }
}