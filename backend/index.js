const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.PAYMENT_SECRET);
const port = process.env.PORT || 3000;
const jwt = require("jsonwebtoken");

//middleware
app.use(cors());
app.use(express.json());

// verify token
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: "Invalid authorization" });
  }
  const token = authorization?.split(" ")[1];
  jwt.verify(token, process.env.ASSESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
};

//mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mern-project.okzqd.mongodb.net/?retryWrites=true&w=majority&appName=mern-project`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB");

    // create a database and collections
    const database = client.db("yoga-master");
    const usersCollection = database.collection("users");
    const classesCollection = database.collection("classes");
    const cartCollection = database.collection("cart");
    const paymentCollection = database.collection("payments");
    const enrolledCollection = database.collection("enrolled");
    const appliedCollection = database.collection("applied");

    app.post("/api/set-token", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ASSESS_SECRET, {
        expiresIn: "24h",
      });
      res.send({ token });
    });

    // middleware for admin and instructor
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };

      const user = await usersCollection.findOne(query);
      if (user.role === "admin") {
        next();
      } else {
        return res.status(403).send({ message: "Forbidden access" });
      }
    };

    const verifyInstructor = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      if (user.role === "instructor") {
        next();
      } else {
        return res.status(401).send({ message: "Unauthorize access" });
      }
    };

    // routes for users
    app.post("/new-user", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.get("/user/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    //checking user is exist or not through
    app.get("/check-user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email }; // Ensure this is a string-based query

      try {
        const result = await usersCollection.findOne(query); // This looks for a user by email
        if (result) {
          return res.status(200).send(result);
        } else {
          return res.status(404).send({ message: "User not found" });
        }
      } catch (error) {
        return res
          .status(500)
          .send({ message: "Server error", error: error.message });
      }
    });

    app.delete("/delete-user/:id", verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    app.delete(
      "/delete-instructor-classes/:id",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const instructorId = req.params.id;
        try {
          const result = await classesCollection.deleteMany({
            instructorId: instructorId,
          });
          res.send(result);
        } catch (error) {
          res.status(500).send("Error deleting instructor's classes");
        }
      }
    );

    app.put("/update-user/:id", verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
          role: updateUser.option,
          address: updateUser.address,
          about: updateUser.about,
          photoUrl: updateUser.photoUrl,
          skills: updateUser.skills ? updateUser.skills : null,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
    });

    // app.get("/all-users", verifyJWT, verifyAdmin, async (req, res) => {
    //   const users = await usersCollection.find().toArray();
    //   res.send(users);
    // });

    // classes routes here
    app.post("/new-class", verifyJWT, verifyInstructor, async (req, res) => {
      const newClass = req.body;
      newClass.availableSeats = parseInt(newClass.availableSeats);
      const result = await classesCollection.insertOne(newClass);
      res.send(result);
    });

    app.get("/classes", async (req, res) => {
      const query = { status: "approved" };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    });

    // meethod to change the status
    app.patch(
      "/change-user-status/:id",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const { status, reason } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            status: status,
            reason: reason,
          },
        };
        const result = await appliedCollection.updateOne(filter, updateDoc);

        if (status === "approved") {
          const application = await appliedCollection.findOne(filter);
          await usersCollection.updateOne(
            { email: application.email },
            { $set: { role: "instructor" } }
          );
        }

        res.send(result);
      }
    );

    //get classes by instructor email address
    app.get(
      "/classes/:email",
      verifyJWT,
      verifyInstructor,
      async (req, res) => {
        const email = req.params.email;
        const query = { instructorEmail: email };
        const result = await classesCollection.find(query).toArray();
        res.send(result);
      }
    );

    // manage classes
    app.get("/classes-manage", async (req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
    });

    //update classes status and reason
    app.patch(
      "/change-status/:id",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const status = req.body.status;
        const reason = req.body.reason;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            staus: status,
            reason: reason,
          },
        };
        const result = await classesCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      }
    );

    // get approved classes
    app.get("/approved-classes", async (req, res) => {
      const query = { status: "approved" };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    });

    //get single class details
    app.get("/class/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classesCollection.findOne(query);
      res.send(result);
    });

    //update class details (all data => so we use put method)
    app.put("/class/:id", verifyJWT, verifyInstructor, async (req, res) => {
      const id = req.params.id;
      const updateClass = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateClass.name,
          description: updateClass.description,
          price: updateClass.price,
          availableSeats: parseInt(updateClass.availableSeats),
          videoLink: updateClass.videoLink,
          status: "pending",
        },
      };
      const result = await classesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //delete class
    app.delete("/class/:id", verifyJWT, verifyInstructor, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classesCollection.deleteOne(query);
      res.send(result);
    });

    // cart routes !----
    // app.post("/add-to-cart", verifyJWT, async (req, res) => {
    //   const newCartItem = req.body;
    //   const result = await cartCollection.insertOne(newCartItem);
    //   res.send(result);
    // });

    app.post("/add-to-cart", verifyJWT, async (req, res) => {
      const { classId, userMail } = req.body;

      // Check if already in cart
      const cartItem = await cartCollection.findOne({ classId, userMail });
      if (cartItem) {
        return res.status(400).json({ message: "Already in cart" });
      }

      // Check if already enrolled
      const enrolledItem = await enrolledCollection.findOne({
        classId,
        userEmail: userMail,
      });
      if (enrolledItem) {
        return res.status(400).json({ message: "Already enrolled" });
      }

      // Add to cart
      const result = await cartCollection.insertOne({
        classId,
        userMail,
        date: new Date(),
      });
      res.status(200).json({ message: "Successfully added to cart" });
    });

    // get cart item by id
    app.get("/cart-item/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const email = req.body.email;
      const query = {
        classId: id,
        userMail: email,
      };
      const projection = { classId: 1 };
      const result = await cartCollection.findOne(query, {
        projection: projection,
      });
      res.send(result);
    });

    // cart information by user email
    // app.get("/cart/:email", verifyJWT, async (req, res) => {
    //   const email = req.params.email;
    //   const query = { userMail: email };
    //   const projection = { classId: 1 };
    //   const carts = await cartCollection
    //     .find(query, {
    //       projection: projection,
    //     })
    //     .toArray();
    //   const classIds = carts.map((cart) => new ObjectId(cart.classId));
    //   const query2 = { _id: { $in: classIds } };
    //   const result = await classesCollection.find(query2).toArray();
    //   res.send(result);
    // });

    app.get("/cart/:email", verifyJWT, async (req, res) => {
      console.log("Request params:", req.params); // Log the request params
      const email = req.params.email;
      console.log("Email parameter:", email); // Log the email parameter

      if (!email) {
        return res.status(400).send({ message: "Email parameter is missing" });
      }

      const query = { userMail: email };
      try {
        const carts = await cartCollection.find(query).toArray();
        console.log("Cart items:", carts);

        // Ensure all classIds are ObjectId before querying
        const classIds = carts.map((cart) => new ObjectId(cart.classId));
        console.log("Cart ids:", classIds);

        const result = await classesCollection
          .find({ _id: { $in: classIds } })
          .toArray();
        res.send(result);
        console.log("result:", result);
      } catch (error) {
        console.error("Database Error:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // app.get("/cart/:email", verifyJWT, async (req, res) => {
    //   try {
    //     const email = req.params.email;

    //     // Fetch cart items for the user
    //     const carts = await cartCollection
    //       .find({ userMail: email }, { projection: { classId: 1 } })
    //       .toArray();

    //     if (carts.length === 0) {
    //       // If no cart items found, return an empty array
    //       return res.status(200).send([]);
    //     }

    //     // Extract class IDs from the cart items
    //     const classIds = carts.map((cart) => new ObjectId(cart.classId));

    //     // Find classes with the corresponding class IDs
    //     const result = await classesCollection
    //       .find({ _id: { $in: classIds } })
    //       .toArray();

    //     res.status(200).send(result);
    //   } catch (error) {
    //     console.error("Error fetching cart data:", error);
    //     res.status(500).send({ message: "Failed to fetch cart data", error });
    //   }
    // });

    //delete cart item
    app.delete("/delete-cart-item/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { classId: id };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // Payment routers
    app.post("/create-payment-intent", verifyJWT, async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price) * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    // post payment info to db
    app.post("/payment-info", async (req, res) => {
      const paymentInfo = req.body;
      const classId = paymentInfo.classesId;
      const userEmail = paymentInfo.userEmail;
      const singleClassId = req.query.classId;
      let query;
      if (singleClassId) {
        query = { classId: singleClassId, userMail: userEmail };
      } else {
        query = { classId: { $in: classId } };
      }
      const classesQuery = {
        _id: { $in: classesId.map((id) => new ObjectId(id)) },
      };
      const classes = await classesCollection.find(classesQuery).toArray();
      const newEnrolledData = {
        userEmail: userEmail,
        classId: singleClassId.map((id) => new ObjectId(id)),
        transactionId: paymentInfo.transactionId,
      };

      const updateDoc = {
        $set: {
          totalEnrolled:
            classes.reduce(
              (total, current) => total + current.totalEnrolled,
              0
            ) + 1 || 0,
          availableSeats:
            classes.reduce(
              (total, current) => total + current.availableSeats,
              0
            ) - 1 || 0,
        },
      };
      const updatedResult = await classesCollection.updateMany(
        classesQuery,
        updateDoc,
        { upsert: true }
      );
      const enrolledResult = await enrolledCollection.insertOne(
        newEnrolledData
      );
      const deletedResult = await cartCollection.deleteMany(query);
      const paymentResult = await paymentCollection.insertOne(paymentInfo);

      res.send({ paymentResult, deletedResult, enrolledResult, updatedResult });
    });

    // get payment history
    app.get("/payment-history/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await paymentCollection
        .find(query)
        .sort({ date: -1 })
        .toArray();
      res.send(result);
    });

    //payment history length
    app.get("/payment-history-length/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const total = await paymentCollection.countDocuments(query);
      res.send({ result });
    });

    // eenrollment routes
    app.get("/popular-classes", async (req, res) => {
      const result = await classesCollection
        .find()
        .sort({ totalEnrolled: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    app.get("/popular-instructors", async (req, res) => {
      const pipeline = [
        {
          $group: {
            _id: "$instructorEmail",
            totalEnrolled: { $sum: "$totalEnrolled" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "email",
            as: "instructor",
          },
        },
        {
          $match: {
            "instructor.role": "instructor",
          },
        },
        {
          $project: {
            _id: 0,
            instructor: {
              $arrayElemAt: ["$instructor", 0],
            },
            totalEnrolled: 1,
          },
        },
        {
          $sort: {
            totalEnrolled: -1,
          },
        },
        {
          $limit: 6,
        },
      ];

      const result = await classesCollection.aggregate(pipeline).toArray();
      res.send(result);
    });

    app.get("/admin-status", verifyJWT, verifyAdmin, async (req, res) => {
      const approvedClasses = (
        await classesCollection.find({ status: "approved" })
      ).toArray().length;
      const pendingClasses = (
        await classesCollection.find({ status: "pending" })
      ).toArray().length;
      const instructors = (
        await usersCollection.find({ role: "instructor" })
      ).toArray().length;
      const totalClasses = (await classesCollection.find().toArray()).length;
      const totalEnrolled = (await enrolledCollection.find().toArray()).length;

      const result = {
        approvedClasses,
        pendingClasses,
        instructors,
        totalClasses,
        totalEnrolled,
      };
      res.send(result);
    });

    // get all instuctors
    app.get("/instructors", async (req, res) => {
      const result = await usersCollection
        .find({ role: "instructor" })
        .toArray();
      res.send(result);
    });

    app.get("/enrolled-classes/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const pipeline = [
        { $match: query },
        {
          $lookup: {
            from: "classes",
            localField: "classesId",
            foreignField: "_id",
            as: "classes",
          },
        },
        {
          $unwind: "$classes",
        },
        {
          $lookup: {
            from: "users",
            localField: "classes.instructorEmail",
            foreignField: "email",
            as: "instructor",
          },
        },
        {
          $project: {
            _id: 0,
            instructor: {
              $arrayElemAt: ["$instructor", 0],
            },
            classes: 1,
          },
        },
      ];

      const result = await enrolledCollection.aggregate(pipeline).toArray();
      res.send(result);
    });

    // app.get("/enrolled-classes/:email", verifyJWT, async (req, res) => {
    //   try {
    //     const email = req.params.email;

    //     // Define the query variable here
    //     const query = { userEmail: email };

    //     const pipeline = [
    //       { $match: query },
    //       {
    //         $lookup: {
    //           from: "classes", // changed from 'form' to 'from'
    //           localField: "classesId",
    //           foreignField: "_id",
    //           as: "classes",
    //         },
    //       },
    //       {
    //         $unwind: "$classes",
    //       },
    //       {
    //         $lookup: {
    //           from: "users", // changed from 'form' to 'from'
    //           localField: "classes.instructorEmail",
    //           foreignField: "email",
    //           as: "instructor",
    //         },
    //       },
    //       {
    //         $project: {
    //           _id: 0,
    //           instructor: {
    //             $arrayElemAt: ["$instructor", 0],
    //           },
    //           classes: 1,
    //         },
    //       },
    //     ];

    //     const result = await enrolledCollection.aggregate(pipeline).toArray();
    //     res.send(result);
    //   } catch (error) {
    //     console.error("Failed to connect to MongoDB:", error);
    //     res.status(500).send("Internal Server Error");
    //   }
    // });

    app.post("/as-instructor", async (req, res) => {
      const data = req.body;
      const result = await appliedCollection.insertOne(data);
      res.send(result);
    });

    app.delete(
      "/delete-application/:id",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await appliedCollection.deleteOne(query);
        res.send(result);
      }
    );

    app.get("/applied-instructors/:email", async (req, res) => {
      const email = req.params.email;
      const result = await appliedCollection.findOne({ email });
      res.send(result);
    });

    app.get("/applied-instructors", async (req, res) => {
      const result = await appliedCollection.find().toArray();
      res.send(result);
    });

    // Base route
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    // Start the server after setting up routes
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

run().catch(console.dir);
