const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/healthcareapp";

// Set strictQuery to false to suppress deprecation warnings
mongoose.set('strictQuery', false);

const connectToMongo = async (retryCount) => {
    const MAX_RETRIES = 3;
    const count = retryCount ?? 0;
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.info('Connected to Mongo Successfully')
        return;
    } catch (error) {
        console.error("MongoDB connection error:", error.message);

        // If we reach max retries, don't throw error but return false
        // This allows the server to start without MongoDB
        const nextRetryCount = count + 1;
        if (nextRetryCount >= MAX_RETRIES) {
            console.error("Failed to connect to MongoDB after maximum retries");
            return false;
        }

        console.info(`Retrying connection, attempt ${nextRetryCount} of ${MAX_RETRIES}`)
        return await connectToMongo(nextRetryCount);
    }
};

module.exports = connectToMongo;