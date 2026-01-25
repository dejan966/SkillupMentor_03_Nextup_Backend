const FileType = import("file-type");
import fs from "fs";
import Logging from "../library/Logging";
import { diskStorage, Options } from "multer";
import { extname } from "path";
import { randomUUID } from "crypto";

type validFileExtensionsType = "png" | "jpg" | "jpeg";
type validMimeType = "image/png" | "image/jpg" | "image/jpeg";

const validFileExtensions: validFileExtensionsType[] = ["png", "jpg", "jpeg"];
const validMimeTypes: validMimeType[] = ["image/png", "image/jpg", "image/jpeg"];

/* export const saveAvatarToStorage: Options = {
  storage: diskStorage({
    destination: "./uploads/avatars",
    filename(_req, file, callback) {
      // Create unique suffix
      const uniqueSuffix = randomUUID();
      // Get file extension
      const ext = extname(file.originalname);
      // Write filename
      const filename = `${uniqueSuffix}${ext}`;

      callback(null, filename);
    },
  }),
  fileFilter(_req, file, callback) {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype as validMimeType)
      ? callback(null, true)
      : callback(null, false);
  },
};

export const saveEventImageToStorage: Options = {
  storage: diskStorage({
    destination: "./uploads/events",
    filename(_req, file, callback) {
      // Create unique suffix
      const uniqueSuffix = randomUUID();
      // Get file extension
      const ext = extname(file.originalname);
      // Write filename
      const filename = `${uniqueSuffix}${ext}`;

      callback(null, filename);
    },
  }),
  fileFilter(_req, file, callback) {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype as validMimeType)
      ? callback(null, true)
      : callback(null, false);
  },
};

export const isFileExtensionSafe = async (fullFilePath: string): Promise<boolean> => {
  return (await FileType).fileTypeFromFile(fullFilePath).then((fileExtensionAndMimeType) => {
    if (!fileExtensionAndMimeType?.ext) return false;

    const isFileTypeLegit = validFileExtensions.includes(
      fileExtensionAndMimeType.ext as validFileExtensionsType,
    );
    const isMimeTypeLegit = validMimeTypes.includes(
      fileExtensionAndMimeType.mime as validMimeType,
    );
    const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
    return isFileLegit;
  });
};
export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (error) {
    Logging.error(error);
  }
}; */
