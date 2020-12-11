{


}


// File Structure //
File
= blocks:Block* { return { type: 'File', children: blocks } }
Block
= BlankLines
/ Comment
/ FunctionInExpressionDefinition
/ FunctionDefinition


// Tools //
BlankLines
= bl:[ \n\t\r]+ LB? {
  const v = bl.reduce((n,char)=>{return n+(char==='\n'?1:0)}, 0)
  return { type: 'BlankLines', value: v }
}

Comment
= ';' comment:[^\n\r]* LB? { return { type: 'Comment', value: comment.join('') } }


LB '换行'
= '\r'? '\n'


_ '空字符'
= [ \t]

IdentifierName "identifier"
= !Operator name:Expression {
  return name == " " ? null : name
}

XXX'$'
= '$' name:[^\n\t\r]+  _* LB? { return { type:'$', name:name.join('') } }

// Functions //
FunctionDefinition '函数定义'
= '@' name:[^ ,(\n\t\r]+ '(' param:Parameter? ')' _* LB? children:BlockInFunction* { return { type:'Function', param:param,name:name.join(''), children:children } }
/ '@' name:[^ ,(\n\t\r]+ ',' param:Parameter? _* LB? children:BlockInFunction* { return { type:'Function', param:param, name:name.join(''), children:children } }
/ '@' name:[^ ,(\n\t\r]+  _* LB? children:BlockInFunction* { return { type:'Function', name:name.join(''), children:children } }


FunctionInExpressionDefinition '表达式内函数定义'
= '@' name:[^ ,(\n\t\r]+ '(' param:Parameter? ')' LB ('#functions'i / '#function'i) LB children:BlockInFunction* { return { type:'FunctionInExpression',param:param,  name:name.join(''), children:children  } }
/'@' name:[^ ,(\n\t\r]+ ',' param:Parameter? _* LB ('#functions'i / '#function'i) LB children:BlockInFunction* { return { type:'FunctionInExpression',param:param, name:name.join(''), children:children  } }
/'@' name:[^ ,(\n\t\r]+  LB ('#functions'i / '#function'i) LB children:BlockInFunction* { return { type:'FunctionInExpression', name:name.join(''), children:children  } }




// Expressions //
BlockInFunction
= BlankLines
/ Comment
/ Dim
/ Dims
/ Define
/ XXX
/ Preprocessor
/ Statement

Parameter '形参'
=params:Parameters* _* param:[^)\n\t\r,]+ _*  {
	let pm = []
    params.forEach(element => {
      pm.push(element)
    });
    pm.push(param.join(''))
    return pm
}
Parameters '多项形参'
=  _* params:[^,\n\t\r]+ _* ','   {
  return params.join('')
}


Statement '语句'
=
BlockInStatements 
/ Command
/ AssignmentStatement




AssignmentStatement
= !(Keyword _)  left:IdentifierName+  operator:Operator _* right:Expression* LB? { return { type: "Assignment Statement",operator:operator,left:left.join(''),right:right.join('') }}
/ PostfixExpression



Expression '表达式'
= [^\n\t\r] 




// Command // 
//<---------------------------------------------------------------------------------->
//<---------------------------------------------------------------------------------->
//<---------------------------------------------------------------------------------->
//<---------------------------------------------------------------------------------->


Command
= token:CommandToken _? exp:Expression+ LB{
  return {
    type: token.toUpperCase() + ' Command',
    value: exp.join('')
  }
}/token:CommandToken _ LB{
  return {
    type: token.toUpperCase() + ' Command',
    token:token,
    value: ""
  }
}
/token:CommandToken _? LB{
  return {
    type: token.toUpperCase() + ' Command',
    token:token
  }
}

Preprocessor
=token:preprocessorToken _? exp:Expression* LB{
  return {
    type: token.toUpperCase() + ' Command',
    value: exp.join('')
  }
}

// Dim-Dims-Define //
//<---------------------------------------------------------------------------------->
//<---------------------------------------------------------------------------------->
//<---------------------------------------------------------------------------------->
//<---------------------------------------------------------------------------------->


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



// Operator //
Operator
=  $("=" !"=")
/ AssignmentOperator

PostfixOperator
 = "++"
 / "--"
UnaryOperator
= "~"
/ "!"
AssignmentOperator
= "*="
/ "/="
/ "%="
/ "+="
/ "-="
/ "<<="
/ ">>="
/ "&="
/ "^="
/ "|="
/ '\'='
// MultiplicativeOperator
//   = $("*" !"=")
//   / $("/" !"=")
//   / $("%" !"=")
// AdditiveOperator
//   = $("+" ![+=])
//   / $("-" ![-=])
// ShiftOperator
//   = $("<<"  !"=")
//   / $(">>"  !"=")
// RelationalOperator
//   = "<="
//   / ">="
//   / $("<" !"<")
//   / $(">" !">")
// EqualityOperator
//   = "=="
//   / "!="
// BitwiseANDOperator
//   = $("&" ![&=])
// BitwiseXOROperator
//   = $("^" !"=")
// BitwiseOROperator
//   = $("|" ![|=])
// LogicalANDOperator
//   = "&&"
// LogicalOROperator
//   = "||"
// LogicalXOROperator
//  = "^^"
// LogicalNANDOperator
//  = "!&"
//  LogicalNOROperator
//  = "!|"




// Expression//



//  UnaryExpression
// = operator:UnaryOperator name:VariableName{
//   return{
//     type:"UnaryExpression",
//       text:operator+name.join(''),
//     operator:operator,
//     name:name.join('')
  
//   }
// }/PostfixExpression

Postfixid
=!PostfixOperator name:Expression{return name}


PostfixExpression
= left:Postfixid+ operator:PostfixOperator{
  return{
    type:"PostfixExpression",
        text:left.join('')+operator,
    operator:operator,
    name:left.join('')

  }
}
/ operator:PostfixOperator right:Postfixid+{
  return{
    type:"PrefixExpression",
    text:operator+right.join(''),
    operator:operator,
    name:right.join('')
 
  }
}


// Statements // // 语句 ///

// BlockInStatements 
BlockInStatements
= IfNDebugStatement
/ IfDebugStatement
/ NoSkipStatement
/ SkipStatement
/ IfStatement
/ SifStatement
/ ForStatement
/ WhileStatement
/ Repeattatement
/ DoLoopStatement
/ SelectCaseStatement
/ PrintdataStatement
/ StrdataStatement
/ DatalistStatement
/ TrycCJGformStatement
/ TrycCJGlistStatement
/ TrycCJGformStatement


// Statements 
IfDebugStatement
= _* '[' IF_DEBUGToken ']' LB body:BlockInFunction*   '[' ENDIFToken ']'{
  return{
    type:'IF_Debug Statement',
    body:body
  }
}
// Statements 
IfNDebugStatement
= _* '[' IF_NDEBUGToken ']' LB body:BlockInFunction*   '[' ENDIFToken ']'{
  return{
    type:'IF_NDebug Statement',
    body:body
  }
}
// Statements 
NoSkipStatement
= _* '[' NOSKIPToken ']' LB body:BlockInFunction*   '[' ENDNOSKIPToken ']'{
  return{
    type:'NoSkip Statement',
    body:body
  }
}
// Statements 
SkipStatement
= _* '[' SKIPSTARTToken ']' LB body:BlockInFunction*   '[' SKIPENDToken ']'{
  return{
    type:'Skip Statement',
    body:body
  }
}
// IFStatement IF语句
IfStatement 
= ifbody:IfPart elseifbody:ElseifPart+ elsebody:ElsePart _* ENDIFToken {
  return{
    ifbody,
    elseifbody,
    elsebody
  }
}
/ifbody:IfPart elseifbody:ElseifPart+ _* ENDIFToken {
  return{
    ifbody,
    elseifbody
  }
}/
ifbody:IfPart  elsebody:ElsePart _* ENDIFToken {
  return{
    ifbody,
    elsebody
  }
}
/ifbody:IfPart ENDIFToken{
  return ifbody
}

IfPart
=_* IFToken _ condition:Expression* LB body:BlockInFunction*{
  return{
      type:"IF Statement",
      condition:condition.join(''),
      body:body
  }
}

ElseifPart
=_* ELSEIFToken _  condition:Expression* LB body:BlockInFunction*{
  return{
      type:"ELSEIF Statement",
      condition:condition.join(''),
      body:body
  }
}

ElsePart
= _* ELSEToken   LB body:BlockInFunction*{
  return{
      type:"ELSE Statement",
      body:body
  }
}


//SIFStatement(ShortIF) SIF语句(短IF语句)
SifStatement
= _* SIFToken  condition:Expression* LB body:BlockInFunction*{
  return{
      type:"SIF Statement",
      condition:condition.join(''),
      body:body
  }
}

//ForStatement For循环语句
ForStatement
= _* FORToken  condition:Expression* LB body:BlockInFunction* _* NEXTToken{
  return{
      type:"FOR Statement",
      condition:condition.join(''),
      body:body
  }
}
//WhileStatement While循环语句
WhileStatement
=  _* WHILEToken condition:Expression*  body:BlockInFunction* _* WENDToken{
  return{
      type:"WHILE Statement",
      condition:condition.join(''),
      body:body
  }
}
// Statements 
Repeattatement
=_* REPEATToken condition:Expression* LB body:BlockInFunction* _* RENDToken{
  return{
      type:"REPEAT Statement",
      condition:condition.join(''),
      body:body
  }
}
// Statements 
DoLoopStatement
= _*  DOToken LB body:BlockInFunction* LOOPToken condition:Expression* LB{
  return{
      type:"DO-LOOP Statement",
      condition:condition.join(''),
      body:body
  }
}
// Statements 
SelectCaseStatement
= _* SELECTCASEToken _ condition:Expression* LB body:BlockInFunction* cases:CasePart* caseelse:CaseElsePart? ENDSELECTToken{
  return {
    type: 'SELECTCASE Statement',
    condition:condition.join(''),
    body:body,
    selectcasebody:{
      case:cases,
      caseelse
    }
  }
} 

CasePart
=_* CASEToken _ condition:Expression* LB body:BlockInFunction*{
  return {
    type: 'CASE Statement',
    condition:condition.join(''),
    body:body
  }
}
CaseElsePart
=_* CASEELSEToken LB body:BlockInFunction*{
  return {
    type: 'CASEELSE Statement',
    body:body
  }
}

PrintdataStatement
= _* token:PrintdataToken  condition:Expression* LB body:BlockInFunction* _* ENDDATAToken{
return {
    type:token.toUpperCase() + ' Statement',
    condition:condition.join(''),
    body:body
  }
}


// Statements 
StrdataStatement
= _* 'strdata'i LB body:BlockInFunction* _* ENDDATAToken{
return {
    type:'STRDATA Statement',
    body:body
  }

}
// Statements 
DatalistStatement
= _* DATALISTToken LB body:BlockInFunction* _* ENDLISTToken{
return {
    type:'DATALIST Statement',
    body:body
  }

}

//TrycCJGStatement
TrycCJGStatement
= _* token:TrycCJGToken  condition:Expression* LB body:BlockInFunction* _* CATCHToken LB catchbody:BlockInFunction* _* ENDCATCHToken{
return {
    type:token.toUpperCase() + ' Statement',
    body:body,
    catchbody:catchbody
  }
}
//TrycCJGformStatement CJG:CALL-JUMP-GOTO
TrycCJGformStatement
= _* token:TrycCJGformToken ondition:Expression* LB body:BlockInFunction* _* CATCHToken LB catchbody:BlockInFunction* _* ENDCATCHToken{
return {
    type:token.toUpperCase()  +' Statement',
    body:body,
    catchbody:catchbody
  }
}

//TrycCJGlistStatement CJG:CALL-JUMP-GOTO

TrycCJGlistStatement
= _* token:TrycCJGlistToken LB func:FuncPart*   _* ENDFUNCToken{
return{type:token.toUpperCase() +' Statement',body:func}
}
// other//

FuncPart
='func'i  fun:Expression* LB{
  return{
    name:'FUNC',
    value:fun
  }
}

Keyword
  =  CommandToken / StatementsToken

  // Token //


// StatementsToken //
//<---------------------------------------------------------------------------------->
//<---------------------------------------------------------------------------------->
//<---------------------------------------------------------------------------------->
//<---------------------------------------------------------------------------------->
StatementsToken
= TrycCJGformToken
/ TrycCJGlistToken
/ TrycCJGToken
/ PrintdataToken
/ IFToken
/ ELSEIFToken
/ ELSEToken
/ ENDIFToken
/ STRDATAToken
/ ENDDATAToken
/ DATALISTToken
/ ENDLISTToken
/ NOSKIPToken
/ ENDNOSKIPToken
/ SIFToken
/ REPEATToken
/ RENDToken
/ FORToken
/ NEXTToken
/ WHILEToken
/ WENDToken
/ DOToken
/ LOOPToken
/ SELECTCASEToken
/ CASEToken
/ ISToken
/ TOToken
/ CASEELSEToken
/ ENDSELECTToken
/ CATCHToken
/ ENDCATCHToken
/ TRYCALLLISTToken
/ ENDFUNCToken





TrycCJGformToken
='tryccallform'i
/'trycjumpform'i
/'trycgotoform'i

TrycCJGlistToken
= 'trycjumplist'i
/ 'trycgotolist'i
/ 'trycjumplist'i

TrycCJGToken
='tryccall'i
/'trycjump'i
/'trycgoto'i

PrintdataToken
=  'printdatadw'i
/  'printdatadl'i
/  'printdatakw'i
/  'printdatakl'i
/  'printdatak'i 
/  'printdataw'i 
/  'printdatal'i 
/  'printdatad'i 
/  'printdata'i  

// CommandToken //
//<---------------------------------------------------------------------------------->
//<---------------------------------------------------------------------------------->
//<---------------------------------------------------------------------------------->
//<---------------------------------------------------------------------------------->
CommandToken
= ABSToken 
/	ADDCHARAToken 
/ ADDCOPYCHARAToken 
/ ADDDEFCHARAToken 
/ ADDVOIDCHARAToken 
/ ALIGNMENTToken 
/ ARRAYCOPYToken 
/ ARRAYREMOVEToken 
/ ARRAYSHIFTToken 
/ ARRAYSORTToken 
/ ASSERTToken 
/ AWAITToken 
/ BARLToken 
/ BARSTRToken 
/ BARToken 
/ BEGINToken 
/ BREAKToken 
/ CALLEVENTToken 
/ CALLFORMFToken 
/ CALLFORMToken 
/ CALLFToken 
/ CALLTRAINToken
/ CALLToken  
/ CHARATUToken 
/ CHKCHARADATAToken 
/ CHKDATAToken 
/ CHKFONTToken 
/ CLEARBITToken 
/ CLEARLINEToken 
/ CLEARTEXTBOXToken 
/ CONTINUEToken 
/ COPYCHARAToken 
/ CSVABLToken 
/ CSVBASEToken 
/ CSVCALLNAMEToken 
/ CSVCFLAGToken 
/ CSVCSTRToken 
/ CSVEQUIPToken 
/ CSVEXPToken 
/ CSVJUELToken 
/ CSVMARKToken 
/ CSVMASTERNAMEToken 
/ CSVNAMEToken 
/ CSVNICKNAMEToken 
/ CSVRELATIONToken 
/ CSVTALENTToken 
/ CUPCHECKToken 
/ CURRENTALIGNToken 
/ CURRENTREDRAWToken 
/ CUSTOMDRAWLINEToken 
/ CVARSETToken 
/ DATAToken 
/ DEBUGCLEARToken 
/ DEBUGPRINTFORMLToken 
/ DEBUGPRINTFORMToken 
/ DEBUGPRINTLToken 
/ DEBUGPRINTToken 
/ DELALLCHARAToken 
/ DELCHARAToken 
/ DELDATAToken 
/ DOTRAINToken 
/ DRAWLINEToken 
/ DUMPRANDToken 
/ ENCODETOUNIToken 
/ ESCAPEToken 
/ EXISTCSVToken 
/ FIND_CHARADATAToken 
/ FINDCHARAToken 
/ FINDELEMENTToken 
/ FINDLASTCHARAToken 
/ FINDLASTELEMENTToken 
/ FONTToken 
/ FORCEKANAToken 
/ FORCEWAITToken 
/ FUNCToken 
/ GETBGCOLORToken 
/ GETBITToken 
/ GETCHARAToken 
/ GETCOLORToken 
/ GETDEFBGCOLORToken 
/ GETDEFCOLORToken 
/ GETEXPLVToken 
/ GETFOCUSCOLORToken 
/ GETFONTToken 
/ GETMILLISECONDToken 
/ GETNUMToken 
/ GETPALAMLVToken 
/ GETSECONDToken 
/ GETSTYLEToken 
/ GETTIMEToken 
/ GOTOFORMToken 
/ GOTOToken 
/ HTML_PRINTToken 
/ HTML_TAGSPLITToken 
/ INITRANDToken 
/ INPUTMOUSEKEYToken 
/ INPUTSToken 
/ INPUTToken 
/ INRANGEToken 
/ INVERTBITToken 
/ ISNUMERICToken 
/ ISSKIPToken 
/ JUMPFORMToken 
/ JUMPToken 
/ LIMITToken 
/ LINEISEMPTYToken 
/ LOADCHARAToken 
/ LOADDATAToken 
/ LOADGAMEToken 
/ LOADGLOBALToken 
/ MAXToken 
/ MINToken 
/ MONEYSTRToken 
/ MOUSESKIPToken 
/ ONEINPUTSToken 
/ ONEINPUTToken 
/ OUTPUTLOGToken 
/ PICKUPCHARAToken 
/ POWERToken 
/ PRINT_Token 
/ PRINTBUTTONToken 
/ PRINTCPERLINEToken 
/ PRINTFORMToken  
/ PRINTPLAINToken 
/ PRINTSINGLEToken 
/ PRINTToken
/ PUTFORMToken 
/ QUITToken 
/ RANDOMIZEToken 
/ REDRAWToken 
/ REPLACEToken 
/ RESET_STAINToken 
/ RESETBGCOLORToken 
/ RESETCOLORToken 
/ RESETDATAToken 
/ RESETGLOBALToken 
/ RESTARTToken 
/ RETURNFORMToken 
/ RETURNFToken 
/ RETURNToken 
/ REUSELASTLINEToken 
/ SAVECHARAToken 
/ SAVEDATAToken 
/ SAVEGAMEToken 
/ SAVEGLOBALToken 
/ SAVENOSToken 
/ SETANIMETIMEToken 
/ SETBGCOLORBYNAMEToken 
/ SETBGCOLORToken 
/ SETBITToken 
/ SETCOLORBYNAMEToken 
/ SETCOLORToken 
/ SETFONTToken 
/ SIGNToken 
/ SKIPDISPToken 
/ SORTCHARAToken 
/ SPLITToken 
/ SQRTToken 
/ STOPCALLTRAINToken 
/ STRCOUNTToken 
/ STRFINDUToken 
/ STRFINDToken 
/ STRLENFORMUToken 
/ STRLENFORMToken 
/ STRLENSUToken 
/ STRLENSToken 
/ STRLENUToken 
/ STRLENToken 
/ SUBSTRINGUToken 
/ SUBSTRINGToken 
/ SWAPCHARAToken 
/ SWAPToken 
/ THROWToken 
/ TIMESToken 
/ TINPUTSToken 
/ TINPUTToken 
/ TOFULLToken 
/ TOHALFToken 
/ TOINTToken 
/ TOLOWERToken 
/ TONEINPUTSToken 
/ TONEINPUTToken 
/ TOOLTIP_SETCOLORToken 
/ TOOLTIP_SETDELAYToken 
/ TOOLTIP_SETDURATIONToken 
/ TOSTRToken 
/ TOUPPERToken 
/ TWAITToken 
/ UNICODEToken 
/ UPCHECKToken 
/ VARSETToken 
/ VARSIZEToken 
/ WAITANYKEYToken 
/ WAITToken 




DATAToken
= "DATAFORM"i 
/ "DATA"i 

PRINTToken
= "PRINTLCK"i   
/ "PRINTLCD"i   
/ "PRINTSDL"i   
/ "PRINTSDW"i   
/ "PRINTSKL"i   
/ "PRINTSKW"i   
/ "PRINTVDL"i   
/ "PRINTVDW"i   
/ "PRINTVKL"i   
/ "PRINTVKW"i   
/ "PRINTKL"i    
/ "PRINTKW"i    
/ "PRINTDL"i    
/ "PRINTCK"i    
/ "PRINTCD"i    
/ "PRINTLC"i    
/ "PRINTDW"i    
/ "PRINTVL"i    
/ "PRINTVW"i    
/ "PRINTVK"i    
/ "PRINTSL"i    
/ "PRINTSW"i    
/ "PRINTSK"i    
/ "PRINTVD"i    
/ "PRINTSD"i    
/ "PRINTL"i     
/ "PRINTW"i     
/ "PRINTK"i     
/ "PRINTD"i     
/ "PRINTV"i     
/ "PRINTS"i     
/ "PRINTC"i     
/ "PRINT"i 

PRINT_Token
= "PRINT_SHOPITEM"i
/ "PRINT_PALAM"i
/ "PRINT_TALENT"i
/ "PRINT_SPACE"i
/ "PRINT_MARK"i
/ "PRINT_RECT"i
/ "PRINT_ITEM"i
/ "PRINT_EXP"i
/ "PRINT_ABL"i
/ "PRINT_IMG"i

PRINTPLAINToken
= "PRINTPLAINFORM"i
/ "PRINTPLAIN"i

PRINTBUTTONToken
= "PRINTBUTTONLC"i
/ "PRINTBUTTONC"i
/ "PRINTBUTTON"i

PRINTFORMToken 
= "PRINTFORMSDW"i
/ "PRINTFORMSDL"i
/ "PRINTFORMSKW"i
/ "PRINTFORMSKL"i
/ "PRINTFORMLCK"i
/ "PRINTFORMLCD"i
/ "PRINTFORMCK"i
/ "PRINTFORMCD"i
/ "PRINTFORMLC"i
/ "PRINTFORMKL"i
/ "PRINTFORMSD"i
/ "PRINTFORMKL"i
/ "PRINTFORMKW"i
/ "PRINTFORMDL"i
/ "PRINTFORMDW"i
/ "PRINTFORMSL"i
/ "PRINTFORMSW"i
/ "PRINTFORMSK"i
/ "PRINTFORMW"i
/ "PRINTFORMK"i
/ "PRINTFORMD"i
/ "PRINTFORMS"i
/ "PRINTFORML"i
/ "PRINTFORMC"i
/ "PRINTFORM"i


PRINTSINGLEToken
=
// PRINTSINGLEFORM //
  "PRINTSINGLEFORMSK"i
/ "PRINTSINGLEFORMSD"i
/ "PRINTSINGLEFORMK"i
/ "PRINTSINGLEFORMD"i
/ "PRINTSINGLEFORMS"i
/ "PRINTSINGLEFORM"i
// PRINTSINGLE //
/ "PRINTSINGLESK"i
/ "PRINTSINGLESD"i
/ "PRINTSINGLEVK"i
/ "PRINTSINGLEVD"i
/ "PRINTSINGLEK"i
/ "PRINTSINGLED"i
/ "PRINTSINGLEV"i
/ "PRINTSINGLES"i
/ "PRINTSINGLE"i

FONTToken 
= "FONTREGULAR"i
/ "FONTITALIC"i
/ "FONTSTYLE"i
/ "FONTBOLD"i

// OtherCommandToken //


CUSTOMDRAWLINEToken = "CUSTOMDRAWLINE"i
DRAWLINEToken = "DRAWLINEFORM"i / "DRAWLINE"i
REUSELASTLINEToken = "REUSELASTLINE"i
UPCHECKToken = "UPCHECK"i
CLEARLINEToken = "CLEARLINE"i
SETCOLORToken = "SETCOLOR"i
SETBGCOLORToken = "SETBGCOLOR"i
RESETCOLORToken = "RESETCOLOR"i
RESETBGCOLORToken = "RESETBGCOLOR"i
SETCOLORBYNAMEToken ="SETCOLORBYNAME"i
SETBGCOLORBYNAMEToken ="SETBGCOLORBYNAME"i
GETCOLORToken = "GETCOLOR"i
GETDEFCOLORToken = "GETDEFCOLOR"i
GETBGCOLORToken = "GETBGCOLOR"i
GETDEFBGCOLORToken = "GETDEFBGCOLOR"i
GETFOCUSCOLORToken = "GETFOCUSCOLOR"i
GETSTYLEToken = "GETSTYLE"i
CHKFONTToken = "CHKFONT"i
SETFONTToken = "SETFONT"i
GETFONTToken = "GETFONT"i
FORCEKANAToken = "FORCEKANA"i
ALIGNMENTToken = "ALIGNMENT"i
CURRENTALIGNToken = "CURRENTALIGN"i
REDRAWToken = "REDRAW"i
CURRENTREDRAWToken = "CURRENTREDRAW"i
PRINTCPERLINEToken = "PRINTCPERLINE"i
LINEISEMPTYToken = "LINEISEMPTY"i
BARSTRToken = "BARSTR"i
MONEYSTRToken = "MONEYSTR"i
SKIPDISPToken = "SKIPDISP"i
ISSKIPToken = "ISSKIP"i
MOUSESKIPToken = "MOUSESKIP"i
TOUPPERToken = "TOUPPER"i
TOLOWERToken = "TOLOWER"i
TOHALFToken = "TOHALF"i
TOFULLToken = "TOFULL"i
TOSTRToken = "TOSTR"i
ISNUMERICToken = "ISNUMERIC"i
TOINTToken = "TOINT"i
STRLENToken = "STRLEN"i
STRLENUToken = "STRLENU"i
STRLENSToken = "STRLENS"i
STRLENSUToken = "STRLENSU"i
STRLENFORMToken = "STRLENFORM"i
STRLENFORMUToken = "STRLENFORMU"i
SUBSTRINGToken = "SUBSTRING"i
SUBSTRINGUToken = "SUBSTRINGU"i
CHARATUToken = "CHARATU"i
STRFINDToken = "STRFIND"i
STRFINDUToken = "STRFINDU"i
STRCOUNTToken = "STRCOUNT"i
SPLITToken = "SPLIT"i
REPLACEToken = "REPLACE"i
ESCAPEToken = "ESCAPE"i
UNICODEToken = "UNICODE"i
ENCODETOUNIToken = "ENCODETOUNI"i
POWERToken = "POWER"i
ABSToken = "ABS"i
SIGNToken = "SIGN"i
SQRTToken = "SQRT"i
GETBITToken = "GETBIT"i
MAXToken = "MAX"i
MINToken = "MIN"i
LIMITToken = "LIMIT"i
INRANGEToken = "INRANGE"i
SETBITToken = "SETBIT"i
CLEARBITToken = "CLEARBIT"i
INVERTBITToken = "INVERTBIT"i
ADDCHARAToken = "ADDCHARA"i
DELCHARAToken = "DELCHARA"i
SWAPCHARAToken = "SWAPCHARA"i
SORTCHARAToken = "SORTCHARA"i
GETCHARAToken = "GETCHARA"i
ADDDEFCHARAToken = "ADDDEFCHARA"i
ADDVOIDCHARAToken = "ADDVOIDCHARA"i
DELALLCHARAToken = "DELALLCHARA"i
PICKUPCHARAToken = "PICKUPCHARA"i
EXISTCSVToken = "EXISTCSV"i
FINDCHARAToken = "FINDCHARA"i
FINDLASTCHARAToken = "FINDLASTCHARA"i
COPYCHARAToken = "COPYCHARA"i
ADDCOPYCHARAToken = "ADDCOPYCHARA"i
VARSIZEToken = "VARSIZE"i
RESETDATAToken = "RESETDATA"i
RESETGLOBALToken = "RESETGLOBAL"i
RESET_STAINToken = "RESET_STAIN"i
SWAPToken = "SWAP"i
CSVNAMEToken = "CSVNAME"i
CSVCALLNAMEToken = "CSVCALLNAME"i
CSVNICKNAMEToken = "CSVNICKNAME"i
CSVMASTERNAMEToken = "CSVMASTERNAME"i
CSVBASEToken = "CSVBASE"i
CSVCSTRToken = "CSVCSTR"i
CSVABLToken = "CSVABL"i
CSVTALENTToken = "CSVTALENT"i
CSVMARKToken = "CSVMARK"i
CSVEXPToken = "CSVEXP"i
CSVRELATIONToken = "CSVRELATION"i
CSVJUELToken = "CSVJUEL"i
CSVEQUIPToken = "CSVEQUIP"i
CSVCFLAGToken = "CSVCFLAG"i
GETNUMToken = "GETNUM"i
GETPALAMLVToken = "GETPALAMLV"i
GETEXPLVToken = "GETEXPLV"i
FINDELEMENTToken = "FINDELEMENT"i
FINDLASTELEMENTToken = "FINDLASTELEMENT"i
VARSETToken = "VARSET"i
CVARSETToken = "CVARSET"i
ARRAYSHIFTToken = "ARRAYSHIFT"i
ARRAYREMOVEToken = "ARRAYREMOVE"i
ARRAYSORTToken = "ARRAYSORT"i
ARRAYCOPYToken = "ARRAYCOPY"i
CUPCHECKToken = "CUPCHECK"i
SAVEDATAToken = "SAVEDATA"i
LOADDATAToken = "LOADDATA"i
DELDATAToken = "DELDATA"i
CHKDATAToken = "CHKDATA"i
SAVENOSToken = "SAVENOS"i
SAVEGLOBALToken = "SAVEGLOBAL"i
LOADGLOBALToken = "LOADGLOBAL"i
OUTPUTLOGToken = "OUTPUTLOG"i
SAVECHARAToken = "SAVECHARA"i
LOADCHARAToken = "LOADCHARA"i
CHKCHARADATAToken = "CHKCHARADATA"i
FIND_CHARADATAToken = "FIND_CHARADATA"i
GETTIMEToken = "GETTIME"i
GETMILLISECONDToken = "GETMILLISECOND"i
GETSECONDToken = "GETSECOND"i
FORCEWAITToken = "FORCEWAIT"i
INPUTToken = "INPUT"i
INPUTSToken = "INPUTS"i
TINPUTToken = "TINPUT"i
TINPUTSToken = "TINPUTS"i
TWAITToken = "TWAIT"i
ONEINPUTToken = "ONEINPUT"i
ONEINPUTSToken = "ONEINPUTS"i
TONEINPUTToken = "TONEINPUT"i
TONEINPUTSToken = "TONEINPUTS"i
WAITANYKEYToken = "WAITANYKEY"i
BREAKToken = "BREAK"i
CONTINUEToken = "CONTINUE"i
RANDOMIZEToken = "RANDOMIZE"i
DUMPRANDToken = "DUMPRAND"i
INITRANDToken = "INITRAND"i
BEGINToken = "BEGIN"i
CALLTRAINToken = "CALLTRAIN"i
DOTRAINToken = "DOTRAIN"i
THROWToken = "THROW"i
CALLToken = "CALL"i
JUMPToken = "JUMP"i
GOTOToken = "GOTO"i
CALLFORMToken = "CALLFORM"i
JUMPFORMToken = "JUMPFORM"i
GOTOFORMToken = "GOTOFORM"i
TRYCALLToken = "TRYCALL"i
TRYJUMPToken = "TRYJUMP"i
TRYGOTOToken = "TRYGOTO"i
TRYCALLFORMToken = "TRYCALLFORM"i
TRYJUMPFORMToken = "TRYJUMPFORM"i
TRYGOTOFORMToken = "TRYGOTOFORM"i
CALLFToken = "CALLF"i
CALLFORMFToken = "CALLFORMF"i
CALLEVENTToken = "CALLEVENT"i
FUNCToken = "FUNC"i
RETURNToken = "RETURN"i
RETURNFORMToken = "RETURNFORM"i
RETURNFToken = "RETURNF"i
DEBUGPRINTToken = "DEBUGPRINT"i
DEBUGPRINTLToken = "DEBUGPRINTL"i
DEBUGPRINTFORMToken = "DEBUGPRINTFORM"i
DEBUGPRINTFORMLToken = "DEBUGPRINTFORML"i
DEBUGCLEARToken = "DEBUGCLEAR"i
ASSERTToken = "ASSERT"i
TOOLTIP_SETCOLORToken = "TOOLTIP_SETCOLOR"i
TOOLTIP_SETDELAYToken = "TOOLTIP_SETDELAY"i
HTML_PRINTToken = "HTML_PRINT"i
HTML_TAGSPLITToken = "HTML_TAGSPLIT"i
CLEARTEXTBOXToken = "CLEARTEXTBOX"i
STOPCALLTRAINToken = "STOPCALLTRAIN"i
TIMESToken = "TIMES"i
BARToken = "BAR"i
BARLToken = "BARL"i
PUTFORMToken = "PUTFORM"i
SAVEGAMEToken = "SAVEGAME"i
LOADGAMEToken = "LOADGAME"i
WAITToken = "WAIT"i
RESTARTToken = "RESTART"i
QUITToken = "QUIT"i
TOOLTIP_SETDURATIONToken = "TOOLTIP_SETDURATION"i
AWAITToken = "AWAIT"i
INPUTMOUSEKEYToken = "INPUTMOUSEKEY"i
SETANIMETIMEToken = "SETANIMETIMER"i




// KeyWordToken //
preprocessorToken
= SINGLEToken    
/ PRIToken       
/ LATERToken     
/ ONLYToken      
/ LOCALSIZEToken 
/ LOCALSSIZEToken 


SINGLEToken ="#SINGLE"i
PRIToken ="#PRI"i
LATERToken ="#LATER"i
ONLYToken ="#ONLY"i
LOCALSIZEToken ="#LOCALSIZE"i
LOCALSSIZEToken ="#LOCALSSIZE"i
DIMToken ="#DIM"i
DIMSToken ="#DIMS"i
FUNCTIONToken ="#FUNCTION"i
FUNCTIONSToken ="#FUNCTIONS"i
DEFINEToken ="#DEFINE"i
IF_DEBUGToken ="IF_DEBUG"i
IF_NDEBUGToken ="IF_NDEBUG"i
SKIPSTARTToken ="SKIPSTART"i
SKIPENDToken ="SKIPEND"i
CHARADATAToken ="CHARADATA"i
GLOBALToken ="GLOBAL"i
DYNAMICToken ="DYNAMIC"i
STATICToken ="STATIC"i
CONSTToken ="CONST"i
REFToken ="REF"i
SHOPToken ="SHOP"i
TRAINToken ="TRAIN"i
ABLUPToken ="ABLUP"i
AFTERTRAINToken ="AFTERTRAIN"i
TURNENDToken ="TURNEND"i
FIRSTToken ="FIRST"i
TITLEToken ="TITLE"i
LEFTToken ="LEFT"i
CENTERToken ="CENTER"i
RIGHTToken ="RIGHT"i
FORWARDToken ="FORWARD"i
BACKToken ="BACK"i
// SAVEDATAToken = "SAVEDATA"


// <-------------VariableToken---------------->
// VariableToken //
// GLOBALToken ="GLOBAL"
DAYToken ="DAY"i
MONEYToken = "MONEY"i
ITEMToken ="ITEM"i
FLAGToken ="FLAG"i
TFLAGToken ="TFLAG"i
UPToken ="UP"i
PALAMLVToken ="PALAMLV"i
EXPLVToken ="EXPLV"i
EJACToken ="EJAC"i
DOWNToken ="DOWN"i
RESULTToken ="RESULT"i
COUNTToken ="COUNT"i
TARGETToken ="TARGET"i
ASSIToken ="ASSI"i
MASTERToken ="MASTER"i
NOITEMToken ="NOITEM"i
LOSEBASEToken ="LOSEBASE"i
SELECTCOMToken ="SELECTCOM"i
ASSIPLAYToken ="ASSIPLAY"i
PREVCOMToken ="PREVCOM"i
TIMEToken ="TIME"i
ITEMSALESToken ="ITEMSALES"i
PLAYERToken ="PLAYER"i
NEXTCOMToken ="NEXTCOM"i
PBANDToken ="PBAND"i
BOUGHTToken ="BOUGHT"i
RANDDATAToken ="RANDDATA"i
SAVESTRToken ="SAVESTR"i
TSTRToken ="TSTR"i
STRToken ="STR"i
RESULTSToken ="RESULTS"i
GLOBALSToken ="GLOBALS"i
SAVEDATA_TEXTToken ="SAVEDATA_TEXT"i
ISASSIToken ="ISASSI"i
NOToken ="NO"i
BASEToken ="BASE"i
MAXBASEToken ="MAXBASE"i
ABLToken ="ABL"i
TALENTToken ="TALENT"i
EXPToken ="EXP"i
MARKToken ="MARK"i
PALAMToken ="PALAM"i
SOURCEToken ="SOURCE"i
EXToken ="EX"i
CFLAGToken ="CFLAG"i
JUELToken ="JUEL"i
RELATIONToken ="RELATION"i
EQUIPToken ="EQUIP"i
TEQUIPToken ="TEQUIP"i
STAINToken ="STAIN"i
GOTJUELToken ="GOTJUEL"i
NOWEXToken ="NOWEX"i
DOWNBASEToken ="DOWNBASE"i
CUPToken ="CUP"i
CDOWNToken ="CDOWN"i
TCVARToken ="TCVAR"i
NAMEToken ="NAME"i
CALLNAMEToken ="CALLNAME"i
NICKNAMEToken ="NICKNAME"i
MASTERNAMEToken ="MASTERNAME"i
CSTRToken ="CSTR"i
CDFLAGToken ="CDFLAG"i
DITEMTYPEToken ="DITEMTYPE"i
DAToken ="DA"i
DBToken ="DB"i
DCToken ="DC"i
DDToken ="DD"i
DEToken ="DE"i
TAToken ="TA"i
TBToken ="TB"i
ITEMPRICEToken ="ITEMPRICE"i
ABLNAMEToken ="ABLNAME"i
TALENTNAMEToken ="TALENTNAME"i
EXPNAMEToken ="EXPNAME"i
MARKNAMEToken ="MARKNAME"i
PALAMNAMEToken ="PALAMNAME"i
ITEMNAMEToken ="ITEMNAME"i
TRAINNAMEToken ="TRAINNAME"i
BASENAMEToken ="BASENAME"i
SOURCENAMEToken ="SOURCENAME"i
EXNAMEToken ="EXNAME"i
EQUIPNAMEToken ="EQUIPNAME"i
TEQUIPNAMEToken ="TEQUIPNAME"i
FLAGNAMEToken ="FLAGNAME"i
TFLAGNAMEToken ="TFLAGNAME"i
CFLAGNAMEToken ="CFLAGNAME"i
TCVARNAMEToken ="TCVARNAME"i
CSTRNAMEToken ="CSTRNAME"i
STAINNAMEToken ="STAINNAME"i
CDFLAGNAME1Token ="CDFLAGNAME1"i
CDFLAGNAME2Token ="CDFLAGNAME2"i
STRNAMEToken ="STRNAME"i
TSTRNAMEToken ="TSTRNAME"i
SAVESTRNAMEToken ="SAVESTRNAME"i
GLOBALNAMEToken ="GLOBALNAME"i
GLOBALSNAMEToken ="GLOBALSNAME"i
GAMEBASE_AUTHERToken ="GAMEBASE_AUTHER"i
GAMEBASE_AUTHORToken ="GAMEBASE_AUTHOR"i
GAMEBASE_INFOToken ="GAMEBASE_INFO"i
GAMEBASE_YEARToken ="GAMEBASE_YEAR"i
GAMEBASE_TITLEToken ="GAMEBASE_TITLE"i
GAMEBASE_GAMECODEToken ="GAMEBASE_GAMECODE"i
GAMEBASE_VERSIONToken ="GAMEBASE_VERSION"i
GAMEBASE_ALLOWVERSIONToken ="GAMEBASE_ALLOWVERSION"i
GAMEBASE_DEFAULTCHARAToken ="GAMEBASE_DEFAULTCHARA"i
GAMEBASE_NOITEMToken ="GAMEBASE_NOITEM"i
RANDToken ="RAND"i
CHARANUMToken ="CHARANUM"i
LASTLOAD_TEXTToken ="LASTLOAD_TEXT"i
LASTLOAD_VERSIONToken ="LASTLOAD_VERSION"i
LASTLOAD_NOToken ="LASTLOAD_NO"i
LINECOUNTToken ="LINECOUNT"i
ISTIMEOUTToken ="ISTIMEOUT"i
__INT_MAX__Token = "__INT_MAX__"i
__INT_MIN__Token ="__INT_MIN__"i
EMUERA_VERSIONToken ="EMUERA_VERSION"i
WINDOW_TITLEToken ="WINDOW_TITLE"i
MONEYLABELToken ="MONEYLABEL"i
DRAWLINESTRToken ="DRAWLINESTR"i
__FILE__Token ="__FILE__"i
__FUNCTION__Token ="__FUNCTION__"i
__LINE__Token ="__LINE__"i
LOCALToken ="LOCAL"i
ARGToken ="ARG"i
LOCALSToken ="LOCALS"i
ARGSToken ="ARGS"i



// <-------------ControlToken---------------->




STRDATAToken ="STRDATA"i
ENDDATAToken ="ENDDATA"i
DATALISTToken ="DATALIST"i
ENDLISTToken ="ENDLIST"i
NOSKIPToken ="NOSKIP"i
ENDNOSKIPToken ="ENDNOSKIP"i
SIFToken ="SIF"i
IFToken ="IF"i
ELSEIFToken ="ELSEIF"i
ELSEToken ="ELSE"i
ENDIFToken ="ENDIF"i
REPEATToken ="REPEAT"i
RENDToken ="REND"i
FORToken ="FOR"i
NEXTToken ="NEXT"i
WHILEToken ="WHILE"i
WENDToken ="WEND"i
DOToken ="DO"i
LOOPToken ="LOOP"i
SELECTCASEToken ="SELECTCASE"i
CASEToken ="CASE"i
ISToken ="IS"i
TOToken ="TO"i
CASEELSEToken ="CASEELSE"i
ENDSELECTToken ="ENDSELECT"i
TRYCJUMPToken ="TRYCJUMP"i
TRYCCALLToken ="TRYCCALL"i
TRYCGOTOToken ="TRYCGOTO"i
TRYCJUMPFORMToken ="TRYCJUMPFORM"i
TRYCCALLFORMToken ="TRYCCALLFORM"i
TRYCGOTOFORMToken ="TRYCGOTOFORM"i
CATCHToken ="CATCH"i
ENDCATCHToken ="ENDCATCH"i
TRYCALLLISTToken ="TRYCALLLIST"i
TRYJUMPLISTToken ="TRYJUMPLIST"i
TRYGOTOLISTToken ="TRYGOTOLIST"i
ENDFUNCToken ="ENDFUNC"i




// <-------------FunctionToken---------------->
// FunctionToken //
// RANDToken = "RAND"
STRJOINToken = "STRJOIN"i
GETKEYToken = "GETKEY"i
GETKEYTRIGGEREDToken = "GETKEYTRIGGERED"i
MOUSEXToken = "MOUSEX"i
MOUSEYToken = "MOUSEY"i
ISACTIVEToken = "ISACTIVE"i
SAVETEXTToken = "SAVETEXT"i
LOADTEXTToken = "LOADTEXT"i
SPRITECREATEDToken = "SPRITECREATED"i
SPRITEWIDTHToken = "SPRITEWIDTH"i
SPRITEHEIGHTToken = "SPRITEHEIGHT"i
SPRITEPOSXToken = "SPRITEPOSX"i
SPRITEPOSYToken = "SPRITEPOSY"i
SPRITESETPOSToken = "SPRITESETPOS"i
SPRITEMOVEToken = "SPRITEMOVE"i
ARRAYMSORTToken = "ARRAYMSORT"i
GCREATEDToken = "GCREATED"i
GWIDTHToken = "GWIDTH"i
GHEIGHTToken = "GHEIGHT"i
GGETCOLORToken = "GGETCOLOR"i
GCREATEToken = "GCREATE"i
GCREATEFROMFILEToken = "GCREATEFROMFILE"i
GDISPOSEToken = "GDISPOSE"i
GCLEARToken = "GCLEAR"i
GFILLRECTANGLEToken = "GFILLRECTANGLE"i
GDRAWSPRITEToken = "GDRAWSPRITE"i
GSETCOLORToken = "GSETCOLOR"i
GDRAWGToken = "GDRAWG"i
GDRAWGWITHMASKToken = "GDRAWGWITHMASK"i
GSETBRUSHToken = "GSETBRUSH"i
GSETFONTToken = "GSETFONT"i
GSETPENToken = "GSETPEN"i
GSAVEToken = "GSAVE"i
GLOADToken = "GLOAD"i
SPRITECREATEToken = "SPRITECREATE"i
SPRITEANIMECREATEToken = "SPRITEANIMECREATE"i
SPRITEANIMEADDFRAMEToken = "SPRITEANIMEADDFRAME"i
SPRITEDISPOSEToken = "SPRITEDISPOSE"i
SPRITEGETCOLORToken = "SPRITEGETCOLOR"i
CBGSETGToken = "CBGSETG"i
CBGSETSPRITEToken = "CBGSETSPRITE"i
CBGCLEARToken = "CBGCLEAR"i
CBGREMOVERANGEToken = "CBGREMOVERANGE"i
CBGSETBUTTONSPRITEToken = "CBGSETBUTTONSPRITE"i
CBGCLEARBUTTONToken = "CBGCLEARBUTTON"i
CBGSETBMAPGToken = "CBGSETBMAPG"i
CBGREMOVEBMAPToken = "CBGREMOVEBMAP"i
GETTIMESToken = "GETTIMES"i
CBRTToken = "CBRT"i
LOGToken = "LOG"i
LOG10Token = "LOG10"i
EXPONENTToken = "EXPONENT"i
SUMARRAYToken = "SUMARRAY"i
MATCHToken = "MATCH"i
MAXARRAYToken = "MAXARRAY"i
MINARRAYToken = "MINARRAY"i
SUMCARRAYToken = "SUMCARRAY"i
CMATCHToken = "CMATCH"i
MAXCARRAYToken = "MAXCARRAY"i
MINCARRAYToken = "MINCARRAY"i
GROUPMATCHToken = "GROUPMATCH"i
NOSAMESToken = "NOSAMES"i
ALLSAMESToken = "ALLSAMES"i
MESSKIPToken = "MESSKIP"i
CONVERTToken = "CONVERT"i
COLOR_FROMNAMEToken = "COLOR_FROMNAME"i
COLOR_FROMRGBToken = "COLOR_FROMRGB"i
INRANGEARRAYToken = "INRANGEARRAY"i
INRANGECARRAYToken = "INRANGECARRAY"i
GETLINESTRToken = "GETLINESTR"i
PRINTCLENGTHToken = "PRINTCLENGTH"i
STRFORMToken = "STRFORM"i
GETCONFIGToken = "GETCONFIG"i
GETCONFIGSToken = "GETCONFIGS"i
HTML_POPPRINTINGSTRToken = "HTML_POPPRINTINGSTR"i
HTML_GETPRINTEDSTRToken = "HTML_GETPRINTEDSTR"i
HTML_ESCAPEToken = "HTML_ESCAPE"i
HTML_TOPLAINTEXTToken = "HTML_TOPLAINTEXT"i
CLIENTWIDTHToken = "CLIENTWIDTH"i
CLIENTHEIGHTToken = "CLIENTHEIGHT"i
