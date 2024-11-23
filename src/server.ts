import app from './app';
const port = process.env.PORT || 5000;
import { Server } from "http";

let server: Server;

const startServer = async () => {
  try {
    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

process.on("unhandledRejection", () => {
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
});

process.on("uncaughtException", () => {
  process.exit(1)
});