const appState = {
  theme: 'dark',
  angleMode: 'deg',
  precision: 2,
  memory: 0,
  history: [],
  favorites: [],
  activeGeometry: 'square',
  activeThreeD: 'cube',
  activeResult: '0',
  activeExpression: '',
};

const STORAGE_KEYS = {
  theme: 'calcx-theme',
  history: 'calcx-history',
  favorites: 'calcx-favorites',
};

const geometryShapes = {
  square: {
    title: 'Square',
    fields: [
      { id: 'side', label: 'Side', min: 0 },
    ],
    formulas: [
      { label: 'Area', formula: 'A = s²' },
      { label: 'Perimeter', formula: 'P = 4s' },
      { label: 'Diagonal', formula: 'd = s√2' },
    ],
    calculate: ({ side }) => ({
      area: side * side,
      perimeter: 4 * side,
      diagonal: side * Math.sqrt(2),
    }),
  },
  rectangle: {
    title: 'Rectangle',
    fields: [
      { id: 'length', label: 'Length', min: 0 },
      { id: 'width', label: 'Width', min: 0 },
    ],
    formulas: [
      { label: 'Area', formula: 'A = l × w' },
      { label: 'Perimeter', formula: 'P = 2(l + w)' },
      { label: 'Diagonal', formula: 'd = √(l² + w²)' },
    ],
    calculate: ({ length, width }) => ({
      area: length * width,
      perimeter: 2 * (length + width),
      diagonal: Math.sqrt(length * length + width * width),
    }),
  },
  triangle: {
    title: 'Triangle',
    fields: [
      { id: 'base', label: 'Base', min: 0 },
      { id: 'height', label: 'Height', min: 0 },
      { id: 'sideA', label: 'Side A', min: 0 },
      { id: 'sideB', label: 'Side B', min: 0 },
      { id: 'sideC', label: 'Side C', min: 0 },
    ],
    formulas: [
      { label: 'Area', formula: 'A = ½ × b × h' },
      { label: 'Perimeter', formula: 'P = a + b + c' },
      { label: 'Heron', formula: 's = (a+b+c)/2, A = √(s(s-a)(s-b)(s-c))' },
    ],
    calculate: ({ base, height, sideA, sideB, sideC }) => {
      const area = 0.5 * base * height;
      const sides = [Number(sideA) || 0, Number(sideB) || 0, Number(sideC) || 0];
      const perimeter = sides.reduce((sum, side) => sum + side, 0);
      const semiperimeter = perimeter / 2;
      const heronArea =
        semiperimeter > 0 && sides.every((side) => side > 0)
          ? Math.sqrt(
              semiperimeter *
                (semiperimeter - sides[0]) *
                (semiperimeter - sides[1]) *
                (semiperimeter - sides[2])
            )
          : 0;
      return { area, perimeter, heronArea };
    },
  },
  circle: {
    title: 'Circle',
    fields: [{ id: 'radius', label: 'Radius', min: 0 }],
    formulas: [
      { label: 'Area', formula: 'A = πr²' },
      { label: 'Circumference', formula: 'C = 2πr' },
      { label: 'Diameter', formula: 'D = 2r' },
    ],
    calculate: ({ radius }) => ({
      area: Math.PI * radius * radius,
      circumference: 2 * Math.PI * radius,
      diameter: 2 * radius,
    }),
  },
  parallelogram: {
    title: 'Parallelogram',
    fields: [
      { id: 'base', label: 'Base', min: 0 },
      { id: 'height', label: 'Height', min: 0 },
      { id: 'side', label: 'Side', min: 0 },
    ],
    formulas: [
      { label: 'Area', formula: 'A = b × h' },
      { label: 'Perimeter', formula: 'P = 2(b + s)' },
    ],
    calculate: ({ base, height, side }) => ({
      area: base * height,
      perimeter: 2 * (base + side),
    }),
  },
  trapezoid: {
    title: 'Trapezium / Trapezoid',
    fields: [
      { id: 'base1', label: 'Base 1', min: 0 },
      { id: 'base2', label: 'Base 2', min: 0 },
      { id: 'height', label: 'Height', min: 0 },
      { id: 'side1', label: 'Side 1', min: 0 },
      { id: 'side2', label: 'Side 2', min: 0 },
    ],
    formulas: [
      { label: 'Area', formula: 'A = ½ × (a + b) × h' },
      { label: 'Perimeter', formula: 'P = a + b + c + d' },
    ],
    calculate: ({ base1, base2, height, side1, side2 }) => ({
      area: 0.5 * (base1 + base2) * height,
      perimeter: base1 + base2 + side1 + side2,
    }),
  },
  rhombus: {
    title: 'Rhombus',
    fields: [
      { id: 'diag1', label: 'Diagonal 1', min: 0 },
      { id: 'diag2', label: 'Diagonal 2', min: 0 },
      { id: 'side', label: 'Side', min: 0 },
    ],
    formulas: [
      { label: 'Area', formula: 'A = ½ × d₁ × d₂' },
      { label: 'Perimeter', formula: 'P = 4s' },
    ],
    calculate: ({ diag1, diag2, side }) => ({
      area: 0.5 * diag1 * diag2,
      perimeter: 4 * side,
    }),
  },
};

