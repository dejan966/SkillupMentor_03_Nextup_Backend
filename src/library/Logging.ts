import moment from "moment";

const chalk = import("chalk").then((m) => m.default);
var momentDate = moment();
momentDate.locale("sl");
const date = momentDate.format("L, LTS");

export default class Logging {
  public static info = async (args: any) =>
    console.log(
      (await chalk).blue(
        `[${date}] [INFO]`,
        typeof args === "string" ? (await chalk).blueBright(args) : args,
      ),
    );

  public static warn = async (args: any) =>
    console.log(
      (await chalk).yellow(
        `[${date}] [INFO]`,
        typeof args === "string" ? (await chalk).yellowBright(args) : args,
      ),
    );

  public static error = async (args: any) =>
    console.log(
      (await chalk).red(
        `[${date}] [INFO]`,
        typeof args === "string" ? (await chalk).redBright(args) : args,
      ),
    );
}
