# eros

A shitty placeholder replacer made mostly for a free shirt

### simple usage

```js
import { run, runInterpreter } from "...";
// runInterpreter is an instance of Interpreter that is used by run(), you can register extra tags with it if you want
const output = await run(`{choose;femboys;catgirls}`);
console.log({ output });
```

### advanced usage

```js
import { Interpreter, Lexer } from "...";
import fetch from "node-fetch";

// interpreter can be reused
const interpreter = new Interpreter();
interpreter.registerTags({
  // note: this is an example and is a very bad idea to do server-side on an untrusted users behalf.
  http: (url) => fetch(url).then((r) => r.text()),
});

// lexer should not be reused as it is stateful
const lexer = new Lexer(script);
const script = `Your IP is {http;http://icanhazip.com/}`;
const tree = lexer.parse();
const output = await interpreter.interpret(tree);
console.log({ output }); // "Your IP is 173.245.48.69"
```