const threeDShapes = {
  cube: {
    title: 'Cube',
    fields: [{ id: 'side', label: 'Side', min: 0 }],
    formulas: [
      { label: 'Volume', formula: 'V = s³' },
      { label: 'Surface Area', formula: 'SA = 6s²' },
      { label: 'Lateral Surface Area', formula: 'LSA = 4s²' },
    ],
    calculate: ({ side }) => ({
      volume: side ** 3,
      surfaceArea: 6 * side * side,
      lateralSurfaceArea: 4 * side * side,
    }),
  },
  cuboid: {
    title: 'Cuboid',
    fields: [
      { id: 'length', label: 'Length', min: 0 },
      { id: 'width', label: 'Width', min: 0 },
      { id: 'height', label: 'Height', min: 0 },
    ],
    formulas: [
      { label: 'Volume', formula: 'V = l × w × h' },
      { label: 'Total Surface Area', formula: 'TSA = 2(lw + wh + hl)' },
      { label: 'Space Diagonal', formula: 'd = √(l² + w² + h²)' },
    ],
    calculate: ({ length, width, height }) => ({
      volume: length * width * height,
      totalSurfaceArea: 2 * (length * width + width * height + height * length),
      lateralSurfaceArea: 2 * height * (length + width),
      spaceDiagonal: Math.sqrt(length ** 2 + width ** 2 + height ** 2),
    }),
  },
  cylinder: {
    title: 'Cylinder',
    fields: [
      { id: 'radius', label: 'Radius', min: 0 },
      { id: 'height', label: 'Height', min: 0 },
    ],
    formulas: [
      { label: 'Volume', formula: 'V = πr²h' },
      { label: 'Curved Surface Area', formula: 'CSA = 2πrh' },
      { label: 'Total Surface Area', formula: 'TSA = 2πr(h + r)' },
    ],
    calculate: ({ radius, height }) => ({
      volume: Math.PI * radius * radius * height,
      curvedSurfaceArea: 2 * Math.PI * radius * height,
      totalSurfaceArea: 2 * Math.PI * radius * (height + radius),
    }),
  },
  cone: {
    title: 'Cone',
    fields: [
      { id: 'radius', label: 'Radius', min: 0 },
      { id: 'height', label: 'Height', min: 0 },
    ],
    formulas: [
      { label: 'Slant Height', formula: 'l = √(r² + h²)' },
      { label: 'Volume', formula: 'V = ⅓πr²h' },
      { label: 'Curved Surface Area', formula: 'CSA = πrl' },
    ],
    calculate: ({ radius, height }) => {
      const slantHeight = Math.sqrt(radius ** 2 + height ** 2);
      return {
        slantHeight,
        volume: (Math.PI * radius ** 2 * height) / 3,
        curvedSurfaceArea: Math.PI * radius * slantHeight,
        totalSurfaceArea: Math.PI * radius * (slantHeight + radius),
      };
    },
  },
  sphere: {
    title: 'Sphere',
    fields: [{ id: 'radius', label: 'Radius', min: 0 }],
    formulas: [
      { label: 'Volume', formula: 'V = 4/3 πr³' },
      { label: 'Surface Area', formula: 'SA = 4πr²' },
      { label: 'Diameter', formula: 'D = 2r' },
      { label: 'Circumference', formula: 'C = 2πr' },
    ],
    calculate: ({ radius }) => ({
      volume: (4 / 3) * Math.PI * radius ** 3,
      surfaceArea: 4 * Math.PI * radius ** 2,
      diameter: 2 * radius,
      circumference: 2 * Math.PI * radius,
    }),
  },
  hemisphere: {
    title: 'Hemisphere',
    fields: [{ id: 'radius', label: 'Radius', min: 0 }],
    formulas: [
      { label: 'Volume', formula: 'V = 2/3 πr³' },
      { label: 'Curved Surface Area', formula: 'CSA = 2πr²' },
      { label: 'Total Surface Area', formula: 'TSA = 3πr²' },
    ],
    calculate: ({ radius }) => ({
      volume: (2 / 3) * Math.PI * radius ** 3,
      curvedSurfaceArea: 2 * Math.PI * radius ** 2,
      totalSurfaceArea: 3 * Math.PI * radius ** 2,
    }),
  },
};

const unitSystem = {
  length: {
    units: {
      mm: { label: 'Millimeter (mm)', toBase: (value) => value / 1000, fromBase: (value) => value * 1000 },
      cm: { label: 'Centimeter (cm)', toBase: (value) => value / 100, fromBase: (value) => value * 100 },
      m: { label: 'Meter (m)', toBase: (value) => value, fromBase: (value) => value },
      km: { label: 'Kilometer (km)', toBase: (value) => value * 1000, fromBase: (value) => value / 1000 },
      inch: { label: 'Inch', toBase: (value) => value * 0.0254, fromBase: (value) => value / 0.0254 },
      foot: { label: 'Feet', toBase: (value) => value * 0.3048, fromBase: (value) => value / 0.3048 },
      yard: { label: 'Yard', toBase: (value) => value * 0.9144, fromBase: (value) => value / 0.9144 },
      mile: { label: 'Mile', toBase: (value) => value * 1609.344, fromBase: (value) => value / 1609.344 },
    },
    default: ['m', 'cm'],
  },
  area: {
    units: {
      'mm²': { label: 'Square millimeter', toBase: (value) => value / 1_000_000, fromBase: (value) => value * 1_000_000 },
      'cm²': { label: 'Square centimeter', toBase: (value) => value / 10_000, fromBase: (value) => value * 10_000 },
      'm²': { label: 'Square meter (m²)', toBase: (value) => value, fromBase: (value) => value },
      'km²': { label: 'Square kilometer', toBase: (value) => value * 1_000_000, fromBase: (value) => value / 1_000_000 },
      acre: { label: 'Acre', toBase: (value) => value * 4046.8564224, fromBase: (value) => value / 4046.8564224 },
      hectare: { label: 'Hectare', toBase: (value) => value * 10000, fromBase: (value) => value / 10000 },
      'ft²': { label: 'Square foot', toBase: (value) => value * 0.09290304, fromBase: (value) => value / 0.09290304 },
    },
    default: ['m²', 'ft²'],
  },
  volume: {
    units: {
      ml: { label: 'Milliliter', toBase: (value) => value / 1000, fromBase: (value) => value * 1000 },
      liter: { label: 'Liter', toBase: (value) => value, fromBase: (value) => value },
      'm³': { label: 'Cubic meter', toBase: (value) => value * 1000, fromBase: (value) => value / 1000 },
      'cm³': { label: 'Cubic centimeter', toBase: (value) => value / 1000, fromBase: (value) => value * 1000 },
      gallon: { label: 'Gallon', toBase: (value) => value * 3.78541, fromBase: (value) => value / 3.78541 },
    },
    default: ['liter', 'gallon'],
  },
  weight: {
    units: {
      mg: { label: 'Milligram', toBase: (value) => value / 1_000_000, fromBase: (value) => value * 1_000_000 },
      g: { label: 'Gram', toBase: (value) => value / 1000, fromBase: (value) => value * 1000 },
      kg: { label: 'Kilogram', toBase: (value) => value, fromBase: (value) => value },
      pound: { label: 'Pound', toBase: (value) => value * 0.45359237, fromBase: (value) => value / 0.45359237 },
      ounce: { label: 'Ounce', toBase: (value) => value * 0.0283495231, fromBase: (value) => value / 0.0283495231 },
    },
    default: ['kg', 'pound'],
  },
  temperature: {
    units: {
      celsius: { label: 'Celsius', toBase: (value) => value, fromBase: (value) => value },
      fahrenheit: { label: 'Fahrenheit', toBase: (value) => ((value - 32) * 5) / 9, fromBase: (value) => (value * 9) / 5 + 32 },
      kelvin: { label: 'Kelvin', toBase: (value) => value - 273.15, fromBase: (value) => value + 273.15 },
    },
    default: ['celsius', 'fahrenheit'],
  },
};

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  setupTheme();
  setupNavigation();
  setupScientificCalculator();
  setupGeometrySelector();
  setupThreeDSelector();
  setupDerivedCalculators();
  setupConverter();
  setupHistory();
  setupFavorites();
  renderAll();
}

function setupTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'dark';
  appState.theme = savedTheme;
  applyTheme(savedTheme);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const nextTheme = appState.theme === 'dark' ? 'light' : 'dark';
    appState.theme = nextTheme;
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
  });
}

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  const themeBtn = document.getElementById('themeToggle');
  themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function setupNavigation() {
  const tabs = document.querySelectorAll('.nav-btn');
  tabs.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.toggle('active', btn === button));
      document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.toggle('active', panel.id === target));
    });
  });
}

function setupScientificCalculator() {
  const input = document.getElementById('scientificInput');
  const resultBox = document.getElementById('scientificResult');
  const precisionSelect = document.getElementById('precisionSelect');

  if (precisionSelect) {
    precisionSelect.addEventListener('change', (event) => {
      appState.precision = Number(event.target.value);
      const currentText = resultBox.textContent;
      if (currentText && currentText !== '0' && currentText !== 'Please enter a valid expression.') {
        resultBox.textContent = formatNumber(Number(currentText.replace(/,/g, '')) || Number(appState.activeResult || 0));
      }
    });
  }

  document.querySelectorAll('.scientific-key').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.value;
      const action = button.dataset.action;

      if (action === 'calculate') {
        calculateScientific();
        return;
      }

      if (action === 'clear') {
        input.value = '';
        resultBox.textContent = '0';
        return;
      }

      if (action === 'backspace') {
        input.value = input.value.slice(0, -1);
        return;
      }

      if (action === 'negate') {
        const current = input.value.trim();
        if (!current) {
          input.value = '-';
        } else {
          const transformed = current.startsWith('-') ? current.slice(1) : `-${current}`;
          input.value = transformed;
        }
        return;
      }

      if (value) {
        input.value += normalizeScientificInput(value);
      }
    });
  });

  document.querySelectorAll('.memory-btn').forEach((button) => {
    button.addEventListener('click', () => {
      handleMemoryAction(button.dataset.memory);
    });
  });

  document.querySelectorAll('.mode-btn').forEach((button) => {
    button.addEventListener('click', () => {
      appState.angleMode = button.dataset.angle;
      document.querySelectorAll('.mode-btn').forEach((modeBtn) => modeBtn.classList.toggle('active', modeBtn === button));
      showToast(`Angle mode set to ${appState.angleMode.toUpperCase()}`);
    });
  });

  document.querySelector('[data-action="copy"]').addEventListener('click', copyResult);
  document.querySelector('[data-action="favorite"]').addEventListener('click', saveCurrentFavorite);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      calculateScientific();
    }

    if (event.key === 'Escape') {
      input.value = '';
      resultBox.textContent = '0';
    }

    if (event.key === 'Backspace') {
      return;
    }
  });

  input.addEventListener('input', () => {
    if (!input.value) {
      resultBox.textContent = '0';
    }
  });
}

function normalizeScientificInput(rawValue) {
  if (rawValue === '1/' ) return '1/';
  if (rawValue === '10^') return '10^';
  if (rawValue === '^2') return '^2';
  if (rawValue === '^3') return '^3';
  if (rawValue === 'factorial(') return 'factorial('; 
  if (rawValue === 'pi') return 'π';
  if (rawValue === 'e') return 'e';
  if (rawValue === 'phi') return 'φ';
  if (rawValue === 'pow(10,') return '10^';
  return rawValue;
}

function calculateScientific() {
  const expressionInput = document.getElementById('scientificInput');
  const resultBox = document.getElementById('scientificResult');
  const rawExpression = expressionInput.value.trim();

  if (!rawExpression) {
    showResultError('Please enter a valid expression.', resultBox);
    return;
  }

  try {
    const expression = prepareExpression(rawExpression);
    const value = evaluateSafeExpression(expression);

    if (!Number.isFinite(value)) {
      throw new Error('The result is not finite.');
    }

    const formatted = formatNumber(value);
    appState.activeExpression = rawExpression;
    appState.activeResult = String(value);
    resultBox.textContent = formatted;
    document.getElementById('globalResult').textContent = formatted;
    addToHistory(rawExpression, value, 'Scientific');
    showToast('Scientific calculation complete');
  } catch (error) {
    showResultError(error.message || 'Invalid scientific expression.', resultBox);
  }
}

