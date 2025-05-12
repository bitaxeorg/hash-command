import * as bitcoinjs from 'bitcoinjs-lib';
import Big from 'big.js';

export function calculateMerkleRootHash(newRoot: Buffer, merkleBranches: string[]): Buffer {

    const bothMerkles = Buffer.alloc(64);

    bothMerkles.set(newRoot);

    for (let i = 0; i < merkleBranches.length; i++) {
        bothMerkles.set(Buffer.from(merkleBranches[i], 'hex'), 32);
        newRoot = bitcoinjs.crypto.hash256(bothMerkles);
        bothMerkles.set(newRoot);
    }

    return bothMerkles.subarray(0, 32)
}

export function swapEndianWords(buffer: Buffer): Buffer {
    const swappedBuffer = Buffer.alloc(buffer.length);

    for (let i = 0; i < buffer.length; i += 4) {
        swappedBuffer[i] = buffer[i + 3];
        swappedBuffer[i + 1] = buffer[i + 2];
        swappedBuffer[i + 2] = buffer[i + 1];
        swappedBuffer[i + 3] = buffer[i];
    }

    return swappedBuffer;
}




export function calculateDifficulty(header: Buffer): { submissionDifficulty: number, submissionHash: string } {

    const hashResult = bitcoinjs.crypto.hash256(header);

    let s64 = le256todouble(hashResult);

    const truediffone = Big('26959535291011309493156476344723991336010898738574164086137773096960');
    const difficulty = truediffone.div(s64.toString());
    return { submissionDifficulty: difficulty.toNumber(), submissionHash: hashResult.toString('hex') };
}

export function le256todouble(target: Buffer): bigint {

    const number = target.reduceRight((acc, byte) => {
        // Shift the number 8 bits to the left and OR with the current byte
        return (acc << BigInt(8)) | BigInt(byte);
    }, BigInt(0));

    return number;
}

export function calculateNetworkDifficulty(nBits: number) {
    const mantissa: number = nBits & 0x007fffff;       // Extract the mantissa from nBits
    const exponent: number = (nBits >> 24) & 0xff;       // Extract the exponent from nBits

    const target: number = mantissa * Math.pow(256, (exponent - 3));   // Calculate the target value

    const maxTarget = Math.pow(2, 208) * 65535; // Easiest target (max_target)
    const difficulty: number = maxTarget / target;    // Calculate the difficulty

    return difficulty;
}