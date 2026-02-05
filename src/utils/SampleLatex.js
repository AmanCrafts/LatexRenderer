export const SAMPLE_LATEX_DATA = [
  {
    id: '1',
    content: "This question is straightforward. Let's solve it step by step.\nRemember: speed = distance / time.",
    type: 'text',
    description: 'Plain text without LaTeX',
  },
  {
    id: '2',
    content: "The formula for speed is $v = \\frac{d}{t}$.\nWe know that $a^2 + b^2 = c^2$ from the Pythagorean theorem.",
    type: 'inline',
    description: 'Inline math with fractions',
  },
  {
    id: '3',
    content: "If $x > 0$ and $x \\neq 1$, then $\\log x$ is defined and $x^n$ grows exponentially.",
    type: 'inline',
    description: 'Inequalities and logarithms',
  },
  {
    id: '4',
    content: "To calculate the area, we integrate the function:\n$$\nA = \\int_a^b f(x)\\,dx\n$$\nNow substitute the limits.",
    type: 'block',
    description: 'Block math with integral',
  },
  {
    id: '5',
    content: "Consider the function $f(x) = \\frac{(x^2 + 3x + 5)(x^3 - 2x + 7)(x^4 + x^2 + 1)}{(x - 1)(x + 2)(x^2 + x + 1)}$ and analyze its behavior.",
    type: 'complex',
    description: 'Complex rational function',
  },
  {
    id: '6',
    content: "We now simplify $ \\frac{(a_1 + a_2 + a_3 + \\cdots + a_n)^2}{\\sqrt{(b_1^2 + b_2^2 + \\cdots + b_n^2)(c_1^2 + c_2^2 + \\cdots + c_n^2)}} $ before proceeding further in the solution.",
    type: 'complex',
    description: 'Complex fraction with summation',
  },
  {
    id: '7',
    content: "$\\left(a_1 + a_2 + a_3 + a_4 + a_5 + a_6 + a_7 + a_8 + a_9 + a_{10} + a_{11} + a_{12} + a_{13} + a_{14} + a_{15} + a_{16} + a_{17} + a_{18} + a_{19} + a_{20} + a_{21} + a_{22} + a_{23} + a_{24} + a_{25} + \\cdots + a_n \\right)^2$",
    type: 'overflow',
    description: 'Long expression for overflow testing',
  },
  {
    id: '8',
    content: "Using the identities:\n$$\n\\sin^2 x + \\cos^2 x = 1\n$$\nand\n$$\n\\tan x = \\frac{\\sin x}{\\cos x}\n$$\nwe can derive the result.",
    type: 'block',
    description: 'Multiple block equations',
  },
  {
    id: '9',
    content: "Let's solve this step by step.\nFirst, recall the identity $a^2 - b^2 = (a-b)(a+b)$.\nNow apply it to the expression:\n$$\nx^2 - 9\n$$\nFinally, factorize and simplify.",
    type: 'mixed',
    description: 'Mixed inline and block math',
  },
  {
    id: '10',
    content: "This expression is wrong: $ \\frac{a+b }{ c $ and should not crash.",
    type: 'invalid',
    description: 'Invalid LaTeX - unclosed fraction',
  },
  {
    id: '11',
    content: "Try rendering this: $ \\sqrt{2 + $ which is invalid.",
    type: 'invalid',
    description: 'Invalid LaTeX - unclosed sqrt',
  },
  {
    id: '12',
    content: "Here is something unsupported: $ \\unknowncommand{x} $.",
    type: 'invalid',
    description: 'Unknown command',
  },
  {
    id: '13',
    content: "The total cost is $500 and the discount is $50.",
    type: 'currency',
    description: 'Currency symbols',
  },
  {
    id: '14',
    content: "He earned $1000 in his first job.",
    type: 'currency',
    description: 'Currency example',
  },
];

export const PERFORMANCE_TEST_DATA = Array.from({ length: 50 }, (_, index) => ({
  id: `perf-${index + 1}`,
  content: "We now simplify $ \\frac{(a_1 + a_2 + a_3 + \\cdots + a_n)^2}{\\sqrt{(b_1^2 + b_2^2 + \\cdots + b_n^2)(c_1^2 + c_2^2 + \\cdots + c_n^2)}} $ before proceeding further in the solution.",
  type: 'performance',
  description: `Performance test #${index + 1}`,
  index: index + 1,
}));

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
