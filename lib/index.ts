import { resolveAll, resolveCommandParams } from "./command/command-resolve";
import { registerCommand, registerCommandParams, useAsrtDict } from "./command/command";
import { createASRTRequestData, asrtDictTextToDict } from "./util/asrt-util";

export const globalOptions = {
  weightLevel: [ 4, 3, 1.5, 1.0, 0.5 ]
}

export { resolveAll, registerCommand, registerCommandParams, useAsrtDict, asrtDictTextToDict, createASRTRequestData, resolveCommandParams }