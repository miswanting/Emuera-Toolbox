File
= lines:Line* { return { type: 'File', children: lines } }
Line
= fb:[ \t]* 'Print 'i value:[^\r\n]* '\r'? '\n' { return { type: 'Print', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintV 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintV', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintS 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintS', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintForm 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintForm', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormS 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormS', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintVK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintVK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormSK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormSK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintD', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintVD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintVD', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSD', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormD', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormSD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormSD', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintVL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintVL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormSL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormSL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintKL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintKL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintVKL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintVKL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSKL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSKL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormKL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormKL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormSKL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormSKL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintDL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintDL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintVDL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintVDL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSDL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSDL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormDL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormDL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormSDL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormSDL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintVW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintVW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormSW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormSW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintKW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintKW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintVKW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintVKW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSKW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSKW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormKW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormKW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormSKW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormSKW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintDW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintDW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintVDW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintVDW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSDW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSDW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormDW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormDW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormSDW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormSDW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingle 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingle', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleV 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleV', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleS 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleS', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleForm 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleForm', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleFormS 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleFormS', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleVK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleVK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleSK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleSK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleFormK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleFormK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleFormSK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleFormSK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleD', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleVD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleVD', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleSD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleSD', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleFormD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleFormD', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintSingleFormSD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintSingleFormSD', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintC 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintC', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintLC 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintLC', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormC 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormC', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormLC 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormLC', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintCK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintCK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintLCK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintLCK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormCK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormCK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormLCK 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormLCK', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintCD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintCD', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintLCD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintLCD', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormCD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormCD', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormLCD 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormLCD', text: value.join(''), fb: fb.join('') } }

/ fb:[ \t]* 'DataForm 'i value:[^\r\n]* '\r'? '\n' { return { type: 'DataForm', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormL', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintFormW 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintFormW', text: value.join(''), fb: fb.join('') } }
/ fb:[ \t]* 'PrintL 'i value:[^\r\n]* '\r'? '\n' { return { type: 'PrintL', text: value.join(''), fb: fb.join('') } }
/ value:[^\r\n]* '\r'? '\n' { return { type: 'Raw', text: value.join('') } }
