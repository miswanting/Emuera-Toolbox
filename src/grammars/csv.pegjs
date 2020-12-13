File
= Block*
Block
= BlankLines
/ Comment
/ array:Array { return { type: 'Array', value: array } }
BlankLines
= bl:[ \n\t\r]+ [\r?\n]? {
  const v = bl.reduce((n,char)=>{return n+(char==='\n'?1:0)}, 0)
  return { type: 'BlankLines', value: v }
}
Comment
= ';' comment:[^\n\r]* [\r?\n]? { return { type: 'Comment', value: comment.join('') } }
Array
= now:Value ',' next:NextArray  { return [now, ...next] }
/ now:Value comment:InlineComment [\r?\n]? { return [now, comment] }
NextArray
= now:Value ',' next:NextArray { return [now, ...next] }
/ now:Value comment:InlineComment [\r?\n]? { return [now, comment] }
/ now:Value { return [now] }

Value
= [0-9]+ { return { type: 'int', value: parseInt(text()) } }
/ [^ ,;\n\t\r]+ { return { type: 'str', value: text() } }
/ '' { return { type: 'null', value: null } }
InlineComment
= ';' comment:[^\n\r]* { return { type: 'Comment', value: comment.join('') } }