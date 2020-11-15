File
= Block*
Block
= BlankLines
/ Comment
/ Dim
/ Dims
/ Define
BlankLines
= bl:[ \n\t\r]+ [\r?\n]? {
  const v = bl.reduce((n,char)=>{return n+(char==='\n'?1:0)}, 0)
  return { type: 'BlankLines', value: v }
}
Comment
= ';' comment:[^\n\r]* [\r?\n]? { return { type: 'Comment', value: comment.join('') } }
Dim '定义全局变量（数值）'
= '#dim'i _+ keyword:(ErhKeyWord _+)? name:[^ ,;=\n\t\r]+ _* length1:( ',' _* Length _* )? length2:( ',' _* Length _* )? length3:( ',' _* Length _* )? value:( '=' _* Value _* )? comment:Comment? [\r?\n]? {
  return { type: 'Dim', dimType:keyword?keyword[0].toLowerCase():null, name:name.join(''), length1:length1?length1[2]:null, length2:length2?length2[2]:null, length3:length3?length3[2]:null, value:value?value[2].trim():null, comment:comment }
}
Dims '定义全局变量（字符串）'
= '#dims'i _+ keyword:(ErhKeyWord _+)? name:[^ ,;=\n\t\r]+ _* length1:( ',' _* Length _* )? length2:( ',' _* Length _* )? length3:( ',' _* Length _* )? value:( '=' _* Value _* )? comment:Comment? [\r?\n]? {
  return { type: 'Dims', dimType:keyword?keyword[0].toLowerCase():null, name:name.join(''), length1:length1?length1[2]:null, length2:length2?length2[2]:null, length3:length3?length3[2]:null, value:value?value[2].trim():null, comment:comment }
}
Define '定义全局宏'
= '#define'i _+ name:[^ ,=\n\t\r]+ _+ value:Value [\r?\n]? { return {type: 'Define', name:name.join(''), value:value} }
ErhKeyWord
= 'const'i / 'global'i / 'savedata'i / 'ref'i / 'dynamic'i / 'charadata'i
Length
= [^ ,;=\n\t\r]+ { return text() }
Value
= [^,;=\n\r]+ { return text() }
_
= [ \t]