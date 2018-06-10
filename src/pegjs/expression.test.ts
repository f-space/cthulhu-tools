import Expression from "./expression";

describe("literal parsing", () => {
	test("integer", () => {
		expect(Expression.parse("1234")).toEqual({
			type: "literal",
			value: 1234,
		});
	})

	test("rational", () => {
		expect(Expression.parse("12.34")).toEqual({
			type: "literal",
			value: 12.34,
		});
	});

	test("sign", () => {
		expect(Expression.parse("+12.34")).toEqual({
			type: "literal",
			value: 12.34,
		});
		expect(Expression.parse("-12.34")).toEqual({
			type: "literal",
			value: -12.34,
		});
	});

	test("invalid", () => {
		expect(() => Expression.parse("12.")).toThrow();
		expect(() => Expression.parse(".34")).toThrow();
		expect(() => Expression.parse("+")).toThrow();
		expect(() => Expression.parse("- 12.34")).toThrow();
	});
});

describe("template parsing", () => {
	test("empty", () => {
		expect(Expression.parse("``")).toEqual({
			type: "template",
			segments: [],
		});
	});

	test("simple", () => {
		expect(Expression.parse("`test`")).toEqual({
			type: "template",
			segments: [
				{
					type: "text",
					value: "test",
				},
			],
		});
	});

	test("interpolation", () => {
		expect(Expression.parse("`{1234}`")).toEqual({
			type: "template",
			segments: [
				{
					type: "substitution",
					expr: {
						type: "literal",
						value: 1234,
					},
				},
			],
		});
	});

	test("nest", () => {
		expect(Expression.parse("`1{ `{2}3` }{4}`")).toEqual({
			type: "template",
			segments: [
				{
					type: "text",
					value: "1",
				},
				{
					type: "substitution",
					expr: {
						type: "template",
						segments: [
							{
								type: "substitution",
								expr: {
									type: "literal",
									value: 2,
								},
							},
							{
								type: "text",
								value: "3",
							},
						],
					},
				},
				{
					type: "substitution",
					expr: {
						type: "literal",
						value: 4,
					},
				},
			],
		});
	});

	test("escape", () => {
		expect(Expression.parse("`\\{\\\\\\`\\}`")).toEqual({
			type: "template",
			segments: [
				{
					type: "text",
					value: "{\\`}",
				},
			],
		});
	});

	test("invalid", () => {
		expect(() => Expression.parse("`\\`")).toThrow();
		expect(() => Expression.parse("`{\\}`")).toThrow();
		expect(() => Expression.parse("`{{}`")).toThrow();
	});
});

describe("variable parsing", () => {
	test("simple", () => {
		expect(Expression.parse("$x")).toEqual({
			type: "variable",
			name: "x",
		});
		expect(Expression.parse("$0")).toEqual({
			type: "variable",
			name: "0",
		});
	});

	test("multiple words", () => {
		expect(Expression.parse("$snake_case_var")).toEqual({
			type: "variable",
			name: "snake_case_var",
		});
	});

	test("invalid", () => {
		expect(() => Expression.parse("$")).toThrow();
		expect(() => Expression.parse("$camelCaseVar")).toThrow();
		expect(Expression.parse("$kebab-case-var")).not.toEqual({
			type: "variable",
			name: "kebab-case-var",
		});
	})
});

describe("reference parsing", () => {
	test("simple", () => {
		expect(Expression.parse("test")).toEqual({
			type: "reference",
			scope: null,
			id: "test",
			modifier: null,
		});
	});

	test("scope", () => {
		expect(Expression.parse("@my:test")).toEqual({
			type: "reference",
			scope: "my",
			id: "test",
			modifier: null,
		});
	});

	test("modifier", () => {
		expect(Expression.parse("@my:test:will")).toEqual({
			type: "reference",
			scope: "my",
			id: "test",
			modifier: "will",
		});
	});

	test("multiple words", () => {
		expect(Expression.parse("@snake_case_scope:snake_case_id:snake_case_modifier")).toEqual({
			type: "reference",
			scope: "snake_case_scope",
			id: "snake_case_id",
			modifier: "snake_case_modifier",
		});
	});

	test("invalid", () => {
		expect(() => Expression.parse("@my")).toThrow();
		expect(() => Expression.parse("@my::will")).toThrow();
		expect(() => Expression.parse(":will")).toThrow();
		expect(() => Expression.parse("@:test")).toThrow();
		expect(() => Expression.parse("test:")).toThrow();
		expect(() => Expression.parse("0w0")).toThrow();
		expect(() => Expression.parse("camelCaseRef")).toThrow();
		expect(Expression.parse("kebab-case-ref")).not.toEqual({
			type: "reference",
			scope: null,
			id: "kebab-case-ref",
			modifier: null,
		});
	});
});

