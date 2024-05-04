Array.prototype.indexes = function(...args) {
	const indexes = [];
	this.forEach((val, index) => {
		if (args.find(item => item.type === val.type) !== undefined) {
			indexes.push(index)
		}
	})
	return indexes;
}

const varRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/
const takenVarNames = []
function isValidVarName(varName) {
	if (takenVarNames.includes(varName)) {
		return false
	}
	if (!varRegex.exec(varName)) {
		return false
	}
	return true
}


operations = {
	'+': 'add',
	'-': 'sub',
	'*': 'mul',
	'/': 'div',
}
function lexicalAnalysiseExpression(expression, lineNum) {
	let part = ''
	const answer = []
	let charIndex = 0
	while (charIndex < expression.length) {
		part = ''
		const startCharIndex = charIndex
		let operation = null
		for (char of expression.slice(charIndex).trim()) {
			charIndex += 1
			if (char == ' ') {
				operation = expression.slice(charIndex).trim()[0]
				charIndex += expression.slice(charIndex).length - expression.slice(charIndex).trim().length
				charIndex += 1
				break
			}
			if (operations.hasOwnProperty(char) && (char != '-' || charIndex != (startCharIndex + 1))) {
				operation = char
				break
			}
			part += char
		}

		if (!isNaN(parseInt(part.trim()))) {
			answer.push({
				type: 'int',
				value: parseInt(part.trim())
			})
		} else if (!isNaN(parseFloat(part.trim()))) {
			answer.push({
				type: 'float',
				value: parseFloat(part.trim())
			})
		} else if (isValidVarName(part.trim())) {
			answer.push({
				type: 'varGet',
				name: part.trim()
			})
		} else {
			return `Invalid syntax on line ${lineNum}`
		}
		if (operation == null) {
			break
		}
		answer.push({
			type: operations[operation]
		})
	}
	return answer
}


function lexicalAnalysise(code) {
	const lexicalAnalysis = []
	const addTos = [lexicalAnalysis]
	code.split('\n').forEach((line, lineNum) => {
		line = line.trim()
		if (line.startsWith('say ')) {
			let lexicalAnalysedExpression = lexicalAnalysiseExpression(line.slice(4), lineNum)
			if ((typeof lexicalAnalysedExpression) == 'string') {
				return lexicalAnalysedExpression
			}
			addTos[0].push({
				type: 'say',
				value: lexicalAnalysedExpression,
				lineNum: lineNum
			})
		}
	})
	return lexicalAnalysis
}
function stematedAnalysiseExperssion(lexicalAnalysedExpresstion) {
	subtract = 0
	const stematedAnalysisedExperssion = JSON.parse(JSON.stringify(lexicalAnalysedExpresstion))
	for (index of stematedAnalysisedExperssion.indexes({ type: 'mul' }, { type: 'div' })) {
		const replaceWith = {
			type: stematedAnalysisedExperssion[index - subtract].type,
			value1: stematedAnalysisedExperssion[index - subtract - 1],
			value2: stematedAnalysisedExperssion[index - subtract + 1]
		}
		stematedAnalysisedExperssion.splice(index - subtract - 1, 3, replaceWith)
		subtract += 2
	}
	subtract = 0
	for (index of stematedAnalysisedExperssion.indexes({ type: 'add' }, { type: 'sub' })) {
		const replaceWith = {
			type: stematedAnalysisedExperssion[index - subtract].type,
			value1: stematedAnalysisedExperssion[index - subtract - 1],
			value2: stematedAnalysisedExperssion[index - subtract + 1]
		}
		stematedAnalysisedExperssion.splice(index - subtract - 1, 3, replaceWith)
		subtract += 2
	}
	return stematedAnalysisedExperssion[0]
}

function stematedAnalysise(lexicalAnalysed) {
	const stematedAnalysed = []
	for (step of lexicalAnalysed) {
		switch (step.type) {
			case 'say':
				stematedAnalysed.push({
					type: 'say',
					value: stematedAnalysiseExperssion(step.value),
					lineNum: step.lineNum
				})
				break;
		}
	}
	return stematedAnalysed
}


function compile(code, inputs) {
	const lexicalAnalysised = lexicalAnalysise(code)
	const consoleOutput = []
	if (typeof lexicalAnalysised == 'string') {
		consoleOutput.push(lexicalAnalysised)
		return consoleOutput
	}
	const stematedAnalysised = stematedAnalysise(lexicalAnalysised)
	return stematedAnalysised
}

function interpret(statements) {
	const output = [];

	for (const statement of statements) {
		switch (statement.type) {
		case 'say':
			output.push(evaluate(statement.value));
			break;
        }
	}

	return output;
}

function evaluate(expr) {
	switch (expr.type) {
	case 'int':
		return expr.value;

	case 'mul':
		return evaluate(expr.value1) * evaluate(expr.value2);
	}
}