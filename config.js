const environment = {
  PROD: {
    HOST_API: import.meta.env.VITE_LOCAL_API,
  },
  DEV: {
    HOST_API: import.meta.env.VITE_LOCAL_API,
  },
  LOCAL: {
    HOST_API: import.meta.env.VITE_LOCAL_API,
  },
};

const VITE_NODE_ENV = import.meta.env.VITE_NODE_ENV || "LOCAL";

const { HOST_API } = environment[VITE_NODE_ENV];

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export { HOST_API, GOOGLE_API_KEY };
