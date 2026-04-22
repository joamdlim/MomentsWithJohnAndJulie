const { S3Client, PutBucketPolicyCommand } = require("@aws-sdk/client-s3");

const client = new S3Client({
  region: "us-east-1",
  endpoint: "http://127.0.0.1:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "minioadmin",
  },
});

const bucketName = "johnjuliephotos";

const policy = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: "*",
      Action: ["s3:GetObject"],
      Resource: [`arn:aws:s3:::${bucketName}/*`]
    }
  ]
};

async function makePublic() {
  try {
    await client.send(new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(policy),
    }));
    console.log("Successfully set bucket to Public!");
  } catch (error) {
    console.error("Failed to set bucket policy:", error);
  }
}

makePublic();
