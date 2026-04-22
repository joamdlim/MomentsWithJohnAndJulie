import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.MINIO_ACCESS_KEY) throw new Error("MINIO_ACCESS_KEY is missing");
if (!process.env.MINIO_SECRET_KEY) throw new Error("MINIO_SECRET_KEY is missing");

export const minioClient = new S3Client({
  region: "us-east-1", // required by AWS SDK, but effectively ignored by MinIO
  endpoint: process.env.MINIO_ENDPOINT || "http://localhost:9000",
  forcePathStyle: true, // IMPORTANT: absolute requirement for MinIO
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
});
