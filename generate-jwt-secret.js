#!/usr/bin/env node

/**
 * Generate a strong JWT secret for production use
 * Run: node generate-jwt-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 JWT Secret Generator\n');
console.log('=' .repeat(60));

// Generate a 64-byte (512-bit) random string
const secret = crypto.randomBytes(64).toString('hex');

console.log('\n✅ Your new JWT secret (copy this to Railway):\n');
console.log(secret);
console.log('\n' + '='.repeat(60));

console.log('\n📋 How to use:');
console.log('1. Copy the secret above');
console.log('2. Go to Railway dashboard');
console.log('3. Navigate to your backend service');
console.log('4. Go to Variables tab');
console.log('5. Update JWT_SECRET with the new value');
console.log('6. Click Deploy to restart\n');

// Also generate a strong admin password suggestion
const passwordChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
let password = '';
for (let i = 0; i < 20; i++) {
  password += passwordChars.charAt(Math.floor(Math.random() * passwordChars.length));
}

console.log('💡 Suggested strong admin password:\n');
console.log(password);
console.log('\n' + '='.repeat(60) + '\n');