function handleMemoryAction(action) {
  const input = document.getElementById('scientificInput');
  const result = document.getElementById('scientificResult');
  const currentValue = Number((result.textContent || '').replace(/,/g, ''));

  if (Number.isNaN(currentValue)) {
    showToast('No valid memory value available.');
    return;
  }

  if (action === 'mc') {
    appState.memory = 0;
    showToast('Memory cleared');
    return;
  }

  if (action === 'mr') {
    input.value = String(appState.memory);
    result.textContent = formatNumber(appState.memory);
    showToast('Memory recalled');
    return;
  }

  if (action === 'mplus') {
    appState.memory += currentValue;
    showToast('Stored in memory');
    return;
  }

  if (action === 'mminus') {
    appState.memory -= currentValue;
    showToast('Subtracted from memory');
    return;
  }
}

function prepareExpression(input) {
  let expression = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  expression = expression.replace(/π/g, 'pi');
  expression = expression.replace(/φ/g, 'phi');
  expression = expression.replace(/×/g, '*');
  expression = expression.replace(/\s+/g, '');

  expression = expression.replace(/(\d+(?:\.\d+)?)%/g, (_, number) => `(${number}/100)`);
  expression = expression.replace(/%/g, '%');

  const superscriptMap = {
    '²': '^2',
    '³': '^3',
    '⁴': '^4',
    '⁵': '^5',
    '⁶': '^6',
    '⁷': '^7',
    '⁸': '^8',
    '⁹': '^9',
  };

  Object.entries(superscriptMap).forEach(([source, target]) => {
    expression = expression.split(source).join(target);
  });

  expression = expression.replace(/\bmod\b/g, '%');
  expression = expression.replace(/\babs\b/g, 'abs');
  expression = expression.replace(/\bceil\b/g, 'ceil');
  expression = expression.replace(/\bfloor\b/g, 'floor');

  if (!/\d$/.test(expression) && !/[)piφe]$/.test(expression)) {
    expression = expression.replace(/\^$/, '');
  }

  return expression;
}

function evaluateSafeExpression(expression) {
  const sanitized = expression.replace(/\bpi\b/g, String(Math.PI));
  const tokens = tokenize(sanitized);
  const parser = new ExpressionParser(tokens, appState.angleMode);
  return parser.parse();
}

function tokenize(expression) {
  const tokens = [];
  let index = 0;

  while (index < expression.length) {
    const char = expression[index];

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let number = '';
      let sawDecimal = false;
      while (index < expression.length) {
        const current = expression[index];
        if (/[0-9]/.test(current)) {
          number += current;
          index += 1;
        } else if (current === '.' && !sawDecimal) {
          number += current;
          sawDecimal = true;
          index += 1;
        } else {
          break;
        }
      }
      if (number === '.' || number === '') {
        throw new Error('Invalid number detected.');
      }
      tokens.push({ type: 'number', value: Number(number) });
      continue;
    }

    if (/[A-Za-z]/.test(char) || char === 'π' || char === 'φ') {
      let identifier = '';
      while (index < expression.length && /[A-Za-z]/.test(expression[index])) {
        identifier += expression[index];
        index += 1;
      }
      if (identifier) {
        const lowered = identifier.toLowerCase();
        if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'log', 'ln', 'log10', 'sqrt', 'cbrt', 'abs', 'floor', 'ceil', 'factorial', 'exp'].includes(lowered)) {
          tokens.push({ type: 'function', value: lowered });
        } else if (lowered === 'mod') {
          tokens.push({ type: 'operator', value: '%' });
        } else if (lowered === 'pi' || lowered === 'e' || lowered === 'phi') {
          tokens.push({ type: 'constant', value: lowered });
        } else {
          throw new Error(`Unsupported function or symbol: ${identifier}`);
        }
      }
      continue;
    }

    if (['+', '-', '*', '/', '^', '%', '(', ')', ',','!'].includes(char)) {
      tokens.push({ type: 'operator', value: char });
      index += 1;
      continue;
    }

    throw new Error(`Unsupported character: ${char}`);
  }

  return tokens;
}

class ExpressionParser {
  constructor(tokens, angleMode) {
    this.tokens = tokens;
    this.index = 0;
    this.angleMode = angleMode;
  }

  parse() {
    const value = this.parseExpression();
    if (this.index !== this.tokens.length) {
      throw new Error('Could not parse the expression completely.');
    }
    return value;
  }

