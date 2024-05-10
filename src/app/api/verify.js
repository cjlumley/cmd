// app/api/verify.js
const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');

const TARGET_WALLET = '3DR6A9ytPTBKpv9dX4iBCLfucSDVC8L56yUaCoa3eiTs';
const REQUIRED_AMOUNT = 0.1 * 10 ** 9; // 0.1 SOL in lamports

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { publicKey } = req.body;

    if (!publicKey) {
        return res.status(400).json({ error: 'Public key required' });
    }

    try {
        const connection = new Connection(clusterApiUrl('mainnet-beta'));

        console.log('publicKey:', publicKey);
        const account = await connection.getAccountInfo(new PublicKey(publicKey));

        if (!account) {
            return res.status(400).json({ error: 'Account not found' });
        }

        console.log('publicKey:', publicKey);
        const signatures = await connection.getConfirmedSignaturesForAddress2(
            new PublicKey(publicKey),
            { limit: 10 }
        );

        let isPaymentMade = false;

        for (const signature of signatures) {
            console.log('signature:', signature);
            const transaction = await connection.getParsedConfirmedTransaction(signature.signature);

            const transferInstruction = transaction.transaction.message.instructions[0];

            if (transferInstruction.parsed.type === 'transfer') {
                const { destination, lamports } = transferInstruction.parsed.info;
                if (destination === TARGET_WALLET && lamports >= REQUIRED_AMOUNT) {
                    isPaymentMade = true;
                    break;
                }
            }
        }

        if (isPaymentMade) {
            res.json({ status: 'success', message: 'Payment verified' });
        } else {
            res.status(400).json({ error: 'Payment not found or insufficient' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}