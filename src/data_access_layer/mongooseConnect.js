import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Abstract Strategy
class DatabaseStrategy {
  connect(connectionString) {}
  disconnect() {}
}

// Concrete Strategy
class MainDatabase extends DatabaseStrategy {
  async connect(connectionString) {
    console.log("connectionString:" + connectionString);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    console.log(connectionString);
    return mongoose.connect(connectionString);
  }
}

// Context
class DatabaseContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  async connect(connectionString) {
    return this.strategy.connect(connectionString);
  }

  async disconnect() {
    return this.strategy.disconnect();
  }
}

class NotificationDB {
  databaseContext = null;
  // Strategy pattern to connect to the database
  async initializeDatabase() {
    try {
      this.databaseContext = new DatabaseContext(new MainDatabase());
      await this.databaseContext.connect(process.env.MONGODB_URI);
      return this.databaseContext; // <-- Return the context
    } catch (err) {
      throw err;
    }
  }
  // Strategy pattern to disconnect from the database
  async disconnectDatabase() {
    try {
      await this.databaseContext.disconnect();
      return this.databaseContext; // <-- Return the context
    } catch (err) {
      throw err;
    }
  }
}

const notificationDB = new NotificationDB();
export { notificationDB };
