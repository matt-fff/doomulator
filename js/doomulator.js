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

function calculateResult(stack) {
  return 7;
}

$(document).ready(function() {
  
  var stack = [];
  var currentNumber = [];
  var currentDecimal = false;
  var lastVal = null;

  function flushCurrentNumber() {
    stack.push(Number(currentNumber.join()));
    
    currentDecimal = false;
    currentNumber = [];
  }

  function clearEntry() {
    if (currentNumber.length > 0) {
      currentDecimal = false;
      currentNumber = [];
    } else if (stack.length > 0) {
      stack.pop();
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
    if (stack.length > 0)
      output += stack.join('');

    if (currentNumber.length > 0)
      output += currentNumber.join('');
    else if (output.length <= 0)
      output += '0';
    
    return output;
  }
  
  $('button').click(function() {
    var value = $(this).attr('value');

    loadValue(value);
  });

  function loadValue(value) {

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

      for (var k = 0; k < result.length; k++) {
        loadValue(result.charAt(k));
      }

      return;
    } else if (isAllClear(value)) {
      clearAll();
    } else if (isClearEntry(value)) {
      clearEntry();
    }
    
    lastVal = value;
    
    $('#display').html(getDisplay());
  }
});