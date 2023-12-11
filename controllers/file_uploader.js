// s3Uploader.js
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';



const s3Uploader = () => {
  const s3 = new S3({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });


  const uploadFiles = async (req, res) => {
    const files = req.files;
    let folder = req.query.folder || '';
    let subfolder = req.query.sub || '';

  // Combine folder and subfolder
  const combinedFolder = folder ? (subfolder ? `${folder}/${subfolder}` : folder) : subfolder;

  if (!files || files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    return res.status(500).send('AWS_S3_BUCKET_NAME environment variable is not set.');
  }

  console.log('Uploading to bucket:', bucketName);

  try {
    const uploadPromises = files.map(async (file) => {
      const timestamp = new Date().getTime();
      const uniqueIdentifier = `${timestamp}_${file.originalname}`;

      const key = combinedFolder ? `${combinedFolder}/${uniqueIdentifier}` : uniqueIdentifier;

      const params = {
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3.send(new PutObjectCommand(params));
      const s3Url = `https://${bucketName}.s3.amazonaws.com/${key}`;
      console.log(`File uploaded to S3. S3 URL: ${s3Url}`);
      return s3Url;
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    res.status(200).json({ url: uploadedUrls });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading files to S3');
  }
};


  return {
    uploadFiles,
  };
};

export default s3Uploader;
