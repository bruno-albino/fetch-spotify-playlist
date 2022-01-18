import path from 'path'

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const downloadPath = path.resolve('./download');
