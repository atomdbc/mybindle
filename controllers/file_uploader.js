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
        const params = {
          Bucket: bucketName,
          Key: file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        await s3.send(new PutObjectCommand(params));
        const s3Url = `https://${bucketName}.s3.amazonaws.com/${file.originalname}`;
        console.log(`File uploaded to S3. S3 URL: ${s3Url}`);
        return s3Url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      res.status(200).send(`Files uploaded to S3 successfully!\nS3 URLs:\n${uploadedUrls.join('\n')}`);
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