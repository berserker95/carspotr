# carspotr

Car spotting: snap a photo of a car, the app identifies its make, model and generation and adds it to your collection.

## Phase 1 (current): everything runs locally

- Photo upload and **mock** recognition (`src/lib/recognizer.ts`): the same photo always returns the same car.
- Privacy by design: the licence plate is blurred (simulated region) and the browser re-encodes the photo, so EXIF data and GPS are removed (`src/lib/redact.ts`).
- The collection is stored in the browser (`localStorage`).

```bash
npm install
npm run dev
```

## Next phases

1. AWS free plan account, 1 USD budget, IAM user.
2. Real recognition with Amazon Bedrock and real blurring of plates and faces.
3. CDK: upload to S3 via presigned URL, Lambda, DynamoDB.
4. Next.js on AWS (OpenNext, CloudFront), Cognito, GitHub Actions with OIDC.
5. Cost dashboard, ADRs, real numbers in this README.
