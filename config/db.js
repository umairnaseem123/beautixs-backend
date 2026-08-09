const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use Google's public DNS servers for lookups.
// This fixes "querySrv ECONNREFUSED" errors on networks/routers whose
// default DNS server can't resolve MongoDB Atlas's SRV records,
// without needing to change Windows network settings (no admin rights needed).
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;