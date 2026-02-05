export const SAMPLE_LATEX_DATA = [
  {
    id: '1',
    content: "This question is straightforward. Let's solve it step by step.\nRemember: speed = distance / time.",
    type: 'text',
    category: 'Basic',
    description: 'Plain text without LaTeX',
  },
  {
    id: '2',
    content: "The formula for speed is $v = \\frac{d}{t}$.\nWe know that $a^2 + b^2 = c^2$ from the Pythagorean theorem.",
    type: 'inline',
    category: 'Basic',
    description: 'Inline math with fractions',
  },
  {
    id: '3',
    content: "If $x > 0$ and $x \\neq 1$, then $\\log x$ is defined and $x^n$ grows exponentially.",
    type: 'inline',
    category: 'Basic',
    description: 'Inequalities and logarithms',
  },
  {
    id: '4',
    content: "To calculate the area, we integrate the function:\n$$\nA = \\int_a^b f(x)\\,dx\n$$\nNow substitute the limits.",
    type: 'block',
    category: 'Calculus',
    description: 'Block math with integral',
  },
  {
    id: '15',
    content: "The derivative of $f(x) = x^n$ is:\n$$\n\\frac{d}{dx}(x^n) = nx^{n-1}\n$$\nThis is the power rule.",
    type: 'block',
    category: 'Calculus',
    description: 'Power rule derivative',
  },
  {
    id: '16',
    content: "Using the chain rule: $\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$\n\nFor $y = \\sin(x^2)$, let $u = x^2$:\n$$\n\\frac{dy}{dx} = \\cos(x^2) \\cdot 2x = 2x\\cos(x^2)\n$$",
    type: 'mixed',
    category: 'Calculus',
    description: 'Chain rule example',
  },
  {
    id: '17',
    content: "Integration by parts formula:\n$$\n\\int u\\,dv = uv - \\int v\\,du\n$$\nExample: $\\int x e^x dx = xe^x - e^x + C$",
    type: 'mixed',
    category: 'Calculus',
    description: 'Integration by parts',
  },
  {
    id: '18',
    content: "The Taylor series expansion of $e^x$ around $x = 0$:\n$$\ne^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots\n$$",
    type: 'block',
    category: 'Calculus',
    description: 'Taylor series expansion',
  },
  {
    id: '19',
    content: "L'Hôpital's Rule: If $\\lim_{x \\to a} \\frac{f(x)}{g(x)}$ is indeterminate, then:\n$$\n\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}\n$$",
    type: 'block',
    category: 'Calculus',
    description: "L'Hôpital's Rule",
  },
  {
    id: '20',
    content: "A $2 \\times 2$ matrix multiplication:\n$$\n\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix} = \\begin{pmatrix} ae+bg & af+bh \\\\ ce+dg & cf+dh \\end{pmatrix}\n$$",
    type: 'block',
    category: 'Linear Algebra',
    description: 'Matrix multiplication',
  },
  {
    id: '21',
    content: "The determinant of a $2 \\times 2$ matrix is $\\det(A) = ad - bc$ for $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$",
    type: 'inline',
    category: 'Linear Algebra',
    description: '2x2 determinant',
  },
  {
    id: '22',
    content: "Eigenvalue equation: $A\\vec{v} = \\lambda\\vec{v}$\n\nTo find eigenvalues, solve:\n$$\n\\det(A - \\lambda I) = 0\n$$",
    type: 'mixed',
    category: 'Linear Algebra',
    description: 'Eigenvalue equation',
  },
  {
    id: '23',
    content: "The dot product of vectors $\\vec{a} = (a_1, a_2, a_3)$ and $\\vec{b} = (b_1, b_2, b_3)$:\n$$\n\\vec{a} \\cdot \\vec{b} = a_1b_1 + a_2b_2 + a_3b_3 = |\\vec{a}||\\vec{b}|\\cos\\theta\n$$",
    type: 'block',
    category: 'Linear Algebra',
    description: 'Dot product formula',
  },
  {
    id: '24',
    content: "Cross product:\n$$\n\\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\vec{i} & \\vec{j} & \\vec{k} \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix}\n$$",
    type: 'block',
    category: 'Linear Algebra',
    description: 'Cross product determinant',
  },
  {
    id: '25',
    content: "Newton's Second Law: The net force on an object equals mass times acceleration:\n$$\n\\vec{F} = m\\vec{a}\n$$",
    type: 'block',
    category: 'Physics',
    description: "Newton's Second Law",
  },
  {
    id: '26',
    content: "Einstein's mass-energy equivalence:\n$$\nE = mc^2\n$$\nwhere $c \\approx 3 \\times 10^8$ m/s is the speed of light.",
    type: 'mixed',
    category: 'Physics',
    description: 'Mass-energy equivalence',
  },
  {
    id: '27',
    content: "The Schrödinger equation:\n$$\ni\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\vec{r}, t) = \\hat{H}\\Psi(\\vec{r}, t)\n$$",
    type: 'block',
    category: 'Physics',
    description: 'Schrödinger equation',
  },
  {
    id: '28',
    content: "Maxwell's equations in differential form:\n$$\n\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\epsilon_0}, \\quad \\nabla \\cdot \\vec{B} = 0\n$$\n$$\n\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}, \\quad \\nabla \\times \\vec{B} = \\mu_0\\vec{J} + \\mu_0\\epsilon_0\\frac{\\partial \\vec{E}}{\\partial t}\n$$",
    type: 'block',
    category: 'Physics',
    description: "Maxwell's equations",
  },
  {
    id: '29',
    content: "Kinematic equations:\n- $v = v_0 + at$\n- $x = x_0 + v_0 t + \\frac{1}{2}at^2$\n- $v^2 = v_0^2 + 2a(x - x_0)$",
    type: 'inline',
    category: 'Physics',
    description: 'Kinematic equations',
  },
  {
    id: '30',
    content: "Gravitational potential energy: $U = -\\frac{Gm_1m_2}{r}$\n\nGravitational force:\n$$\n\\vec{F} = -\\frac{Gm_1m_2}{r^2}\\hat{r}\n$$",
    type: 'mixed',
    category: 'Physics',
    description: 'Gravitational formulas',
  },
  {
    id: '8',
    content: "Using the identities:\n$$\n\\sin^2 x + \\cos^2 x = 1\n$$\nand\n$$\n\\tan x = \\frac{\\sin x}{\\cos x}\n$$\nwe can derive the result.",
    type: 'block',
    category: 'Trigonometry',
    description: 'Multiple block equations',
  },
  {
    id: '31',
    content: "Sum formulas:\n$$\n\\sin(A + B) = \\sin A \\cos B + \\cos A \\sin B\n$$\n$$\n\\cos(A + B) = \\cos A \\cos B - \\sin A \\sin B\n$$",
    type: 'block',
    category: 'Trigonometry',
    description: 'Angle addition formulas',
  },
  {
    id: '32',
    content: "Double angle formulas: $\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$ and $\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta$",
    type: 'inline',
    category: 'Trigonometry',
    description: 'Double angle formulas',
  },
  {
    id: '33',
    content: "Law of Cosines:\n$$\nc^2 = a^2 + b^2 - 2ab\\cos C\n$$\nLaw of Sines:\n$$\n\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}\n$$",
    type: 'block',
    category: 'Trigonometry',
    description: 'Laws of Cosines and Sines',
  },
  {
    id: '34',
    content: "Bayes' Theorem:\n$$\nP(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}\n$$",
    type: 'block',
    category: 'Probability',
    description: "Bayes' Theorem",
  },
  {
    id: '35',
    content: "The normal distribution PDF:\n$$\nf(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}\n$$",
    type: 'block',
    category: 'Probability',
    description: 'Normal distribution',
  },
  {
    id: '36',
    content: "Binomial coefficient: $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$\n\nBinomial probability:\n$$\nP(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}\n$$",
    type: 'mixed',
    category: 'Probability',
    description: 'Binomial distribution',
  },
  {
    id: '37',
    content: "Expected value: $E[X] = \\sum_{i} x_i P(x_i)$\n\nVariance: $\\text{Var}(X) = E[X^2] - (E[X])^2$",
    type: 'inline',
    category: 'Probability',
    description: 'Expected value and variance',
  },
  {
    id: '38',
    content: "The quadratic formula for $ax^2 + bx + c = 0$:\n$$\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n$$",
    type: 'block',
    category: 'Algebra',
    description: 'Quadratic formula',
  },
  {
    id: '39',
    content: "Euler's identity, often called the most beautiful equation:\n$$\ne^{i\\pi} + 1 = 0\n$$",
    type: 'block',
    category: 'Number Theory',
    description: "Euler's identity",
  },
  {
    id: '40',
    content: "The Fibonacci sequence: $F_n = F_{n-1} + F_{n-2}$ with $F_0 = 0, F_1 = 1$\n\nClosed form (Binet's formula):\n$$\nF_n = \\frac{\\phi^n - \\psi^n}{\\sqrt{5}}\n$$\nwhere $\\phi = \\frac{1+\\sqrt{5}}{2}$ is the golden ratio.",
    type: 'mixed',
    category: 'Number Theory',
    description: 'Fibonacci sequence',
  },
  {
    id: '41',
    content: "The Riemann zeta function:\n$$\n\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}\n$$",
    type: 'block',
    category: 'Number Theory',
    description: 'Riemann zeta function',
  },
  {
    id: '42',
    content: "Set operations:\n- Union: $A \\cup B = \\{x : x \\in A \\text{ or } x \\in B\\}$\n- Intersection: $A \\cap B = \\{x : x \\in A \\text{ and } x \\in B\\}$\n- Complement: $A^c = \\{x : x \\notin A\\}$",
    type: 'inline',
    category: 'Set Theory',
    description: 'Set operations',
  },
  {
    id: '43',
    content: "De Morgan's Laws:\n$$\n(A \\cup B)^c = A^c \\cap B^c\n$$\n$$\n(A \\cap B)^c = A^c \\cup B^c\n$$",
    type: 'block',
    category: 'Set Theory',
    description: "De Morgan's Laws",
  },
  {
    id: '44',
    content: "Logical quantifiers:\n- For all: $\\forall x \\in \\mathbb{R}, x^2 \\geq 0$\n- There exists: $\\exists x \\in \\mathbb{R} : x^2 = 2$",
    type: 'inline',
    category: 'Logic',
    description: 'Quantifiers',
  },
  {
    id: '5',
    content: "Consider the function $f(x) = \\frac{(x^2 + 3x + 5)(x^3 - 2x + 7)(x^4 + x^2 + 1)}{(x - 1)(x + 2)(x^2 + x + 1)}$ and analyze its behavior.",
    type: 'complex',
    category: 'Complex',
    description: 'Complex rational function',
  },
  {
    id: '6',
    content: "We now simplify $ \\frac{(a_1 + a_2 + a_3 + \\cdots + a_n)^2}{\\sqrt{(b_1^2 + b_2^2 + \\cdots + b_n^2)(c_1^2 + c_2^2 + \\cdots + c_n^2)}} $ before proceeding further in the solution.",
    type: 'complex',
    category: 'Complex',
    description: 'Complex fraction with summation',
  },
  {
    id: '7',
    content: "$\\left(a_1 + a_2 + a_3 + a_4 + a_5 + a_6 + a_7 + a_8 + a_9 + a_{10} + a_{11} + a_{12} + a_{13} + a_{14} + a_{15} + a_{16} + a_{17} + a_{18} + a_{19} + a_{20} + a_{21} + a_{22} + a_{23} + a_{24} + a_{25} + \\cdots + a_n \\right)^2$",
    type: 'overflow',
    category: 'Complex',
    description: 'Long expression for overflow testing',
  },
  {
    id: '9',
    content: "Let's solve this step by step.\nFirst, recall the identity $a^2 - b^2 = (a-b)(a+b)$.\nNow apply it to the expression:\n$$\nx^2 - 9\n$$\nFinally, factorize and simplify.",
    type: 'mixed',
    category: 'Algebra',
    description: 'Mixed inline and block math',
  },
  {
    id: '45',
    content: "The Cauchy-Schwarz inequality:\n$$\n\\left| \\sum_{i=1}^{n} a_i b_i \\right|^2 \\leq \\left( \\sum_{i=1}^{n} a_i^2 \\right) \\left( \\sum_{i=1}^{n} b_i^2 \\right)\n$$",
    type: 'block',
    category: 'Complex',
    description: 'Cauchy-Schwarz inequality',
  },
  {
    id: '46',
    content: "Fourier series representation:\n$$\nf(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} \\left( a_n \\cos\\frac{n\\pi x}{L} + b_n \\sin\\frac{n\\pi x}{L} \\right)\n$$",
    type: 'block',
    category: 'Complex',
    description: 'Fourier series',
  },
  {
    id: '47',
    content: "Circle formulas:\n- Area: $A = \\pi r^2$\n- Circumference: $C = 2\\pi r$\n- Arc length: $s = r\\theta$ (radians)",
    type: 'inline',
    category: 'Geometry',
    description: 'Circle formulas',
  },
  {
    id: '48',
    content: "Volume formulas:\n$$\nV_{\\text{sphere}} = \\frac{4}{3}\\pi r^3, \\quad V_{\\text{cone}} = \\frac{1}{3}\\pi r^2 h, \\quad V_{\\text{cylinder}} = \\pi r^2 h\n$$",
    type: 'block',
    category: 'Geometry',
    description: 'Volume formulas',
  },
  {
    id: '49',
    content: "Distance formula in 3D:\n$$\nd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}\n$$",
    type: 'block',
    category: 'Geometry',
    description: '3D distance formula',
  },
  {
    id: '10',
    content: "This expression is wrong: $ \\frac{a+b }{ c $ and should not crash.",
    type: 'invalid',
    category: 'Error Cases',
    description: 'Invalid LaTeX - unclosed fraction',
  },
  {
    id: '11',
    content: "Try rendering this: $ \\sqrt{2 + $ which is invalid.",
    type: 'invalid',
    category: 'Error Cases',
    description: 'Invalid LaTeX - unclosed sqrt',
  },
  {
    id: '12',
    content: "Here is something unsupported: $ \\unknowncommand{x} $.",
    type: 'invalid',
    category: 'Error Cases',
    description: 'Unknown command',
  },
  {
    id: '13',
    content: "The total cost is $500 and the discount is $50.",
    type: 'currency',
    category: 'Currency',
    description: 'Currency symbols',
  },
  {
    id: '14',
    content: "He earned $1000 in his first job.",
    type: 'currency',
    category: 'Currency',
    description: 'Currency example',
  },
];

