import dispatch from "../dispatch";
import inspectCollapsed from "./collapsed";
import inspectExpanded from "./expanded";
import formatDate from "./formatDate";
import formatError from "./formatError";
import formatRegExp from "./formatRegExp";
import formatString from "./formatString";
import formatSymbol from "./formatSymbol";
import inspectFunction from "./inspectFunction";

var objectToString = Object.prototype.toString;

export default function inspect(value, shallow, expand) {
  var type = typeof value;
  switch (type) {
    case "boolean":
    case "number":
    case "undefined": { value += ""; break; }
    case "string": { value = formatString(value, shallow === false); break; }
    case "symbol": { value = formatSymbol(value); break; }
    case "function": { return inspectFunction(value); }
    default: {
      if (value === null) { type = null, value = "null"; break; }
      if (value instanceof Date) { type = "date", value = formatDate(value); break; }
      switch (objectToString.call(value)) { // TODO Symbol.toStringTag?
        case "[object RegExp]": { type = "regexp", value = formatRegExp(value); break; }
        case "[object Error]": // https://github.com/lodash/lodash/blob/master/isError.js#L26
        case "[object DOMException]": { type = "error", value = formatError(value); break; }
        default: return (expand ? inspectExpanded : inspectCollapsed)(value, shallow);
      }
      break;
    }
  }
  var span = document.createElement("span");
  span.className = `O--${type}`;
  span.textContent = value;
  return span;
}

export function replace(spanOld, spanNew) {
  if (spanOld.classList.contains("O--inspect")) spanNew.classList.add("O--inspect");
  spanOld.parentNode.replaceChild(spanNew, spanOld);
  dispatch(spanNew, "load");
}
