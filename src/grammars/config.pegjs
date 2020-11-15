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
= 'yes'i { return { type: 'Bool', value: true } }
/ 'no'i [^a-z]i { return { type: 'Bool', value: false } }
/ array:Array { return { type: 'Array', value:array } }
/ Interger
/ [^,\n\r]+ { return { type: 'Str', value: text() } }
/ '' { return { type: 'Null', value: null } }
Interger
= [0-9]+ { return { type: 'Int', value: parseInt(text()) } }
Array
= now:Interger next:(',' Interger)+ { return [now, ...next.map(n=>{return n[1]})] }
// now:Interger [^,] { return [now] }