export default {
  type: "object",
  properties: {
    comment: { type: 'string' }
  },
  required: ['comment']
} as const;
