import { Interpreter } from "../classes/Interpreter.js";
import { Lexer } from "../classes/Lexer.js";

export const runInterpreter = new Interpreter();

/**
 * A helper function that hides some of the unnecessary shit and just lets you run scripts.
 * @param {string} script
 */
export async function run(script) {
  const lexer = new Lexer(script);
  const tree = lexer.parse();
  return await runInterpreter.interpret(tree);
}
