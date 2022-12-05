import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util'
import fetch from 'node-fetch';
export async function fetchXml(url: string, dir: any) {
    const streamPipeline = promisify(pipeline);
    const res = await fetch(url);
    if (!res.ok) {
        return false
    }
    await streamPipeline(res.body, createWriteStream(dir + '/excel.xlsx'));
    return true;
}