  parseExpression() {
    let value = this.parseTerm();
    while (this.matchOperator('+', '-')) {
      const operator = this.previous().value;
      const right = this.parseTerm();
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  }

  parseTerm() {
    let value = this.parsePower();
    while (this.matchOperator('*', '/', '%')) {
      const operator = this.previous().value;
      const right = this.parsePower();
      if (operator === '*') value *= right;
      if (operator === '/') value /= right;
      if (operator === '%') value %= right;
    }
    return value;
  }

  parsePower() {
    let value = this.parseUnary();
    if (this.matchOperator('^')) {
      const exponent = this.parsePower();
      value = Math.pow(value, exponent);
    }
    return value;
  }

  parseUnary() {
    if (this.matchOperator('+')) return this.parseUnary();
    if (this.matchOperator('-')) return -this.parseUnary();
    return this.parsePostfix();
  }

  parsePostfix() {
    let value = this.parsePrimary();
    while (this.matchOperator('!')) {
      value = factorial(value);
    }
    return value;
  }

  parsePrimary() {
    const token = this.current();

    if (!token) {
      throw new Error('Expression is incomplete.');
    }

    if (token.type === 'number') {
      this.index += 1;
      return token.value;
    }

    if (token.type === 'constant') {
      this.index += 1;
      if (token.value === 'pi') return Math.PI;
      if (token.value === 'phi') return (1 + Math.sqrt(5)) / 2;
      if (token.value === 'e') return Math.E;
      return 1;
    }

    if (token.type === 'function') {
      this.index += 1;
      const name = token.value;
      this.expectOperator('(');
      const args = [];
      if (!this.checkOperator(')')) {
        args.push(this.parseExpression());
        while (this.matchOperator(',')) {
          args.push(this.parseExpression());
        }
      }
      this.expectOperator(')');
      return applyFunction(name, args);
    }

    if (this.matchOperator('(')) {
      const inner = this.parseExpression();
      this.expectOperator(')');
      return inner;
    }

    throw new Error('Unexpected token in expression.');
  }

  current() {
    return this.tokens[this.index];
  }

  previous() {
    return this.tokens[this.index - 1];
  }

  matchOperator(...operators) {
    const token = this.current();
    if (!token || token.type !== 'operator') return false;
    if (!operators.includes(token.value)) return false;
    this.index += 1;
    return true;
  }

  expectOperator(operatorValue) {
    const token = this.current();
    if (!token || token.type !== 'operator' || token.value !== operatorValue) {
      throw new Error(`Expected ${operatorValue}.`);
    }
    this.index += 1;
  }

  checkOperator(operatorValue) {
    const token = this.current();
    return Boolean(token && token.type === 'operator' && token.value === operatorValue);
  }
}

function applyFunction(name, args) {
  const argument = args[0];
  const valueInRadians = (value) => (appState.angleMode === 'deg' ? (value * Math.PI) / 180 : value);

  switch (name) {
    case 'sin':
      return Math.sin(valueInRadians(argument));
    case 'cos':
      return Math.cos(valueInRadians(argument));
    case 'tan':
      return Math.tan(valueInRadians(argument));
    case 'asin':
      return (Math.asin(argument) * 180) / Math.PI;
    case 'acos':
      return (Math.acos(argument) * 180) / Math.PI;
    case 'atan':
      return (Math.atan(argument) * 180) / Math.PI;
    case 'sinh':
      return Math.sinh(argument);
    case 'cosh':
      return Math.cosh(argument);
    case 'tanh':
      return Math.tanh(argument);
    case 'log':
      return Math.log10(argument);
    case 'ln':
      return Math.log(argument);
    case 'log10':
      return Math.log10(argument);
    case 'sqrt':
      return Math.sqrt(argument);
    case 'cbrt':
      return Math.cbrt(argument);
    case 'abs':
      return Math.abs(argument);
    case 'floor':
      return Math.floor(argument);
    case 'ceil':
      return Math.ceil(argument);
    case 'factorial':
      return factorial(argument);
    case 'exp':
      return Math.exp(argument);
    default:
      throw new Error(` Unsupported function: ${name}`);
  }
}

function factorial(value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('Factorial requires a non-negative integer.');
  }
  let result = 1;
  for (let i = 2; i <= value; i += 1) {
    result *= i;
  }
  return result;
}

function showResultError(message, resultBox) {
  resultBox.textContent = message;
  resultBox.style.color = 'var(--danger)';
  document.getElementById('globalResult').textContent = message;
  document.getElementById('globalResult').style.color = 'var(--danger)';
  setTimeout(() => {
    resultBox.style.color = 'var(--primary)';
    document.getElementById('globalResult').style.color = 'var(--primary)';
  }, 2500);
}

function setupGeometrySelector() {
  const selector = document.getElementById('geometrySelector');
  Object.entries(geometryShapes).forEach(([key, shape]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `shape-card ${key === appState.activeGeometry ? 'active' : ''}`;
    button.dataset.shape = key;
    button.innerHTML = `<span>${shape.title}</span><small>2D</small>`;
    button.addEventListener('click', () => {
      appState.activeGeometry = key;
      renderGeometryShape();
    });
    selector.appendChild(button);
  });
  renderGeometryShape();
}

function renderGeometryShape() {
  const formContainer = document.getElementById('geometryForm');
  const shape = geometryShapes[appState.activeGeometry];
  const selectorButtons = document.querySelectorAll('#geometrySelector .shape-card');
  selectorButtons.forEach((button) => button.classList.toggle('active', button.dataset.shape === appState.activeGeometry));

  const fieldsMarkup = shape.fields
    .map(
      (field) => `
        <label>
          ${field.label}
          <input type="number" step="any" id="geometry-${field.id}" placeholder="Enter ${field.label.toLowerCase()}" />
        </label>
      `
    )
    .join('');

  formContainer.innerHTML = `
    <div class="form-grid">${fieldsMarkup}</div>
    <div class="action-row">
      <button type="button" class="primary-btn" id="geometryCalculateBtn">Calculate</button>
      <button type="button" class="secondary-btn" id="geometryResetBtn">Reset</button>
    </div>
    <div class="result-box">
      <span class="label">Geometry Results</span>
      <strong id="geometryResultDisplay">0</strong>
    </div>
  `;

  const resultTarget = document.getElementById('geometryResultDisplay');
  document.getElementById('geometryCalculateBtn').addEventListener('click', () => {
    calculateGeometryShape(shape, resultTarget);
  });
  document.getElementById('geometryResetBtn').addEventListener('click', () => {
    formContainer.querySelectorAll('input').forEach((input) => (input.value = ''));
    resultTarget.textContent = '0';
  });

  const formulaOutput = shape.formulas
    .map((item) => `<div class="formula-item"><strong>${item.label}:</strong> ${item.formula}</div>`)
    .join('');
  document.getElementById('formulaDisplay').innerHTML = `<div class="formula-item"><strong>${shape.title}</strong></div>${formulaOutput}`;
}

function calculateGeometryShape(shape, resultTarget) {
  const values = {};
  let hasEmpty = false;

  shape.fields.forEach((field) => {
    const fieldElement = document.getElementById(`geometry-${field.id}`);
    const value = Number(fieldElement.value);
    if (fieldElement.value.trim() === '') {
      hasEmpty = true;
      return;
    }
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`Please enter a valid ${field.label.toLowerCase()}.`);
    }
    values[field.id] = value;
  });

  if (hasEmpty) {
    resultTarget.textContent = 'Please fill in all required fields.';
    return;
  }

  try {
    const results = shape.calculate(values);
    const display = Object.entries(results)
      .map(([label, value]) => `${capitalize(label)}: ${formatNumber(value)}`)
      .join(' | ');
    resultTarget.textContent = display;
    document.getElementById('globalResult').textContent = display;
    appState.activeResult = display;
    addToHistory(`${shape.title} (${Object.entries(values).map(([key, val]) => `${key}=${val}`).join(', ')})`, display, shape.title);
  } catch (error) {
    resultTarget.textContent = error.message;
  }
}

