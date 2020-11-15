Start
  = [ \n\t\r]* blocks:Blocks [ \n\t\r]* { return blocks }

Blocks
  = current:Block [\r?\n] bl:BlankLines? next:Blocks { 
    let r = [current]
    if (bl) {
      r.push(bl)
    }
    r.push(...next)
    return r
  }
  / current:Block { return [current] }

BlankLines
  = lines:[\r?\n]+ { return { type:'BlankLines', value:lines.length } }

Block
  = Comment
  / Config

Comment
  = ';' value:[^\r\n]* { return {
    'type': 'Comment',
    'value': value.join('')
  }}

Config
  = token:Token [ \t]* ':' [ \t]* value:Value { return {
    type: 'Config',
    token: token,
    value: value
  }}

Token
  = value:[^ :\t]+ { return value.join('') }

Value
  = Int
  / IntArray
  / Bool
  / Str
  / Null

Int
  = value:[0-9]+ ![,] { return parseInt(text(),10) }

IntArray
  = value:[0-9,]+ { return value.join('').split(',').map((v)=>{ return parseInt(v,10) }) }

Bool
  = value:('yes'i/'no'i) ![a-zA-Z]+ { return text().toLowerCase()==='yes' ? true : false }

Str
  = value:[^\r\n]+ { return text() }

Null
  = [^\n]* {return null}