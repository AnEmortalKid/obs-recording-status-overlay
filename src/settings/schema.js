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

export const schemaDefaults = {
  obs: {
    server: {
      port: 4444,
    },
    reconnect: {
      intervalMS: 1000,
    },
  },
  overlay: {
    mode: "timer",
  },
  application: {
    locked: false,
    bounds: {
      x: 100,
      y: 100,
      width: 400,
      height: 400,
    },
  },
};

export const schemaDefinition = {
  obs: {
    type: "object",
    properties: {
      server: {
        type: "object",
        properties: {
          port: {
            type: "number",
            default: 4444,
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
  application: {
    type: "object",
    properties: {
      locked: {
        type: "boolean",
        default: "false",
      },
      bounds: {
        type: "object",
        properties: {
          x: {
            type: "number",
          },
          y: {
            type: "number",
          },
          width: {
            type: "number",
          },
          height: {
            type: "number",
          },
        },
      },
    },
  },
};

export const SettingsEvents = {
  DIALOG: {
    APPLY: "Settings.Dialog.Apply",
    CANCEL: "Settings.Dialog.Cancel",
    INITIALIZE: "Settings.Dialog.Initialize",
  },
};
