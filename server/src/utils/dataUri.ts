import DataURIParser from 'datauri/parser';
import path from 'path';

type File = {
  originalname: string;
  buffer: Buffer;
};

const getDataUri = (file: File) => {
  const parser = new DataURIParser();

  const extName = path.extname(file.originalname).toString();

  return parser.format(extName, file.buffer).content;
};

export default getDataUri;