describe("parentheses parsing", () => {
	test("simple", () => {
		expect(Expression.parse("(1234)")).toEqual({
			type: "literal",
			value: 1234,
		});
	});

	test("nest", () => {
		expect(Expression.parse("(((1234)))")).toEqual({
			type: "literal",
			value: 1234,
		});
	});

	test("priority", () => {
		expect(Expression.parse("2 * (3 + 4)")).toEqual({
			type: "binary-op",
			op: "*",
			lhs: {
				type: "literal",
				value: 2,
			},
			rhs: {
				type: "binary-op",
				op: "+",
				lhs: {
					type: "literal",
					value: 3,
				},
				rhs: {
					type: "literal",
					value: 4,
				},
			},
		});
	});

	test("invalid", () => {
		expect(() => Expression.parse("(()")).toThrow();
	});
});

describe("unary operator parsing", () => {
	function unary(op: string, value: number) {
		return {
			type: "unary-op",
			op,
			expr: { type: "literal", value },
		};
	}

	test("sign", () => {
		expect(Expression.parse("+(1234)")).toEqual(unary("+", 1234));
		expect(Expression.parse("-(1234)")).toEqual(unary("-", 1234));
	});

	test("invalid", () => {
		expect(()=>Expression.parse("+ (1234)")).toThrow();
	});
});

describe("binary operator parsing", () => {
	function binary(op: string, lhs: any, rhs: any) {
		return {
			type: "binary-op",
			op,
			lhs: typeof lhs !== 'number' ? lhs : { type: "literal", value: lhs },
			rhs: typeof rhs !== 'number' ? rhs : { type: "literal", value: rhs },
		};
	}

	test("equality", () => {
		expect(Expression.parse("1234 == 5678")).toEqual(binary("==", 1234, 5678));
		expect(Expression.parse("1234 != 5678")).toEqual(binary("!=", 1234, 5678));
	});

	test("comparison", () => {
		expect(Expression.parse("1234 >= 5678")).toEqual(binary(">=", 1234, 5678));
		expect(Expression.parse("1234 <= 5678")).toEqual(binary("<=", 1234, 5678));
		expect(Expression.parse("1234 > 5678")).toEqual(binary(">", 1234, 5678));
		expect(Expression.parse("1234 < 5678")).toEqual(binary("<", 1234, 5678));
	});

	test("arithmetic", () => {
		expect(Expression.parse("1234 + 5678")).toEqual(binary("+", 1234, 5678));
		expect(Expression.parse("1234 - 5678")).toEqual(binary("-", 1234, 5678));
		expect(Expression.parse("1234 * 5678")).toEqual(binary("*", 1234, 5678));
		expect(Expression.parse("1234 / 5678")).toEqual(binary("/", 1234, 5678));
		expect(Expression.parse("1234 % 5678")).toEqual(binary("%", 1234, 5678));
	});

	test("priority", () => {
		expect(Expression.parse("1+2+3+4")).toEqual(binary("+", binary("+", binary("+", 1, 2), 3), 4));
		expect(Expression.parse("1<2+3*4")).toEqual(binary("<", 1, binary("+", 2, binary("*", 3, 4))));
	});

	test("invalid", () => {
		expect(() => Expression.parse("1234 > = 5678")).toThrow();
		expect(() => Expression.parse("1234 %")).toThrow();
		expect(() => Expression.parse("% 5678")).toThrow();
	});
});

describe("function call parsing", () => {
	test("simple", () => {
		expect(Expression.parse("test()")).toEqual({
			type: "func-call",
			fn: "test",
			args: [],
		});
		expect(Expression.parse("test(1234, 5678)")).toEqual({
			type: "func-call",
			fn: "test",
			args: [
				{
					type: "literal",
					value: 1234,
				},
				{
					type: "literal",
					value: 5678,
				},
			],
		});
	});

	test("nest", () => {
		expect(Expression.parse("f(g(h()))")).toEqual({
			type: "func-call",
			fn: "f",
			args: [
				{
					type: "func-call",
					fn: "g",
					args: [
						{
							type: "func-call",
							fn: "h",
							args: []
						},
					],
				},
			],
		});
	});

	test("invalid", () => {
		expect(() => Expression.parse("test(1234,)")).toThrow();
		expect(() => Expression.parse("test(,5678)")).toThrow();
		expect(() => Expression.parse("log10()")).toThrow();
		expect(() => Expression.parse("snake_case_fn()")).toThrow();
		expect(() => Expression.parse("camelCaseFn()")).toThrow();
		expect(() => Expression.parse("kebab-case-fn()")).not.toEqual({
			type: "func-call",
			fn: "kebab-case-fn",
			args: [],
		});
	});
});