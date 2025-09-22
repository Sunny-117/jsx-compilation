let t = {
  type: "",
  value: ""
};
const n = /[a-z0-9]/;
let f = [];
function r(e) {
  t = {
    type: "",
    value: ""
  }, f.push(e);
}
function P(e) {
  // Reset global state to prevent token accumulation
  f = [];
  t = { type: "", value: "" };

  let i = w;
  for (const E of e)
    i && (i = i(E));
  return f;
}
function w(e) {
  if (e === "<")
    return r({
      type: "LeftParentheses",
      value: "<"
    }), u;
  throw new Error("第一个字符必须是<");
}
function u(e) {
  if (n.test(e))
    return t.type = "JSXIdentifier", t.value += e, o;
  if (e === "/")
    return r({
      type: "BackSlash",
      value: "/"
    }), u;
  throw new Error("Error");
}
function o(e) {
  if (n.test(e))
    return t.value += e, o;
  if (e === " ")
    return r(t), s;
  if (e === ">")
    return r(t), r({
      type: "RightParentheses",
      value: ">"
    }), y;
  throw new Error("Error");
}
function s(e) {
  if (n.test(e))
    return t.type = "AttributeKey", t.value += e, l;
  if (e === "=")
    return r(t), a;
  throw new Error("Error");
}
function l(e) {
  if (n.test(e))
    return t.value += e, l;
  if (e === "=")
    return r(t), a;
  throw new TypeError("Error");
}
function a(e) {
  if (e === '"')
    return t.type = "AttributeStringValue", t.value = "", v;
}
function v(e) {
  if (n.test(e))
    return t.value += e, v;
  if (e === '"')
    return r(t), b;
}
function b(e) {
  if (e === " ")
    return s;
  if (e === ">")
    return r({
      type: "RightParentheses",
      value: ">"
    }), y;
  throw new Error("Error");
}
function y(e) {
  return e === "<" ? (r({
    type: "LeftParentheses",
    value: "<"
  }), u) : (t.type = "JSXText", t.value += e, p);
}
function p(e) {
  return e === "<" ? (r(t), r({
    type: "LeftParentheses",
    value: "<"
  }), u) : (t.value += e, p);
}
export {
  P as tokenizer
};
