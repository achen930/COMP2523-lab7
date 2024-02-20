export interface IWritable {
    formatAndWrite(filePath: string, content: string[]): Promise<void>;
}

export interface Menu {
    [key: string]: string[][];
}