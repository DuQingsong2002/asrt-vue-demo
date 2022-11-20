import { beforeAll } from "vitest";
import { test } from "vitest";
import { registerCommandParams, resolveCommandParams, useAsrtDict } from "../lib";
import {dictText} from './../src/util/dictText'

beforeAll(() => {

    useAsrtDict(dictText)
    registerCommandParams('target', '西安')
})

test('权重测试', () => {
    const result = resolveCommandParams('target', ['xi1', 'an1'], ['西', '安'])
    console.log('result', result)
})