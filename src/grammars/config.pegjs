File
= Block*
Block
= BlankLines
/ Comment
/ Config
BlankLines
= bl:[ \n\t\r]+ [\r?\n]? {
  const v = bl.reduce((n,char)=>{return n+(char==='\n'?1:0)}, 0)
  return { type: 'BlankLines', value: v }
}
Comment
= ';' comment:[^\n\r]* [\r?\n]? { return { type: 'Comment', value: comment.join('') } }
Config
= [ \t]* name:[^: \n\t\r]+ [ \t]* ':' [ \t]* value:Value [ \t]* [\r?\n]? { return { type:'Config', name:name.join(''), value: value } }
Value
= 'yes'i { return { type: 'bool', value: true } }
/ 'no'i [^a-z]i { return { type: 'bool', value: false } }
/ Array
/ Interger
/ [^,\n\r]+ { return { type: 'str', value: text() } }
/ '' { return { type: 'null', value: null } }
Interger
= [0-9]+ { return { type: 'int', value: parseInt(text()) } }
Array
= now:Interger ',' next:Array { return [now, ...next] }
/ now:Interger [^,] { return [now] }