function setupThreeDSelector() {
  const selector = document.getElementById('threeDSelector');
  Object.entries(threeDShapes).forEach(([key, shape]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `shape-card ${key === appState.activeThreeD ? 'active' : ''}`;
    button.dataset.shape = key;
    button.innerHTML = `<span>${shape.title}</span><small>3D</small>`;
    button.addEventListener('click', () => {
      appState.activeThreeD = key;
      renderThreeDShape();
    });
    selector.appendChild(button);
  });
  renderThreeDShape();
}

function renderThreeDShape() {
  const formContainer = document.getElementById('threeDForm');
  const shape = threeDShapes[appState.activeThreeD];
  const selectorButtons = document.querySelectorAll('#threeDSelector .shape-card');
  selectorButtons.forEach((button) => button.classList.toggle('active', button.dataset.shape === appState.activeThreeD));

  const fieldsMarkup = shape.fields
    .map(
      (field) => `
        <label>
          ${field.label}
          <input type="number" step="any" id="three-d-${field.id}" placeholder="Enter ${field.label.toLowerCase()}" />
        </label>
      `
    )
    .join('');

  formContainer.innerHTML = `
    <div class="form-grid">${fieldsMarkup}</div>
    <div class="action-row">
      <button type="button" class="primary-btn" id="threeDCalculateBtn">Calculate</button>
      <button type="button" class="secondary-btn" id="threeDResetBtn">Reset</button>
    </div>
    <div class="result-box">
      <span class="label">3D Results</span>
      <strong id="threeDResultDisplay">0</strong>
    </div>
  `;

  document.getElementById('threeDCalculateBtn').addEventListener('click', () => {
    calculateThreeDShape(shape, document.getElementById('threeDResultDisplay'));
  });
  document.getElementById('threeDResetBtn').addEventListener('click', () => {
    formContainer.querySelectorAll('input').forEach((input) => (input.value = ''));
    document.getElementById('threeDResultDisplay').textContent = '0';
  });

  const formulaOutput = shape.formulas
    .map((item) => `<div class="formula-item"><strong>${item.label}:</strong> ${item.formula}</div>`)
    .join('');
  document.getElementById('formulaDisplay').innerHTML = `<div class="formula-item"><strong>${shape.title}</strong></div>${formulaOutput}`;
}

function calculateThreeDShape(shape, resultTarget) {
  const values = {};
  shape.fields.forEach((field) => {
    const input = document.getElementById(`three-d-${field.id}`);
    if (!input || input.value.trim() === '') {
      resultTarget.textContent = `Please enter a valid ${field.label.toLowerCase()}.`;
      return;
    }
    const value = Number(input.value);
    if (!Number.isFinite(value) || value < 0) {
      resultTarget.textContent = `Please enter a valid ${field.label.toLowerCase()}.`;
      return;
    }
    values[field.id] = value;
  });

  if (Object.keys(values).length !== shape.fields.length) {
    return;
  }

  const results = shape.calculate(values);
  const display = Object.entries(results)
    .map(([label, value]) => `${capitalize(label)}: ${formatNumber(value)}`)
    .join(' | ');
  resultTarget.textContent = display;
  document.getElementById('globalResult').textContent = display;
  appState.activeResult = display;
  addToHistory(`${shape.title} (${Object.entries(values).map(([key, val]) => `${key}=${val}`).join(', ')})`, display, shape.title);
}

function setupConverter() {
  const categorySelect = document.getElementById('converterCategory');
  const fromUnit = document.getElementById('fromUnit');
  const toUnit = document.getElementById('toUnit');
  const resultEl = document.getElementById('convertedResult');

  function populateUnits() {
    const category = categorySelect.value;
    const units = unitSystem[category].units;
    const defaultPair = unitSystem[category].default;
    fromUnit.innerHTML = Object.entries(units)
      .map(([key, value]) => `<option value="${key}">${value.label}</option>`)
      .join('');
    toUnit.innerHTML = Object.entries(units)
      .map(([key, value]) => `<option value="${key}">${value.label}</option>`)
      .join('');

    fromUnit.value = defaultPair[0];
    toUnit.value = defaultPair[1];
  }

  categorySelect.addEventListener('change', populateUnits);
  document.getElementById('convertBtn').addEventListener('click', convertUnits);
  document.getElementById('convertResetBtn').addEventListener('click', () => {
    document.getElementById('convertInput').value = '';
    resultEl.textContent = '0';
  });

  populateUnits();
}

function convertUnits() {
  const category = document.getElementById('converterCategory').value;
  const fromUnit = document.getElementById('fromUnit').value;
  const toUnit = document.getElementById('toUnit').value;
  const rawValue = Number(document.getElementById('convertInput').value);

  if (!Number.isFinite(rawValue) || document.getElementById('convertInput').value.trim() === '') {
    document.getElementById('convertedResult').textContent = 'Please enter a valid value.';
    return;
  }

  const system = unitSystem[category];
  const fromConfig = system.units[fromUnit];
  const toConfig = system.units[toUnit];

  let convertedValue;
  if (category === 'temperature') {
    convertedValue = toConfig.fromBase(fromConfig.toBase(rawValue));
  } else {
    convertedValue = toConfig.fromBase(fromConfig.toBase(rawValue));
  }

  const formatted = formatNumber(convertedValue);
  document.getElementById('convertedResult').textContent = formatted;
  document.getElementById('globalResult').textContent = formatted;
  appState.activeResult = String(convertedValue);
  addToHistory(`${rawValue} ${fromUnit} → ${toUnit}`, convertedValue, `${category} conversion`);
}

function setupHistory() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]');
  appState.history = Array.isArray(saved) ? saved : [];
  renderHistory();
}

function setupFavorites() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]');
  appState.favorites = Array.isArray(saved) ? saved : [];
  renderFavorites();
}

