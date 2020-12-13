// File Structure //
File
= blocks:Block* { return { type: 'File', children: blocks } }
Block
= BlankLines
/ Comment
/ FunctionDefinition

// Tools //
BlankLines
= bl:[ \n\t\r]+ LB? {
  const v = bl.reduce((n,char)=>{return n+(char==='\n'?1:0)}, 0)
  return { type: 'BlankLines', value: v }
}
Comment
= ';' comment:[^\n\r]* LB? { return { type: 'Comment', value: comment.join('') } }
N_
= [^ \n\t\r]
LB '换行'
= '\r'? '\n'
_ '空字符'
= [ \t]

// Functions //
FunctionDefinition '函数定义'
= '@' name:[^ ,(\n\t\r]+ (',' _* [^ ,\n\t\r]+)* _* LB? children:BlockInFunction* { return { type:'Function', name:name.join(''), children:children } }
FunctionInExpressionDefinition '表达式内函数定义'
= '@' name:[^ ,(\n\t\r]+ ('(' [^)\n\t\r] ')')? LB '#function'i LB children:BlockInFunction* { return { type:'FunctionInExpression', name:name.join('') } }

// Statements //

// Expressions //
BlockInFunction
= BlankLines
/ Comment
/ Statement
Parameter '形参'
= _* [^\n\t\r,]+ _* ','?
Statement '语句'
= AssignmentStatement
/ !'@' [^\n\t\r]+ LB?
AssignmentStatement
= VariableName _* '=' _* Expression LB? { return { type:'Assignment' } }
VariableName
= N_+
Expression '表达式'
= [^\n\t\r]