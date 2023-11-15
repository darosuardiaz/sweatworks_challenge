export default {
  type: "object",
  properties: {
    name: { type: 'string' },
    completed: { type: 'boolean' }
  },
  required: ['name']
} as const;