function addToHistory(expression, result, label) {
  const entry = {
    id: Date.now() + Math.random(),
    expression: String(expression),
    result: Number.isFinite(Number(result)) ? Number(result) : String(result),
    label,
    timestamp: new Date().toISOString(),
  };

  appState.history.unshift(entry);
  saveToLocalStorage(STORAGE_KEYS.history, appState.history.slice(0, 40));
  renderHistory();
}

function renderHistory() {
  const historyList = document.getElementById('historyList');
  const standaloneList = document.getElementById('historyListStandalone');

  if (!appState.history.length) {
    historyList.innerHTML = '<li class="empty-state">No calculations yet.</li>';
    standaloneList.innerHTML = '<div class="empty-state">No calculations yet.</div>';
    return;
  }

  const buildItem = (entry) => {
    const resultText = typeof entry.result === 'number' ? formatNumber(entry.result) : String(entry.result);
    const displayExpression = entry.expression || 'Calculation';
    return `
      <li>
        <div class="history-expression">${escapeHtml(displayExpression)}</div>
        <div class="history-meta">
          <span>${escapeHtml(entry.label || 'Result')}</span>
          <button class="delete-history" data-history-id="${entry.id}" type="button">Delete</button>
        </div>
        <div class="history-result">= ${resultText}</div>
      </li>
    `;
  };

  historyList.innerHTML = appState.history.slice(0, 8).map(buildItem).join('');
  standaloneList.innerHTML = appState.history.map(buildItem).join('');

  historyList.querySelectorAll('.delete-history').forEach((button) => {
    button.addEventListener('click', () => deleteHistoryItem(Number(button.dataset.historyId)));
  });

  standaloneList.querySelectorAll('.delete-history').forEach((button) => {
    button.addEventListener('click', () => deleteHistoryItem(Number(button.dataset.historyId)));
  });
}

function deleteHistoryItem(id) {
  appState.history = appState.history.filter((item) => Number(item.id) !== Number(id));
  saveToLocalStorage(STORAGE_KEYS.history, appState.history);
  renderHistory();
}

function clearHistory() {
  appState.history = [];
  saveToLocalStorage(STORAGE_KEYS.history, []);
  renderHistory();
}

function setupFavorites() {
  document.getElementById('saveFavoriteBtn').addEventListener('click', saveCurrentFavorite);
  document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
  renderFavorites();
}

function saveCurrentFavorite() {
  const expression = appState.activeExpression || 'Current result';
  const result = appState.activeResult || '0';

  if (!expression || !result) {
    showToast('There is no valid result to save.');
    return;
  }

  const entry = {
    id: Date.now() + Math.random(),
    expression,
    result,
    createdAt: new Date().toISOString(),
  };

  appState.favorites.unshift(entry);
  saveToLocalStorage(STORAGE_KEYS.favorites, appState.favorites.slice(0, 20));
  renderFavorites();
  showToast('Favorite saved');
}

function renderFavorites() {
  const favoritesList = document.getElementById('favoritesList');

  if (!appState.favorites.length) {
    favoritesList.innerHTML = '<li class="empty-state">No favorites yet.</li>';
    return;
  }

  favoritesList.innerHTML = appState.favorites
    .map(
      (item) => `
        <li>
          <div class="favorite-expression">${escapeHtml(item.expression)}</div>
          <div class="favorite-meta">
            <span>= ${escapeHtml(String(item.result))}</span>
            <button class="delete-favorite" data-favorite-id="${item.id}" type="button">Delete</button>
          </div>
        </li>
      `
    )
    .join('');

  favoritesList.querySelectorAll('.delete-favorite').forEach((button) => {
    button.addEventListener('click', () => deleteFavorite(Number(button.dataset.favoriteId)));
  });
}

function deleteFavorite(id) {
  appState.favorites = appState.favorites.filter((item) => Number(item.id) !== Number(id));
  saveToLocalStorage(STORAGE_KEYS.favorites, appState.favorites);
  renderFavorites();
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadHistory() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]');
  appState.history = Array.isArray(saved) ? saved : [];
  renderHistory();
}

function loadFavorites() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]');
  appState.favorites = Array.isArray(saved) ? saved : [];
  renderFavorites();
}

function renderAll() {
  loadHistory();
  loadFavorites();
}

