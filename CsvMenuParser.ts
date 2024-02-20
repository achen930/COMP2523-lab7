import { IWritable } from "./Interfaces";
import { readFile } from "node:fs/promises";
import { EOL } from "node:os";
import { HtmlWriter } from "./HtmlWriter";
import { basename, extname } from "node:path";
import { TextWriter } from "./TextWriter";

class CsvMenuParser {
    
    private _csvData: string[] = [];
    private _basename: string = "";

    private constructor(data: string[], basename: string) {
        this._csvData = data;
        this._basename = basename;
    }

    static async buildMenu(filename: string) {
        const data = await readFile(filename, "utf8");
        return new CsvMenuParser(data.split(EOL), basename(filename, extname(filename)));
    }

    get csvData(): string[] {
        return this._csvData;
    }

    get basename(): string {
        return this._basename;
    }

    public async writeMenu(writer: IWritable) {
        try {
            await writer.formatAndWrite(this.basename, this.csvData);
            console.log("Wrote to file");
        } catch (err) {
            console.log(err);
        }
    }
}

async function main() {
    const menu = await CsvMenuParser.buildMenu("menu.csv");
    menu.writeMenu(new HtmlWriter());
    console.log(menu.csvData);
    menu.writeMenu(new TextWriter());
}

main();