import module_derive from "./derive";
import module_variable from "./variable";

export default function Module(runtime) {
  this._runtime = runtime;
  this._scope = new Map;
}

Module.prototype.derive = module_derive;
Module.prototype.variable = module_variable;
