
const express = require("express");
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

const app = express();
const port = process.env.PORT || 8000;


app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Hello World!");
});



const uri = "mongodb+srv://nesthire:nesthire@cluster0.8xvidah.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


   const database = client.db("nextloop_db");
    const jobCollection = database.collection("jobs");
    const companyCollection = database.collection("companies")
    const applicationsCollection = database.collection('applications')

app.get("/api/jobs", async(req, res)=> {
    const query = {}
   
     if(req.query.companyId){
        query.companyId = req.query.companyId;
    }
    if(req.query.status){
        query.status = req.query.status;
    }

    const cursor = jobCollection.find(query);
    const result = await cursor.toArray();
    res.send(result)
})


app.get("/api/jobs/:id", async(req,res) => {
    const id = req.params.id;
    const query = {
      _id: new ObjectId(id)
    }
    const result = await jobCollection.findOne(query)
    res.send(result)
})

app.post("/api/jobs", async(req, res)=>{
    const job = req.body;
    const newJob = {
      ...job,
      createdAt: new Date()
    }
    const result = await jobCollection.insertOne(newJob)
    res.send(result)
})


// Applicant Related Filtering
app.get("/api/applications", async(req,res)=>{
  const query = {}
  if(req.query.applicantId){
    query.applicantId = req.query.applicantId;
  }

  // আনেক সময় recruiter এর দরকার পরবে যে এই জব এর আন্ডার এ কইটা apply হয়েছে তার লজিক। 
  if(req.query.jobId) {
    query.jobId = req.query.jobId;
  }

  const cursor = applicationsCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
})

//application releted api
app.post("/api/applications", async(req, res)=> {
  const application = req.body;
  const newApplication = {
    ...application,
    createdAt: new Date()
  }

  const result = await applicationsCollection.insertOne(newApplication);
  res.send(result);
})







//Browser বা frontend যখন এ request পাঠাবে, তখন এই function run হবে।
// Recruiter ID অনুযায়ী company data fetch করার API
app.get("/api/my/companies", async(req, res)=>{
  const query = {};
  if(req.query.recruiterId){
    query.recruiterId = req.query.recruiterId;
  }

  const result = await companyCollection.findOne(query);
  res.send(result)
})

// company releted apis
app.post("/api/companies", async(req, res)=> {
  const company = req.body;
  const newCompany = {
    ...company,
    createdAt: new Date()
  }
  const result = await companyCollection.insertOne(newCompany)
  res.send(result);
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});