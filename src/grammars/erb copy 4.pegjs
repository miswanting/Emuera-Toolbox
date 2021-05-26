// File Structure //
File
= lines:Line* { return { type: 'File', children: lines } }
Line
= ';' comment:[^\r\n]* '\r'? '\n' { return { type: 'Comment', data: comment.join('') } }
/ fff:[ \t]* value:Cmd '\r'? '\n' { return { type: 'Others', data: value, fff: fff.join('') } }
Cmd
= 'dataform 'i value:[^\r\n]* { return { type: 'Dataform', data: value.join('') } }
/ value:[^\r\n]* { return { type: 'Cmd', data: value.join('') } }