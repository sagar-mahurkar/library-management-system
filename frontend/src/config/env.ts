export const appConfig = {
  appName: "Library Management System",
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1",
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT ?? 10000),
};
