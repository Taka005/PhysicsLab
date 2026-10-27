export class ScriptSyntaxError extends Error {
  constructor(
    message: string,
    public readonly line: number,
    public readonly column: number,
  ) {
    super(message);
    this.name = "ScriptSyntaxError";
  }
}