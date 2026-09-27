import crypto from 'crypto';

const getMd5Hash = (text) => {
  return crypto.createHash('md5').update(text).digest('hex').toUpperCase();
};

// Generates initiate checkout hash
export const generatePayHereHash = (merchantId, orderId, amount, currency, merchantSecret) => {
  const formattedAmount = Number(amount).toFixed(2);
  const hashedSecret = getMd5Hash(merchantSecret);
  return getMd5Hash(merchantId + orderId + formattedAmount + currency + hashedSecret);
};

// Verifies callback signature from PayHere notify_url
export const verifyPayHereSignature = (merchantId, orderId, payhereAmount, payhereCurrency, statusCode, merchantSecret, md5sig) => {
  const hashedSecret = getMd5Hash(merchantSecret);
  const localSig = getMd5Hash(
    merchantId + orderId + payhereAmount + payhereCurrency + statusCode + hashedSecret
  );
  if (typeof md5sig !== 'string') return false;
  const a = Buffer.from(localSig, 'utf8');
  const b = Buffer.from(md5sig.toUpperCase(), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

