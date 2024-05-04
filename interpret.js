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

        case 'int':
            return expr.value;

        case 'div':
            return evaluate(expr.value1) / evaluate(expr.value2);

        case 'mul':
            return evaluate(expr.value1) * evaluate(expr.value2);
    }
}