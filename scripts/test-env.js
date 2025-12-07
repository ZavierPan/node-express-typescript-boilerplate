#!/usr/bin/env node

/**
 * Test script to verify environment variable loading
 * Usage: node scripts/test-env.js
 */

// Set NODE_ENV before loading config
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log('🔧 Testing Environment Variable Loading...\n');

// Load the config
const config = require('../dist/config/index.js').default;

console.log('📋 Current Configuration:');
console.log('========================');
console.log(`Environment: ${config.nodeEnv}`);
console.log(`Port: ${config.port}`);
console.log(`JWT Secret: ${config.jwt.secret.substring(0, 10)}...`);
console.log(`JWT Expires In: ${config.jwt.expiresIn}`);
console.log(`JWT Refresh Expires In: ${config.jwt.refreshExpiresIn}`);
console.log(`CORS Origins: ${config.cors.origin.join(', ')}`);
console.log(`CORS Credentials: ${config.cors.credentials}`);
console.log(`API Prefix: ${config.api.prefix}`);
console.log(`Swagger Enabled: ${config.api.swaggerEnabled}`);

console.log('\n✅ Environment variables loaded successfully!');