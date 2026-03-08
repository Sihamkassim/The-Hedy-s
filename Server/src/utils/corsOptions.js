const normalizeOrigin = (origin) => {
  if (!origin || typeof origin !== 'string') return origin;
  return origin.trim().replace(/\/$/, '');
};

const getAllowedOrigins = () => {
  const configuredOrigins = process.env.CLIENT_URLS || process.env.CLIENT_URL;

  if (!configuredOrigins) {
    return [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://tsinat.netlify.app'
    ];
  }

  return configuredOrigins
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);
};

const createCorsOriginValidator = () => {
  const allowedOrigins = getAllowedOrigins();

  return (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);
    const isAllowed = allowedOrigins.includes(normalizedOrigin);

    if (isAllowed) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  };
};

const corsOptions = {
  origin: createCorsOriginValidator(),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
};

module.exports = {
  corsOptions,
  createCorsOriginValidator,
  getAllowedOrigins
};