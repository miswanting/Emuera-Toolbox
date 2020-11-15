File
= Block*
Block
= BlankLines
/ Comment
/ Function
BlankLines
= bl:[ \n\t\r]+ [\r?\n]? {
  const v = bl.reduce((n,char)=>{return n+(char==='\n'?1:0)}, 0)
  return { type: 'BlankLines', value: v }
}
Comment
= ';' comment:[^\n\r]* [\r?\n]? { return { type: 'Comment', value: comment.join('') } }
_
= [ \t]
Function
= '@' _* name:[^ \n\t\r]+ _* (';' comment:[^\n\r]* _*)? [\r?\n] statement:Statement* { return { type: 'Function', name:name.join('').toLowerCase(), content:statement} }
Statement
= BlankLines
/ Comment
/ statement:([^@] [^\n\r]+) [\r?\n]? {return {type:'Statement', content:statement[0]+statement[1].join('')}}