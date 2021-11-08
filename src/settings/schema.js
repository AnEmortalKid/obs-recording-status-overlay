// sample settings
// const schema = {
//   obs: {
//     server: {
//       port: "4444",
//       password: "foo",
//     },
//     reconnect: {
//       intervalMS: 2000,
//     },
//   },
//   overlay: {
//     mode: "logo", // or timer
//   },
// };

// "type": "object",
//   "properties": {
//     "number": { "type": "number" },
//     "street_name": { "type": "string" },
//     "street_type": { "enum": ["Street", "Avenue", "Boulevard"] }
//   }

export const schemaDefinition = {
  obs: {
    type: "object",
    properties: {
      server: {
        type: "object",
        properties: {
          port: {
            type: "number",
          },
          password: {
            type: "string",
          },
        },
      },
      reconnect: {
        type: "object",
        properties: {
          intervalMS: {
            type: "number",
            minimum: 1000,
            default: 1000,
          },
        },
      },
    },
  },
  overlay: {
    type: "object",
    properties: {
      mode: {
        enum: ["timer", "logo"],
      },
    },
  },
};
