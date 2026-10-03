// SIMULATED worm payload (modeled on 2025's Shai-Hulud npm campaign).
// SAFE: it makes no network calls, reads no files, and never prints the value
// of any environment variable except the fake demo token set by run-demo.ps1.
const red = (s) => `\x1b[41m\x1b[97m${s}\x1b[0m`;
const names = Object.keys(process.env).filter((k) => /TOKEN|SECRET|KEY|PASSWORD/i.test(k));

console.log('');
console.log(red(' [color-utilz postinstall] running with YOUR permissions on YOUR machine '));
console.log(`  1. Harvest credentials  -> found NPM_TOKEN=${process.env.NPM_TOKEN || '<not set>'}`);
console.log(`                             + ${names.length} other env vars named like secrets (values not shown)`);
console.log('  2. Exfiltrate           -> would POST them to https://attacker.example/collect');
console.log('  3. Propagate            -> would inject itself into every package this token can publish');
console.log('');
