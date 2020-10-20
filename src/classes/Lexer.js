import { Chars, NodeType } from "../constants.js";

/**
 * Converts a string to an AST/"tree"
 */
export class Lexer {
  constructor(script) {
    this.position = 0;
    this.script = script;
    this.current = this.createNode(NodeType.TEXT);
  }

  /**
   * Parse the script into a tree used with the interpreter.
   */
  parse() {
    const length = this.script.length;
    const bail = (char) => {
      if (this.current.children[0]) this.down(NodeType.TEXT);
      this.current.text += char;
    };

    while (this.position < length) {
      const char = this.script[this.position];

      switch (char) {
        case Chars.TAG_OPEN:
          this.down(NodeType.CALL);
          break;
        case Chars.TAG_SEP:
          const argParent = this.findParent(NodeType.CALL);
          if (!argParent) bail(char);
          else {
            this.current = argParent;
            this.down(NodeType.TEXT);
          }

          break;
        case Chars.TAG_CLOSE:
          const closeParent = this.findParent(NodeType.CALL);
          if (!closeParent) bail(char);
          else this.current = closeParent.parent;
          break;
        default:
          bail(char);
      }

      this.position += 1;
    }

    while (this.current.parent) this.current = this.current.parent;
    return this.current;
  }

  /**
   * Go down in the tree.
   * @param {NodeType} type The type of node to create when moving down.
   * @private
   */
  down(type) {
    const node = this.createNode(type);
    node.parent = this.current;
    this.current.children.push(node);
    this.current = node;
  }

  /**
   * Go up in the tree.
   * @private
   */
  up() {
    if (!this.current.parent) throw new TypeError("Cannot move to non-existent parent node");
    this.current = this.current.parent;
  }

  /**
   * Find a parent node with the given type. Returns undefined if none exist.
   * @param {NodeType} type The type of node to look for
   * @private
   */
  findParent(type) {
    let curr = this.current;
    while (curr.type !== type && curr.parent) {
      curr = curr.parent;
    }

    if (curr.type !== type) return;
    return curr;
  }

  /**
   * Create a new node.
   * @param {*} type The type of the node
   * @private
   */
  createNode(type) {
    return {
      type: type,
      children: [],
      text: "",
    };
  }
}
