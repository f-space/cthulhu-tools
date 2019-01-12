{
	const BINARY_OP = 'binary-op';
	const UNARY_OP = 'unary-op';
	const FUNCTION_CALL = 'func-call';
	const LITERAL = 'literal';
	const TEMPLATE = 'template';
	const SUBSTITUTION = 'substitution';
	const TEXT = 'text';
	const VARIABLE = 'variable';
	const REFERENCE = 'reference';

	function newBinaryOp(op, lhs, rhs) { return { type: BINARY_OP, op, lhs, rhs }; }
	function newUnaryOp(op, expr) { return { type: UNARY_OP, op, expr }; }
	function newFunctionCall(fn, args) { return { type: FUNCTION_CALL, fn, args }; }
	function newLiteral(value) { return { type: LITERAL, value }; }
	function newTemplate(segments) { return { type: TEMPLATE, segments }; }
	function newSubstitution(expr) { return { type: SUBSTITUTION, expr }; }
	function newText(value) { return { type: TEXT, value }; }
	function newVariable(name) { return { type: VARIABLE, name, }; }
	function newReference(id, modifier, scope) { return { type: REFERENCE, id, modifier, scope }; }

	function mergeBinaryOp(first, rest) {
		return rest.reduce(function(lhs, next) { return newBinaryOp(next.op, lhs, next.rhs); }, first);
	}

	function identity(x) { return x; }
}

Expression = _ expr:ExpressionTrim _ { return expr; }
ExpressionTrim = BinaryOp0

BinaryOp0
	= lhs:BinaryOp1 rest:BinaryOp0Rest* { return mergeBinaryOp(lhs, rest); }
BinaryOp0Rest
	= _ op:("==" / "!=" / ">=" / "<=" / ">" / "<") _ rhs:BinaryOp1 { return { op, rhs }; }

BinaryOp1
	= lhs:BinaryOp2 rest:BinaryOp1Rest* { return mergeBinaryOp(lhs, rest); }
BinaryOp1Rest
	= _ op:("+" / "-") _ rhs:BinaryOp2 { return { op, rhs }; }
	
BinaryOp2
	= lhs:Other rest:BinaryOp2Rest* { return mergeBinaryOp(lhs, rest); }
BinaryOp2Rest
	= _ op:("*" / "/" / "%") _ rhs:Other { return { op, rhs }; }
	
Other
	= Literal
	/ Template
	/ Parentheses
	/ UnaryOp
	/ FunctionCall
	/ Variable
	/ Reference

Literal = value:$([+-]? [0-9]+ ("." [0-9]+)? ("e" [+-]? [0-9]+)?) { return newLiteral(Number(value)); }

Template
	=  "\"" first:Text? rest:TemplateRest* "\"" { return newTemplate(Array.prototype.concat.apply([first], rest).filter(identity)); }
TemplateRest
	=  substitution:Substitution successor:Text? { return [substitution, successor]; }
Substitution
	= "{" expr:Expression "}" { return newSubstitution(expr); }
Text
	= value:$(([^"{}\\] / "\\" .)+) { return newText(value.replace(/\\(.)/g, "$1")); }

Parentheses
	= "(" _ expr:ExpressionTrim _ ")" { return expr; }

UnaryOp
	= op:("+" / "-") expr:ExpressionTrim { return newUnaryOp(op, expr); }

FunctionCall
	= fn:$([a-z]+) _ "(" args:Arguments? ")" { return newFunctionCall(fn, args || []); }
Arguments
	= _ first:ExpressionTrim _ rest:ArgumentsRest* { return [first].concat(rest); }
ArgumentsRest
	= "," _ expr:ExpressionTrim _ { return expr; }

Variable = "$" name:$([0-9a-z_]+) { return newVariable(name); }

Reference = scope:Scope? id:Identifier modifier:Modifier? { return newReference(id, modifier || '', scope || ''); }
Scope = "@" scope:$([0-9a-z_]+) ":" { return scope; }
Identifier = id:$([a-z_] [0-9a-z_]*) { return id; }
Modifier = ":" modifier:$([0-9a-z_]+) { return modifier; }

_ = [ \t\r\n]*