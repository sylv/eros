import { builtin } from "../builtin.js";
import { NodeType } from "../constants.js";

/**
 * Used to execute an AST/"tree".
 */
export class Interpreter {
  constructor() {
    this.tags = new Map();
    this.registerTags(builtin);
  }

  /**
   * Interpret the given node and return the output str.
   * @param {Object} node The node to start with from a Lexer instance.
   * @throws if a tag throws.
   */
  async interpret(node) {
    let buffer = "";
    switch (node.type) {
      case NodeType.TEXT:
        buffer += node.text;
        if (node.children[0]) {
          const output = await this.iterate(node.children);
          buffer += output.join("");
        }

        break;
      case NodeType.CALL:
        const name = node.text.toLowerCase().trim();
        const tag = this.tags.get(name);
        if (!tag) throw new Error(`Cannot find tag with the name "${name}"`);
        const args = await this.iterate(node.children);
        const output = await tag(...args);
        if (output !== undefined) buffer += output.trim();
        break;
      default:
        throw new TypeError(`Unknown node type "${node.type}"`);
    }

    return buffer;
  }

  /**
   * Register a tag with the interpreter. Tag can be async.
   * @param {string} name The name of the tag
   * @param {Function} func The tag itself.
   */
  registerTag(name, func) {
    this.tags.set(name.toLowerCase().trim(), func);
  }

  /**
   * Register multiple tags with the interpreter as an object.
   * @param {Object} obj An object with keys being the tag names and values being the tags themselves.
   */
  registerTags(obj) {
    for (const key in obj) {
      this.registerTag(key, obj[key]);
    }
  }

  /**
   * Iterate over an array of nodes and run this.interpret on each, returning an array of the outputs.
   * @private
   */
  async iterate(nodes) {
    if (!nodes[0]) return [];
    const output = [];
    for (const node of nodes) {
      output.push(await this.interpret(node));
    }

    return output;
  }
}
