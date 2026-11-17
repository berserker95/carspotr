# carspotr

Car spotting: fotografi un'auto, l'app riconosce marca, modello e generazione e la aggiunge alla tua collezione.

## Fase 1 (attuale): tutto in locale

- Upload della foto e riconoscimento **simulato** (`src/lib/recognizer.ts`): stessa foto, stessa risposta.
- Privacy by design: la targa viene oscurata (zona simulata) e la foto viene ricodificata dal browser, quindi i dati EXIF e il GPS spariscono (`src/lib/redact.ts`).
- Collezione salvata nel browser (`localStorage`).

```bash
npm install
npm run dev
```

## Prossime fasi

1. Account AWS free plan, budget a 1 USD, utente IAM.
2. Riconoscimento reale con Amazon Bedrock e oscuramento reale di targhe e volti.
3. CDK: upload su S3 con URL firmato, Lambda, DynamoDB.
4. Next.js su AWS (OpenNext, CloudFront), Cognito, GitHub Actions con OIDC.
5. Dashboard dei costi, ADR, numeri nel README.
