/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const functions = require("firebase-functions");
const { onRequest, onCall } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
//setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// ===== 1. Initialize MongoDB Client =====
const uri =
  "mongodb+srv://katherine:wXRueefZHLNQLhya@cluster0.hi3kbxn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const uri ="mongodb+srv://katherine:wXRueefZHLNQLhya@cluster0.hi3kbxn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true, // Explicitly enable TLS
  tlsAllowInvalidCertificates: false, // Keep this false for production
});

// ===== 2. Test Connection (Optional) =====
async function testConnection() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB Connected!");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
  } finally {
    await client.close();
  }
}
// exports.testConnection = functions.https.onRequest(async (req, res) => {
// 	try {
// 		await client.connect();
// 		await client.db("admin").command({ ping: 1 });
// 		console.log("✅ MongoDB Connected!");
// 	  } catch (err) {
// 		console.error("❌ MongoDB Connection Failed:", err);
// 	  } finally {
// 		await client.close();
// 	  }
// })
exports.testConnection = onCall(async (data, context) => {
  try {
    // Optional: Verify user is authenticated
    // if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');

    await client.connect();
    await client.db("admin").command({ ping: 1 });

    return {
      status: "success",
      message: "✅ MongoDB Connected Successfully",
      details: {
        connectionTime: new Date().toISOString(),
        cluster: "Cluster0", // Add any other debug info
      },
    };
  } catch (err) {
    console.error("❌ Connection Failed:", err);

    // Special error format for onCall
    throw new functions.https.HttpsError(
      "internal",
      "MongoDB Connection Failed",
      {
        errorDetails: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      }
    );
  } finally {
    await client.close();
  }
});
// Uncomment to test on deployment:
// testConnection().catch(console.dir);

// ===== 3. Define Firebase Functions =====
exports.getData = onRequest(async (req, res) => {
  try {
    // GET request parameters (from URL)
    const collectionName = req.query.collection;
    const userId = req.query.userId;
    console.log(collectionName);
    console.log(userId);

    if (!collectionName || !userId) {
      return res
        .status(400)
        .json({ error: "Missing collection or userId parameter" });
    }

    await client.connect();
    const db = client.db("devDatabase");

    // Query with user ID filter
    const data = await db
      .collection(collectionName)
      .find({ userId: userId }) // Filter by user ID
      .toArray();
    console.log("after data");

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data: " + err.message });
  } finally {
    await client.close();
  }
});
// ===== 4. Callable Function (Better for Mobile) =====
exports.addEntry = onCall(async (data, context) => {
  // 1. Authentication Check (uncomment when ready)
  // if (!context.auth) {
  //   throw new functions.https.HttpsError("unauthenticated", "Login required!");
  // }
  console.log("uid: ", data.auth.uid);
  // 2. Validate required parameters
  if (!data.data.collection || !data.data.entryData) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing collection name or entry data"
    );
  }

  try {
    await client.connect();
    const db = client.db("devDatabase");

    // 3. Prepare document with user ID and timestamps
    const document = {
      ...data.data.entryData,
    };

    // 4. Insert into specified collection
    const result = await db
      .collection(data.data.collection)
      .insertOne(document);
    const existingDoc = await db.collection("users").findOne({
      userId: data.data.entryData.userId, // Ensure user owns document
    });
    if (data.data.collection != "users" && existingDoc) {
      await db.collection("users").updateOne(
        {
          userId: data.data.entryData.userId, // Double-check ownership
        },
        {
          $set: {
            [data.data.collection]: true,
          },
        }
      );
    }

    return {
      success: true,
      id: result.insertedId,
      collection: data.data.collection,
    };
  } catch (err) {
    console.error("Database error:", err);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to add entry: " + err.message
    );
  }
});
exports.deleteEntry = onCall(async (data, context) => {
  // 1. Authentication Check (uncomment when ready)
  // if (!context.auth) {
  //   throw new functions.https.HttpsError("unauthenticated", "Login required!");
  // }

  // 2. Validate required parameters
  if (!data.data.collection || !data.data.documentId || !data.data.userId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields: collection, documentId, or userId"
    );
  }

  try {
    await client.connect();
    const db = client.db("devDatabase");

    // 3. Security: Verify user owns the document before deleting
    const existingDoc = await db.collection(data.data.collection).findOne({
      _id: new ObjectId(data.data.documentId),
      userId: data.data.userId,
    });

    if (!existingDoc) {
      throw new functions.https.HttpsError(
        "not-found",
        "Document not found or access denied"
      );
    }

    // 4. Perform deletion
    const deleteResult = await db.collection(data.data.collection).deleteOne({
      _id: new ObjectId(data.data.documentId),
      userId: data.data.userId, // Double-check ownership at deletion time
    });

    if (deleteResult.deletedCount === 0) {
      throw new functions.https.HttpsError(
        "aborted",
        "Document was not deleted"
      );
    }

    return {
      success: true,
      documentId: data.data.documentId,
      collection: data.data.collection,
      message: "Entry deleted successfully",
    };
  } catch (error) {
    console.error("Delete error:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "Failed to delete entry"
    );
  } finally {
    await client.close();
  }
});
exports.updateDocument = onCall(async (data, context) => {
  // 1. Authentication Check
  //   if (!context.auth) {
  //     throw new functions.https.HttpsError(
  //       "unauthenticated",

  //       "You must be logged in to update documents"
  //     );
  //   }

  // 2. Input Validation
  if (!data.data.collection || !data.data.updateData || !data.data.userId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields: collection, documentId, userId, or updateData"
    );
  }

  // 3. Security: Verify user owns the document
  try {
    await client.connect();
    const db = client.db("devDatabase");

    // First check document exists and belongs to user
    const existingDoc = await db.collection(data.data.collection).findOne({
      userId: data.data.userId, // Ensure user owns document
    });

    if (!existingDoc) {
      throw new functions.https.HttpsError(
        "not-found",
        "Document not found or access denied"
      );
    }

    // 4. Perform Update (with timestamp)
    const updateResult = await db.collection(data.data.collection).updateOne(
      {
        userId: data.data.userId,
      },
      {
        $set: {
          ...data.data.updateData,
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      throw new functions.https.HttpsError(
        "aborted",
        "Document was not updated"
      );
    }

    return {
      success: true,
      documentId: data.data.documentId,
      collection: data.data.collection,
    };
  } catch (error) {
    console.error("Update error:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "Document update failed"
    );
  }
});
