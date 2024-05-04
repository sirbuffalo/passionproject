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
        case 'add':
            return evaluate(expr.value1) + evaluate(expr.value2);

        case 'div':
            return evaluate(expr.value1) / evaluate(expr.value2);

        case 'int':
            return expr.value;

        case 'mul':
            return evaluate(expr.value1) * evaluate(expr.value2);

        case 'sub':
            return evaluate(expr.value1) - evaluate(expr.value2);
    }
}