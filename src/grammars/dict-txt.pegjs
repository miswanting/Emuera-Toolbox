File
= Block*
Block
= BlankLines
/ Comment
/ Dict
BlankLines
= bl:[ \n\t\r]+ [\r?\n]? {
  const v = bl.reduce((n,char)=>{return n+(char==='\n'?1:0)}, 0)
  return { type: 'BlankLines', value: v }
}
Comment
= '//' comment:[^\n\r]* [\r?\n]? { return { type: 'Comment', value: comment.join('') } }
Dict
= origin:[^\n\t\r]+ [ \t] value:[^\n\t\r]+ [\r?\n]? { return { type:'Dict', origin: origin.join(''), value: value.join('') } }