function copyResult() {
  const value = document.getElementById('globalResult').textContent.trim();
  if (!value || value === '0') {
    showToast('Nothing to copy yet.');
    return;
  }

  navigator.clipboard.writeText(value).then(
    () => showToast('Copied!'),
    () => showToast('Copy failed. Please retry.')
  );
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return 'Invalid';
  const num = Number(value);
  const digits = Number(appState.precision || 2);

  if (Math.abs(num) >= 1e9 || Math.abs(num) <= 1e-7) {
    return num.toExponential(digits);
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(num);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.addEventListener('DOMContentLoaded', () => {
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', clearHistory);
  }
});

const shapeFormulaMap = {
  square: 'Area: A = s² | Perimeter: P = 4s | Diagonal: d = s√2',
  rectangle: 'Area: A = l × w | Perimeter: P = 2(l + w) | Diagonal: d = √(l² + w²)',
  triangle: 'Area: A = ½ × b × h | Perimeter: P = a + b + c | Heron: s = (a+b+c)/2',
  circle: 'Area: A = πr² | Circumference: C = 2πr | Diameter: D = 2r',
  parallelogram: 'Area: A = b × h | Perimeter: P = 2(b + s)',
  trapezoid: 'Area: A = ½ × (a + b) × h | Perimeter: P = a + b + c + d',
  rhombus: 'Area: A = ½ × d₁ × d₂ | Perimeter: P = 4s',
};

const threeDShapeFormulaMap = {
  cube: 'Volume: V = s³ | Surface Area: SA = 6s² | Lateral SA: LSA = 4s²',
  cuboid: 'Volume: V = l × w × h | TSA = 2(lw + wh + hl)',
  cylinder: 'Volume: V = πr²h | CSA = 2πrh | TSA = 2πr(h + r)',
  cone: 'Slant Height: l = √(r² + h²) | Volume = ⅓πr²h',
  sphere: 'Volume: V = 4/3 πr³ | Surface Area: SA = 4πr²',
  hemisphere: 'Volume: V = 2/3 πr³ | CSA = 2πr² | TSA = 3πr²',
};

function updateFormulaDisplay() {
  const activeShape = geometryShapes[appState.activeGeometry];
  const formulaDisplay = document.getElementById('formulaDisplay');
  if (formulaDisplay) {
    formulaDisplay.innerHTML = `
      <div class="formula-item"><strong>${activeShape.title}</strong></div>
      ${activeShape.formulas.map((item) => `<div class="formula-item"><strong>${item.label}:</strong> ${item.formula}</div>`).join('')}
    `;
  }
}

function setupDerivedCalculators() {
  const container = document.getElementById('derivedCalculators');
  if (!container) return;

  const calculators = [
    { title: 'Rectangle Length', inputs: ['area', 'width'], formula: 'l = A / w' },
    { title: 'Rectangle Width', inputs: ['area', 'length'], formula: 'w = A / l' },
    { title: 'Rectangle Height', inputs: ['volume', 'length', 'width'], formula: 'h = V / (l × w)' },
    { title: 'Triangle Height', inputs: ['area', 'base'], formula: 'h = 2A / b' },
    { title: 'Circle Radius', inputs: ['area'], formula: 'r = √(A / π)' },
    { title: 'Circle Diameter', inputs: ['area'], formula: 'd = 2√(A / π)' },
    { title: 'Cylinder Height', inputs: ['volume', 'radius'], formula: 'h = V / (πr²)' },
    { title: 'Cylinder Radius', inputs: ['volume', 'height'], formula: 'r = √(V / (πh))' },
    { title: 'Cone Height', inputs: ['volume', 'radius'], formula: 'h = 3V / (πr²)' },
    { title: 'Distance Between Points', inputs: ['x1', 'y1', 'x2', 'y2'], formula: '√((x2-x1)²+(y2-y1)²)' },
    { title: 'Pythagorean Theorem', inputs: ['a', 'b'], formula: 'c = √(a² + b²)' },
  ];

  container.innerHTML = calculators
    .map(
      (calc) => `
        <div class="derived-card">
          <h4>${calc.title}</h4>
          <div class="field-row">
            ${calc.inputs
              .map(
                (input) => `
                  <label>
                    ${input.toUpperCase()}
                    <input type="number" step="any" data-derived="${calc.title}:${input}" placeholder="${input}" />
                  </label>
                `
              )
              .join('')}
          </div>
          <div class="formula-item"><strong>Formula:</strong> ${calc.formula}</div>
          <button type="button" class="secondary-btn" data-derived-calc="${calc.title}">Calculate</button>
        </div>
      `
    )
    .join('');

  container.querySelectorAll('[data-derived-calc]').forEach((button) => {
    button.addEventListener('click', () => {
      const title = button.dataset.derivedCalc;
      const card = button.closest('.derived-card');
      const inputs = card.querySelectorAll('input');
      const values = {};
      let valid = true;

      inputs.forEach((input) => {
        const value = Number(input.value);
        if (!input.value.trim() || !Number.isFinite(value) || value < 0) {
          valid = false;
          input.style.borderColor = 'var(--danger)';
        } else {
          input.style.borderColor = 'var(--panel-border)';
          const key = input.dataset.derived.split(':')[1];
          values[key] = value;
        }
      });

      if (!valid) {
        button.closest('.derived-card').querySelector('.formula-item').innerHTML = '<strong>Formula:</strong> Please enter valid values.';
        return;
      }

      const result = calculateDerived(title, values);
      button.closest('.derived-card').querySelector('.formula-item').innerHTML = `<strong>Formula:</strong> ${result}`;
      document.getElementById('globalResult').textContent = result;
      appState.activeResult = result;
      addToHistory(`${title} (${Object.entries(values).map(([k, v]) => `${k}=${v}`).join(', ')})`, result, 'Derived');
    });
  });
}

function calculateDerived(title, values) {
  switch (title) {
    case 'Rectangle Length':
      return `Length = ${formatNumber(values.area / values.width)}`;
    case 'Rectangle Width':
      return `Width = ${formatNumber(values.area / values.length)}`;
    case 'Rectangle Height':
      return `Height = ${formatNumber(values.volume / (values.length * values.width))}`;
    case 'Triangle Height':
      return `Height = ${formatNumber((2 * values.area) / values.base)}`;
    case 'Circle Radius':
      return `Radius = ${formatNumber(Math.sqrt(values.area / Math.PI))}`;
    case 'Circle Diameter':
      return `Diameter = ${formatNumber(2 * Math.sqrt(values.area / Math.PI))}`;
    case 'Cylinder Height':
      return `Height = ${formatNumber(values.volume / (Math.PI * values.radius ** 2))}`;
    case 'Cylinder Radius':
      return `Radius = ${formatNumber(Math.sqrt(values.volume / (Math.PI * values.height)))}`;
    case 'Cone Height':
      return `Height = ${formatNumber((3 * values.volume) / (Math.PI * values.radius ** 2))}`;
    case 'Distance Between Points':
      return `Distance = ${formatNumber(Math.hypot(values.x2 - values.x1, values.y2 - values.y1))}`;
    case 'Pythagorean Theorem':
      return `C = ${formatNumber(Math.hypot(values.a, values.b))}`;
    default:
      return '0';
  }
}

window.addEventListener('load', () => {
  document.querySelectorAll('.shape-card').forEach((card) => {
    card.addEventListener('click', () => updateFormulaDisplay());
  });
  updateFormulaDisplay();
});

const safeNumber = (value) => {
  if (!Number.isFinite(value)) {
    throw new Error('Result is not finite.');
  }
  return value;
};

const defaultParse = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error('Please enter a valid number.');
  }
  return parsed;
};

if (typeof window !== 'undefined') {
  window.CalcX = {
    safeNumber,
    defaultParse,
    formatNumber,
  };
}
