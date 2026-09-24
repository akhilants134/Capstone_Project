const { z } = require('zod');

/**
 * ============================================================================
 * INPUT SANITIZATION & INJECTION AWARENESS
 * ============================================================================
 * 
 * 1. Cross-Site Scripting (XSS) Defense:
 *    - Encodes raw HTML entities (&, <, >, ", ', \, ;) into safe equivalents.
 *    - Prevents script tag and HTML attribute injection when data is rendered.
 * 
 * 2. SQL Injection Defense:
 *    - Neutralizes quote escaping and semicolon command chaining characters.
 *    - Enforces typed inputs through parameterized queries & ORM mappings.
 * 
 * 3. NoSQL Operator Injection Defense:
 *    - Recursively checks and strips MongoDB command operators (keys starting with '$' or containing '.').
 *    - Prevents auth bypass via payloads like { "$gt": "" }.
 */
const sanitizeInput = (val) => {
  if (typeof val === 'string') {
    return val
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\\/g, '&#x5C;')
      .replace(/;/g, '&#x3B;')
      .trim();
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeInput);
  }
  if (val !== null && typeof val === 'object') {
    const sanitizedObj = {};
    for (const [key, value] of Object.entries(val)) {
      if (!key.startsWith('$') && !key.includes('.')) {
        sanitizedObj[key] = sanitizeInput(value);
      }
    }
    return sanitizedObj;
  }
  return val;
};

// Express Request Sanitization Middleware
const sanitizeBody = (req, res, next) => {
  if (req.body) req.body = sanitizeInput(req.body);
  if (req.query) req.query = sanitizeInput(req.query);
  if (req.params) req.params = sanitizeInput(req.params);
  next();
};

// Zod Request Body Validation Factory
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const rawData = req[source];
      const sanitized = sanitizeInput(rawData);
      const parsed = schema.parse(sanitized);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'fail',
          message: 'Validation Error',
          errors: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      next(error);
    }
  };
};

// Validation Schemas
const createListingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').max(100),
  description: z.string().min(5, 'Description must be at least 5 characters long'),
  category: z.enum(['tech', 'medical', 'education', 'food', 'shelter', 'financial', 'clothing', 'household', 'other']),
  type: z.enum(['request', 'donation']),
  urgency: z.enum(['low', 'high', 'urgent']).optional().default('low'),
  quantity: z.number().int().positive().optional().default(1),
  estimatedValue: z.string().max(50).optional(),
  location: z.string().max(100).optional(),
  tags: z.array(z.string().max(30)).optional()
});

const userRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['community', 'donor', 'recipient', 'admin']).optional().default('community'),
  bio: z.string().max(300).optional(),
  location: z.string().max(100).optional()
});

const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  twoFactorToken: z.string().optional()
});

const paymentCheckoutSchema = z.object({
  campaignId: z.number().int().positive().optional(),
  amountCents: z.number().int().min(100, 'Minimum donation amount is $1.00 (100 cents)'),
  currency: z.string().length(3).optional().default('usd'),
  donorEmail: z.string().email()
});

module.exports = {
  sanitizeInput,
  sanitizeBody,
  validate,
  createListingSchema,
  userRegisterSchema,
  userLoginSchema,
  paymentCheckoutSchema
};
