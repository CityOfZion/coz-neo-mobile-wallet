const algorithm = 'aes-256-ctr';
import crypto from 'crypto';

export function encrypt(passphrase, wif){
  const cipher = crypto.createCipher(algorithm, passphrase);
  let crypted = cipher.update(wif,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

export function decrypt(passphrase, encryptedText){
  const decipher = crypto.createDecipher(algorithm, passphrase);
  let dec = decipher.update(encryptedText, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}