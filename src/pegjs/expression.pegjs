{
	const BINARY_OP = 'binary-op';
	const UNARY_OP = 'unary-op';
	const FUNCTION_CALL = 'func-call';
	const LITERAL = 'literal';
	const INPUT_VARIABLE = 'input-var';
	const REFERENCE = 'reference';
	const FORMAT = 'format';
	const INTERPOLATION = 'interpolation';
	const TEXT = 'text';

	function newBinaryOp(op, lhs, rhs) { return { type: BINARY_OP, op, lhs, rhs }; }
	function newUnaryOp(op, expr) { return { type: UNARY_OP, op, expr }; }
	function newFunctionCall(fn, args) { return { type: FUNCTION_CALL, fn, args }; }
	function newLiteral(value) { return { type: LITERAL, value }; }
	function newInputVariable(name) { return { type: INPUT_VARIABLE, name, }; }
	function newReference(id, modifier) { return { type: REFERENCE, id, modifier }; }
	function newFormat(segments) { return { type: FORMAT, segments }; }
	function newInterpolation(expr) { return { type: INTERPOLATION, expr }; }
	function newText(value) { return { type: TEXT, value }; }
}

Expression = _ expr:ExpressionTrim _ { return expr; }
ExpressionTrim = BinaryOp0

BinaryOp0
	= lhs:BinaryOp1 rest:BinaryOp0Rest* { return rest.reduce((lhs, { op, rhs }) => newBinaryOp(op, lhs, rhs), lhs); }
BinaryOp0Rest
	= _ op:("==" / "!=" / ">=" / "<=" / ">" / "<") _ rhs:BinaryOp1 { return { op, rhs }; }

BinaryOp1
	= lhs:BinaryOp2 rest:BinaryOp1Rest* { return rest.reduce((lhs, { op, rhs }) => newBinaryOp(op, lhs, rhs), lhs); }
BinaryOp1Rest
	= _ op:("+" / "-") _ rhs:BinaryOp2 { return { op, rhs }; }
	
BinaryOp2
	= lhs:Other rest:BinaryOp2Rest* { return rest.reduce((lhs, { op, rhs }) => newBinaryOp(op, lhs, rhs), lhs); }
BinaryOp2Rest
	= _ op:("*" / "/" / "%") _ rhs:Other { return { op, rhs }; }
	
Other
	= UnaryOp
	/ Parenthses
	/ FunctionCall
	/ Literal
	/ InputVariable
	/ Reference

UnaryOp
	= op:("+" / "-") expr:ExpressionTrim { return newUnaryOp(op, expr); }

Parenthses
	= "(" _ expr:ExpressionTrim _ ")" { return expr; }

FunctionCall
	= fn:$([a-z]+) _ "(" args:Arguments ")" { return newFunctionCall(fn, args); }
Arguments
	= _ first:ExpressionTrim _ rest:ArgumentsRest* { return [first, ...rest]; }
ArgumentsRest
	= "," _ expr:ExpressionTrim _ { return expr; }

Literal = value:$([0-9]+ ("." [0-9]+)?) { return newLiteral(Number(value)); }

InputVariable = "$" name:$([0-9a-z_]i+) { return newInputVariable(name); }

Reference = id:$([a-z_]i [0-9a-z_]i*) modifier:Modifier? { return newReference(id, modifier); }
Modifier = ":" id:$([0-9a-z_]i+) { return id; }

Format
	=  first:Text? rest:FormatRest* { return newFormat([first].concat(...rest).filter(x => x)); }
FormatRest
	=  interp:Interpolation successor:Text? { return [interp, successor]; }
Interpolation
	= "${" expr:Expression "}" { return newInterpolation(expr); }
Text
	= value:$(([^$] / "$$")+) { return newText(value.replace(/\$\$/g, "$")); }

_ = [ \t\r\n]*