export const LATEX_CATEGORIES = [
  'All',
  'Basic',
  'Calculus',
  'Linear Algebra',
  'Physics',
  'Trigonometry',
  'Probability',
  'Algebra',
  'Number Theory',
  'Set Theory',
  'Logic',
  'Geometry',
  'Complex',
  'Error Cases',
  'Currency',
];

export const QUICK_FORMULAS = [
  { label: 'Fraction', latex: '\\frac{a}{b}' },
  { label: 'Square Root', latex: '\\sqrt{x}' },
  { label: 'Power', latex: 'x^{n}' },
  { label: 'Subscript', latex: 'x_{i}' },
  { label: 'Integral', latex: '\\int_{a}^{b} f(x)\\,dx' },
  { label: 'Sum', latex: '\\sum_{i=1}^{n} x_i' },
  { label: 'Product', latex: '\\prod_{i=1}^{n} x_i' },
  { label: 'Limit', latex: '\\lim_{x \\to \\infty}' },
  { label: 'Derivative', latex: '\\frac{d}{dx}' },
  { label: 'Partial', latex: '\\frac{\\partial f}{\\partial x}' },
  { label: 'Matrix 2x2', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { label: 'Greek α', latex: '\\alpha, \\beta, \\gamma' },
  { label: 'Greek Σ', latex: '\\Sigma, \\Pi, \\Omega' },
  { label: 'Infinity', latex: '\\infty' },
  { label: 'Plus/Minus', latex: '\\pm' },
  { label: 'Approx', latex: '\\approx' },
  { label: 'Not Equal', latex: '\\neq' },
  { label: 'Less/Greater', latex: '\\leq, \\geq' },
  { label: 'Arrow', latex: '\\rightarrow' },
  { label: 'Sin/Cos', latex: '\\sin x, \\cos x' },
];

const STRESS_TEST_FORMULAS = [
  { content: "The quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$", type: 'quadratic' },
  { content: "Euler's identity: $e^{i\\pi} + 1 = 0$", type: 'euler' },
  { content: "The integral: $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$", type: 'gaussian' },
  { content: "Matrix determinant: $\\det(A) = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc$", type: 'matrix' },
  { content: "Summation: $\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}$", type: 'summation' },
  { content: "Pythagorean theorem: $a^2 + b^2 = c^2$", type: 'pythagorean' },
  { content: "Derivative: $\\frac{d}{dx}[\\sin(x)] = \\cos(x)$", type: 'derivative' },
  { content: "Binomial expansion: $(x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k$", type: 'binomial' },
  { content: "Limit definition: $\\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$", type: 'limit' },
  { content: "Maxwell's equation: $\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}$", type: 'maxwell' },
  { content: "Schrödinger equation: $i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi$", type: 'schrodinger' },
  { content: "Taylor series: $f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n$", type: 'taylor' },
  { content: "Cross product: $\\vec{a} \\times \\vec{b} = |\\vec{a}||\\vec{b}|\\sin\\theta\\,\\hat{n}$", type: 'cross' },
  { content: "Cauchy-Schwarz: $|\\langle u, v \\rangle|^2 \\leq \\langle u, u \\rangle \\cdot \\langle v, v \\rangle$", type: 'cauchy' },
  { content: "Normal distribution: $f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$", type: 'normal' },
  { content: "Trigonometric identity: $\\sin^2\\theta + \\cos^2\\theta = 1$", type: 'trig' },
  { content: "Chain rule: $\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$", type: 'chain' },
  { content: "Fibonacci: $F_n = F_{n-1} + F_{n-2}$, with $F_0 = 0$ and $F_1 = 1$", type: 'fibonacci' },
  { content: "Complex number: $z = r(\\cos\\theta + i\\sin\\theta) = re^{i\\theta}$", type: 'complex' },
  { content: "Integration by parts: $\\int u\\,dv = uv - \\int v\\,du$", type: 'parts' },
  { content: "Logarithm: $\\log_b(xy) = \\log_b(x) + \\log_b(y)$", type: 'log' },
  { content: "Partial derivative: $\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h,y) - f(x,y)}{h}$", type: 'partial' },
  { content: "Vector magnitude: $|\\vec{v}| = \\sqrt{v_x^2 + v_y^2 + v_z^2}$", type: 'magnitude' },
  { content: "Set theory: $A \\cup B = \\{x : x \\in A \\lor x \\in B\\}$", type: 'set' },
  { content: "Bayes' theorem: $P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$", type: 'bayes' },
  { content: "Geometric series: $\\sum_{n=0}^{\\infty} ar^n = \\frac{a}{1-r}$ for $|r| < 1$", type: 'geometric' },
  { content: "Energy-mass: $E = mc^2$", type: 'einstein' },
  { content: "Stirling's approximation: $n! \\approx \\sqrt{2\\pi n}\\left(\\frac{n}{e}\\right)^n$", type: 'stirling' },
  { content: "Divergence: $\\nabla \\cdot \\vec{F} = \\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y} + \\frac{\\partial F_z}{\\partial z}$", type: 'divergence' },
  { content: "Laplacian: $\\nabla^2 f = \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2}$", type: 'laplacian' },
  { content: "Gamma function: $\\Gamma(n) = (n-1)! = \\int_0^\\infty t^{n-1}e^{-t}dt$", type: 'gamma' },
  { content: "Fourier transform: $\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x)e^{-2\\pi ix\\xi}dx$", type: 'fourier' },
  { content: "Double integral: $\\iint_R f(x,y)\\,dA$", type: 'double' },
  { content: "Limit: $\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e$", type: 'elimit' },
  { content: "Product notation: $\\prod_{i=1}^{n} a_i = a_1 \\cdot a_2 \\cdot \\ldots \\cdot a_n$", type: 'product' },
  { content: "Hyperbolic: $\\sinh(x) = \\frac{e^x - e^{-x}}{2}$", type: 'hyperbolic' },
  { content: "Gradient: $\\nabla f = \\frac{\\partial f}{\\partial x}\\hat{i} + \\frac{\\partial f}{\\partial y}\\hat{j}$", type: 'gradient' },
  { content: "Residue theorem: $\\oint_C f(z)\\,dz = 2\\pi i \\sum \\text{Res}(f, a_k)$", type: 'residue' },
  { content: "Trace: $\\text{tr}(A) = \\sum_{i=1}^{n} a_{ii}$", type: 'trace' },
  { content: "Area under curve: $A = \\int_a^b f(x)\\,dx$", type: 'area' },
  { content: "Kinetic energy: $KE = \\frac{1}{2}mv^2$", type: 'kinetic' },
  { content: "Wave equation: $\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\frac{\\partial^2 u}{\\partial x^2}$", type: 'wave' },
  { content: "Combination: $\\binom{n}{r} = \\frac{n!}{r!(n-r)!}$", type: 'combination' },
  { content: "Dot product: $\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta$", type: 'dot' },
  { content: "Exponential decay: $N(t) = N_0 e^{-\\lambda t}$", type: 'decay' },
  { content: "Heat equation: $\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u$", type: 'heat' },
  { content: "Power series: $\\frac{1}{1-x} = \\sum_{n=0}^{\\infty} x^n$ for $|x| < 1$", type: 'power' },
  { content: "Arc length: $L = \\int_a^b \\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2}\\,dx$", type: 'arc' },
  { content: "Variance: $\\sigma^2 = E[(X - \\mu)^2] = E[X^2] - (E[X])^2$", type: 'variance' },
  { content: "Moment of inertia: $I = \\int r^2\\,dm$", type: 'inertia' },
];

export const PERFORMANCE_TEST_DATA = Array.from({ length: 50 }, (_, index) => {
  const formula = STRESS_TEST_FORMULAS[index % STRESS_TEST_FORMULAS.length];
  return {
    id: `perf-${index + 1}`,
    content: formula.content,
    type: formula.type,
    description: `Stress test #${index + 1}`,
    index: index + 1,
  };
});

export const ALL_TEST_DATA = [...SAMPLE_LATEX_DATA, ...PERFORMANCE_TEST_DATA];

export const LATEX_PATTERNS = {
  BLOCK_MATH: /\$\$([\s\S]*?)\$\$/g,
  INLINE_MATH: /\$([^$]+)\$/g,
  CURRENCY: /\$\d+/g,
};

export const containsLatex = (text) => {
  if (!text || typeof text !== 'string') return false;
  
  if (/\$\$[\s\S]+\$\$/.test(text)) return true;
  
  const inlineMatches = text.match(/\$[^$]+\$/g);
  if (inlineMatches) {
    const nonCurrency = inlineMatches.filter(match => !/^\$\d+$/.test(match));
    return nonCurrency.length > 0;
  }
  
  return false;
};

export const parseLatexContent = (text) => {
  if (!text || typeof text !== 'string') return [{ type: 'text', content: '' }];
  
  const segments = [];
  let remaining = text;
  
  const blockParts = remaining.split(/(\$\$[\s\S]*?\$\$)/);
  
  blockParts.forEach(part => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const mathContent = part.slice(2, -2).trim();
      segments.push({ type: 'block-math', content: mathContent });
    } else if (part.trim()) {
      const inlineParts = part.split(/(\$[^$]+\$)/);
      
      inlineParts.forEach(inlinePart => {
        if (inlinePart.startsWith('$') && inlinePart.endsWith('$') && !inlinePart.startsWith('$$')) {
          const content = inlinePart.slice(1, -1);
          if (/^\d+$/.test(content)) {
            segments.push({ type: 'text', content: inlinePart });
          } else {
            segments.push({ type: 'inline-math', content: content });
          }
        } else if (inlinePart) {
          segments.push({ type: 'text', content: inlinePart });
        }
      });
    }
  });
  
  return segments.length > 0 ? segments : [{ type: 'text', content: text }];
};

export default {
  SAMPLE_LATEX_DATA,
  PERFORMANCE_TEST_DATA,
  ALL_TEST_DATA,
  LATEX_PATTERNS,
  containsLatex,
  parseLatexContent,
};
