const Listing = require('../models/listingModel');

/**
 * Available tool declarations for LLM Function Calling
 */
const availableTools = [
  {
    type: 'function',
    function: {
      name: 'searchAvailableDonations',
      description: 'Search for active donation listings matching a specific category, location, or keyword',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['tech', 'medical', 'education', 'food', 'shelter', 'financial', 'clothing', 'household', 'other'],
            description: 'The category of the resource',
          },
          location: {
            type: 'string',
            description: 'City or state location to filter listings by',
          },
          searchQuery: {
            type: 'string',
            description: 'Keywords to search in item title or description',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getUrgentRequests',
      description: 'Fetch high or urgent priority community requests needing immediate assistance',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Optional category filter for urgent requests',
          },
          limit: {
            type: 'number',
            description: 'Max number of items to return (default 5)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculateMatchingScore',
      description: 'Compute compatibility score between a donor item and recipient requirements',
      parameters: {
        type: 'object',
        properties: {
          donorCategory: { type: 'string' },
          donorLocation: { type: 'string' },
          requestCategory: { type: 'string' },
          requestLocation: { type: 'string' },
        },
        required: ['donorCategory', 'requestCategory'],
      },
    },
  },
];

/**
 * Tool Executor - Handles execution of function calls dispatched by the model
 */
const executeToolCall = async (functionName, args) => {
  switch (functionName) {
    case 'searchAvailableDonations': {
      const query = { type: 'donation', status: 'active' };
      if (args.category) query.category = args.category;
      if (args.location) query.location = { $regex: args.location, $options: 'i' };
      if (args.searchQuery) {
        query.$or = [
          { title: { $regex: args.searchQuery, $options: 'i' } },
          { description: { $regex: args.searchQuery, $options: 'i' } },
        ];
      }
      const results = await Listing.find(query).limit(10).select('title category urgency location quantity createdAt');
      return { count: results.length, listings: results };
    }

    case 'getUrgentRequests': {
      const query = { type: 'request', status: 'active', urgency: { $in: ['high', 'urgent'] } };
      if (args.category) query.category = args.category;
      const limit = args.limit || 5;
      const results = await Listing.find(query).sort({ urgency: -1, createdAt: -1 }).limit(limit);
      return { count: results.length, urgentRequests: results };
    }

    case 'calculateMatchingScore': {
      let score = 50;
      if (args.donorCategory === args.requestCategory) score += 35;
      if (args.donorLocation && args.requestLocation && args.donorLocation.toLowerCase() === args.requestLocation.toLowerCase()) {
        score += 15;
      }
      return { matchScore: score, isCompatible: score >= 70 };
    }

    default:
      throw new Error(`Unknown tool function: ${functionName}`);
  }
};

/**
 * Controller endpoint for processing user queries with Function Calling / Tool Use
 */
exports.processAiAssistantChat = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ status: 'fail', message: 'Prompt is required' });
    }

    // Heuristic or OpenAI-powered Tool dispatching simulation
    let toolResult = null;
    let invokedFunctionName = null;
    let argsUsed = {};

    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('urgent') || lowerPrompt.includes('emergency') || lowerPrompt.includes('critical')) {
      invokedFunctionName = 'getUrgentRequests';
      argsUsed = { limit: 5 };
      toolResult = await executeToolCall(invokedFunctionName, argsUsed);
    } else if (lowerPrompt.includes('find') || lowerPrompt.includes('search') || lowerPrompt.includes('donation') || lowerPrompt.includes('available')) {
      invokedFunctionName = 'searchAvailableDonations';
      const categoryMatch = ['tech', 'medical', 'education', 'food', 'shelter', 'financial', 'clothing'].find(c => lowerPrompt.includes(c));
      argsUsed = { category: categoryMatch || undefined, searchQuery: prompt };
      toolResult = await executeToolCall(invokedFunctionName, argsUsed);
    } else {
      invokedFunctionName = 'calculateMatchingScore';
      argsUsed = { donorCategory: 'food', requestCategory: 'food' };
      toolResult = await executeToolCall(invokedFunctionName, argsUsed);
    }

    res.status(200).json({
      status: 'success',
      data: {
        aiResponse: `I checked the platform database using the '${invokedFunctionName}' tool.`,
        functionCalling: {
          toolUsed: invokedFunctionName,
          parameters: argsUsed,
          result: toolResult,
          toolsSchema: availableTools
        }
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getAvailableTools = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { tools: availableTools }
  });
};
