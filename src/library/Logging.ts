const chalk = import('chalk').then((m) => m.default);

export default class Logging {
  public static info = async (args: any) =>
    console.log(
      (await chalk).blue(
        `[${new Date().toLocaleString()}] [INFO]`,
        typeof args === 'string' ? (await chalk).blueBright(args) : args,
      ),
    );

  public static warn = async (args: any) =>
    console.log(
      (await chalk).yellow(
        `[${new Date().toLocaleString()}] [INFO]`,
        typeof args === 'string' ? (await chalk).yellowBright(args) : args,
      ),
    );

  public static error = async (args: any) =>
    console.log(
      (await chalk).red(
        `[${new Date().toLocaleString()}] [INFO]`,
        typeof args === 'string' ? (await chalk).redBright(args) : args,
      ),
    );
}
