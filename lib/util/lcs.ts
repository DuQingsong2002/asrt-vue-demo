/**
 * @link https://www.bilibili.com/video/BV1S5411E7pd/?spm_id_from=333.337.search-card.all.click&vd_source=e1b17cec6113daca71fa419fff1f6fd5
 * @link https://blog.csdn.net/qq_25800311/article/details/81607168
 * @param speechs 
 * @param probSpeechs 
 * @returns 
 */
export function getLCS(speechs: string[], probSpeechs: string[][]) {
    
    const record: number[][] = new Array(speechs.length).fill(Array.from(new Array(probSpeechs.length), () => 0))
    
	let maxLen = 0, maxEnd = 0;

	for(let i = 0; i < speechs.length; ++i) {
		for (let j = 0; j < probSpeechs.length; ++j) {

			if (probSpeechs[j].includes(speechs[i])) {
				if (i == 0 || j == 0) {
					record[i][j] = 1;
				} else {
					record[i][j] = record[i - 1][j - 1] + 1;
				}
			}
 
			if (record[i][j] > maxLen) {
				maxLen = record[i][j];
				maxEnd = i;
			}
		}
    }

	return { maxLen, maxEnd };
}
