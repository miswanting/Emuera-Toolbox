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
= key:[^:\n\r]+ [ \t]* ':' [ \t]* value:Value [\r?\n]? { return { type: 'Config', key: key.join(''), value: value } }
Value
= Bool
/ Interger
/ Array
/ String
/ Null
Bool
= ('yes'i/'no'i) ![a-zA-Z]+ {
  let v = text().toLowerCase()
  if ( v==='yes' ) { v = true }
  else if ( v==='no' ) { v = false }
  return { type: 'Value', vType: 'Bool', value: v }
}
String
= [^,\n\r]+ { return { type: 'Value', vType: 'String', value: text() } }
Null
= [ \t]* { return { type: 'Value', vType: 'Null', value: null } }
Array
= Interger ',' Array {
  
  return { type: 'Value', vType: 'Array', value: [] }
}
/ Interger
Interger
= [0-9]+ !','+ { return { type: 'Value', vType: 'Interger', value: parseInt(text()) } }