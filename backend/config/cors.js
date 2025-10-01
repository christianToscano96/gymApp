const corsOptions = {
  origin: [
    "http://localhost:5173", // Cambia esto si tu frontend corre en otro puerto
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;
