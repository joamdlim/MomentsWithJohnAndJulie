require('dotenv').config({ path: '.env.local' });
const { S3Client, PutObjectCommand, HeadBucketCommand, CreateBucketCommand } = require("@aws-sdk/client-s3");

const client = new S3Client({
  region: "us-east-1",
  endpoint: "http://127.0.0.1:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "minioadmin",
  },
});

const bucket = process.env.MINIO_BUCKET_NAME || "johnjuliephotos";

async function test() {
  try {
    console.log(`Testing connection to MinIO for bucket: ${bucket}...`);
    try {
      await client.send(new HeadBucketCommand({ Bucket: bucket }));
      console.log(`Bucket ${bucket} exists and is accessible!`);
    } catch (e) {
      console.log(`Bucket access failed or missing! Error: ${e.name} - ${e.message}`);
      console.log(`Attempting to automatically create bucket ${bucket}...`);
      await client.send(new CreateBucketCommand({ Bucket: bucket }));
      console.log(`Successfully created bucket ${bucket}!`);
    }
    
    console.log("Attempting to put a test dummy object...");
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: "test-system-diagnostic.txt",
      Body: Buffer.from("hello world diagnostic test")
    }));
    console.log("Put object succeeded perfectly! Architecture is fully working.");
  } catch (e) {
    console.error("Test failed entirely:", e);
  }
}
test();
