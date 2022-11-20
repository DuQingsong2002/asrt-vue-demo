
import { test } from "vitest";
import { getLCS } from "../lib/util/lcs";

test('权重计算', () => {

    // const result = _computeWeightList(['xi1', 'an1'], [ ['xi1'], ['an1']])
    // console.debug('result', result)

    const result = getLCS(['xia1', 'an1', 'ce4'], [ ['xi1', 'xi4'], ['an1'], ['ce4']])
    const result2 = getLCS(['西', '西', '6', '安'], [ ['西', '安'], ['安']])
    console.log('result', result)
    console.log('result', result2)
    
})