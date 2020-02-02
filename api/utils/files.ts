import fs from "fs";
import p from "path";

export default class Files {
    public static writeFile(path: string, data: any) : void {
        fs.mkdir(p.dirname(path), { recursive: true }, () => {
            fs.writeFile(path, data, () => {
                console.log("File has been saved! Path:" + path);
            });    
        })
    }

    public static readFile(path: string) : string {
        return fs.readFileSync(path).toString();
    }
}