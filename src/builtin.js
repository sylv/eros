export const builtin = {
  choose: (...args) => args[Math.floor(Math.random() * args.length)],
  lower: (text) => text.toLowerCase(),
  upper: (text) => text.toUpperCase(),
  length: (text) => text.length,
  note: () => "",
};
