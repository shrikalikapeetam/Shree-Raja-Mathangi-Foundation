import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateDonation } from '../src/lib/donations.ts';
const valid = { requestId: '67ab25b3-f421-4548-af01-92bbbc9e441c', cause: 'vedic-education', amount: 110000, name: 'Test Donor', email: 'donor@example.com', phone: '+91 98765 43210', pan: '' };
test('normalizes a valid pledge and preserves money in integer paise', () => {
 const result=validateDonation({...valid,email:' DONOR@example.com ',pan:'abcde1234f'});
 assert.equal(result.amount,110000);assert.equal(result.email,'donor@example.com');assert.equal(result.pan,'ABCDE1234F');
});
test('PAN is optional',()=>assert.equal(validateDonation(valid).pan,''));
test('rejects unsafe money values',()=>{for(const amount of [0,-1,NaN,Infinity,100.5,100000001,'110000'])assert.throws(()=>validateDonation({...valid,amount}));});
test('accepts the minimum and maximum amounts',()=>{for(const amount of [100,100000000])assert.equal(validateDonation({...valid,amount}).amount,amount);});
test('rejects unsupported causes, malformed PAN and invalid donor data',()=>{
 for(const change of [{cause:'unknown'},{name:'x'},{email:'invalid'},{phone:'abc'},{pan:'123'},{requestId:'invalid'},{email:'x'.repeat(260)+'@example.com'}])assert.throws(()=>validateDonation({...valid,...change}));
});
test('rejects non-object request bodies',()=>{for(const input of [null,[],true,'text'])assert.throws(()=>validateDonation(input));});
