import fs from "fs";
import p from "path";
import axios from "axios";

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

    public static async downloadImage (url: string, path: string) : Promise<void> {          
        const writer = fs.createWriteStream(path);
      
        const response = await axios({
          url,
          method: 'GET',
          responseType: 'stream'
        });
      
        response.data.pipe(writer)
      
        return new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
      }
}