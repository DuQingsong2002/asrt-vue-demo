import { resolveAll, resolveCommandParams } from "./command/command-resolve";
import { registerCommand, registerCommandParams, useAsrtDict } from "./command/command";
import { createASRTRequestData, asrtDictTextToDict } from "./util/asrt-util";

export const globalOptions = {
  weightLevel: [ 5, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5 ]
}

export { resolveAll, registerCommand, registerCommandParams, useAsrtDict, asrtDictTextToDict, createASRTRequestData, resolveCommandParams }