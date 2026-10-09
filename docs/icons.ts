// Icons the showcase uses on top of the built-in ones. Material Symbols files are picked by name straight from
// the package; defineIcons registers them under their file names.
export const docsIcons = import.meta.glob<string>(
  "../node_modules/@material-symbols/svg-400/rounded/{touch_app,interests,notifications,monitoring,code,delete,rocket_launch,dashboard,add,favorite,download}.svg",
  { query: "?raw", import: "default", eager: true },
);
