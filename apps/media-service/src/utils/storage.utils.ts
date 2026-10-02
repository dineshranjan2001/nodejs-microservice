import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { AppError } from "shared";

function getClientInfo() {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;

  if (!endpoint || !accessKeyId || !secretAccessKey || !region) {
    throw new AppError(500, "Missing Neon Object Storage configuration");
  }

  return new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });
}

export async function uploadBuffer(
  buffer: Buffer,
  contentType = "image/jpeg",
): Promise<{ imageUrl: string; publicId: string }> {
  const bucket = process.env.STORAGE_BUCKET;
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;

  if (!bucket || !endpoint) {
    throw new AppError(
      500,
      "Bucket and endpoint are missing",
    );
  }

  const key = `support-tasks/${randomUUID()}`;

  const client = getClientInfo();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  const baseImageUrl = endpoint.replace(/\/$/, "");

  return {
    publicId: key,
    imageUrl: `${baseImageUrl}/${bucket}/${key}`,
  };
}