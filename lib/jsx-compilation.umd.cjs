(function(n,t){typeof exports=="object"&&typeof module<"u"?t(exports):typeof define=="function"&&define.amd?define(["exports"],t):(n=typeof globalThis<"u"?globalThis:n||self,t(n["jsx-compile"]={}))})(this,function(n){"use strict";let t={type:"",value:""};const u=/[a-z0-9]/;let f=[];function r(e){t={type:"",value:""},f.push(e)}function E(e){let o=w;for(const T of e)o&&(o=o(T));return f}function w(e){if(e==="<")return r({type:"LeftParentheses",value:"<"}),i;throw new Error("第一个字符必须是<")}function i(e){if(u.test(e))return t.type="JSXIdentifier",t.value+=e,s;if(e==="/")return r({type:"BackSlash",value:"/"}),i;throw new Error("Error")}function s(e){if(u.test(e))return t.value+=e,s;if(e===" ")return r(t),l;if(e===">")return r(t),r({type:"RightParentheses",value:">"}),v;throw new Error("Error")}function l(e){if(u.test(e))return t.type="AttributeKey",t.value+=e,a;if(e==="=")return r(t),p;throw new Error("Error")}function a(e){if(u.test(e))return t.value+=e,a;if(e==="=")return r(t),p;throw new TypeError("Error")}function p(e){if(e==='"')return t.type="AttributeStringValue",t.value="",y}function y(e){if(u.test(e))return t.value+=e,y;if(e==='"')return r(t),b}function b(e){if(e===" ")return l;if(e===">")return r({type:"RightParentheses",value:">"}),v;throw new Error("Error")}function v(e){return e==="<"?(r({type:"LeftParentheses",value:"<"}),i):(t.type="JSXText",t.value+=e,d)}function d(e){return e==="<"?(r(t),r({type:"LeftParentheses",value:"<"}),i):(t.value+=e,d)}n.tokenizer=E,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})});
