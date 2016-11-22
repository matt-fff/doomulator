function divide(left, right) {
  return left / right;
}

function multiply(left, right) {
  return left * right;
}

function add(left, right) {
  return left + right;
}

function subtract(left, right) {
  return left - right;
}

const operands = {
  '/': divide,
  '*': multiply,
  '+': add,
  '-': subtract
};

function isNumeric(value) {
  return (value >= 0 && value <= 9) || value === '.';
}

function isDecimal(value) {
  return value === '.';
}

function isOperand(value) {
  return operands[value] !== undefined;
}

function isEquals(value) {
  return value === '=';
}

function isAllClear(value) {
  return value === 'ac';
}

function isClearEntry(value) {
  return value === 'ce';
}

function isFirstOrder(value) {
  return value === '/' || value === '*';
}

function getNum(val) {
  if (val instanceof Array)
    return Number(val.join(''));

  return Number(val);
}

function round(value) {
  var strVal = value + '';
  var decIndex = strVal.indexOf('.');

  // Only round decimals
  if (decIndex < 0) return value;

  var limit = decIndex + 3;
  limit = limit <= strVal.length ? limit : strVal.length;

  var rounded = strVal.substring(0, limit);

  return rounded;
}

function calculateResult(stack) {
  var firstOrder = []; // Results from multiplication and division

  var k, left, op, right;
  for (k = 0; k < stack.length; k++) {
    if (isFirstOrder(stack[k + 1])) {
      left = getNum(stack[k++]);
      op = operands[stack[k++]];
      right = getNum(stack[k]);

      firstOrder.push(op(left, right));
    } else
      firstOrder.push(stack[k]);
  }

  var result = getNum(firstOrder[0]);
  for (k = 1; k + 1 < firstOrder.length; k++) {
    op = operands[firstOrder[k++]];
    right = getNum(firstOrder[k]);

    result = op(result, right);
  }

  return round(result);
}

$(document).ready(function() {
  
  var stack = [];
  var currentNumber = [];
  var currentDecimal = false;

  function flushCurrentNumber() {
    stack.push(currentNumber);
    
    currentDecimal = false;
    currentNumber = [];
  }

  function clearEntry() {
    if (currentNumber.length > 0) {
      currentDecimal = false;
      currentNumber = [];
    } else if (stack.length > 0) {
      var stackTail = stack.pop();

      // If the last value was an operand,
      // the easiest way to maintain consistency
      // is to reload the last numeric value
      // into the currentNumber variable
      if (isOperand(stackTail) && stack.length > 0) {
        loadValues(getNum(stack.pop()) + '');
      }
    }
  }
  
  function clearAll() {
    stack = [];
    currentNumber = [];
    currentDecimal = false;
    lastVal = null;
  }

  function getDisplay() {
    var output = '';
    if (stack.length > 0) {
      for (var k = 0; k < stack.length; k++) {
        if (stack[k] instanceof Array)
          output += stack[k].join('');
        else
          output += stack[k];
      }
    }

    if (currentNumber.length > 0)
      output += currentNumber.join('');
    else if (output.length <= 0)
      output += '0';

    return output;
  }

  function getLastVal() {
    if (currentNumber.length > 0) return currentNumber[currentNumber.length - 1];
    if (stack.length > 0) {
      if (stack[stack.length - 1] instanceof Array) {
        var element = stack[stack.length - 1];
        return element[element.length - 1];
      } else return stack[stack.length - 1];
    }

    return null;
  }
  
  $('button').click(function() {
    var value = $(this).attr('value');

    loadValue(value);
  });

  function loadValues(values) {
    for (var k = 0; k < values.length; k++) {
      loadValue(values.charAt(k));
    }
  }

  function loadValue(value) {
    var lastVal = getLastVal();

    if (isNumeric(value)) {          // Numeric
      
      // Handle decimal points
      if (isDecimal(value)) {
        // Skip double decimals
        if(currentDecimal) return;
        
        currentDecimal = true;
      }
      
      currentNumber.push(value);
    } else if (isOperand(value)) {   // Operand
      
      // Only valid if the last value was numeric
      if (!isNumeric(lastVal)) return;
      
      flushCurrentNumber();
      stack.push(value);
    } else if (isEquals(value)) {
      
      // Only valid if the last value was numeric
      if (!isNumeric(lastVal)) return;
      
      flushCurrentNumber();
      var result = calculateResult(stack) + '';
      clearAll();

      loadValues(result);

      return;
    } else if (isAllClear(value)) {
      clearAll();
    } else if (isClearEntry(value)) {
      value = clearEntry();
    }
    
    $('#display').html(getDisplay());
  }
});