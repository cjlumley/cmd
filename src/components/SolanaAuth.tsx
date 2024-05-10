"use client"

import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, TransactionInstruction } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { Link } from 'react-router-dom';
import { WelcomeBanner } from '@/app/chat/chat';


const TARGET_WALLET = '73WzDi36zHCA6ayKhzbQkRvVsRt6Ury5PbeUrqgRYeTf';
const REQUIRED_AMOUNT = 0.01 * LAMPORTS_PER_SOL;

interface SolanaAuthInnerProps {
  onConfirm: (isConfirmed: boolean) => void;
}

function SolanaAuthInner({ onConfirm }: SolanaAuthInnerProps) {
    const { publicKey, signTransaction } = useWallet();
    const [confirmed, setConfirmed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('transactionConfirmed') === 'true';
        }
        return false;
    });

    useEffect(() => {
        if (publicKey) {
            verifyPayment(publicKey.toString());
        }
    }, [publicKey]);

    const verifyPayment = async (publicKey: string) => {
        const response = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicKey }),
        });

        const data = await response.json();

        if (response.ok) {
            onConfirm(true);
        } else {
            onConfirm(false);
        }
    };

    const sendPayment = async () => {
        if (!publicKey || !signTransaction) {
            return;
        }

        const connection = new Connection('https://hardworking-rough-sheet.solana-mainnet.quiknode.pro/4f994f529881e535e2da4b38f10ef60f47d9e45f/', {
            confirmTransactionInitialTimeout: 60000, // 60 seconds
        });

        const { blockhash } = await connection.getRecentBlockhash();

        const instruction = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(TARGET_WALLET),
            lamports: REQUIRED_AMOUNT,
        });

        const transaction = new Transaction({ recentBlockhash: blockhash }).add(instruction);
        transaction.feePayer = publicKey;

        const signed = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signed.serialize());

        const confirmation = await connection.confirmTransaction(signature, 'confirmed');
        const isConfirmed = !confirmation.value.err;
        if (isConfirmed) {
            localStorage.setItem('transactionConfirmed', 'true'); // Store the confirmation status in the localStorage
        }
        setConfirmed(isConfirmed);
        onConfirm(isConfirmed); // Call the function passed from the parent component
        verifyPayment(publicKey.toString());

        console.log('Transaction confirmed', confirmation.value);
    };

    return (
        <div>
            {!confirmed && (
                <div className='w-[100dvw] h-[100dvh] flex flex-col justify-end bg-black text-green-400 space-y-4 items-start overflow-hidden p-4'>
                    <p className='font-mono whitespace-pre-wrap'>
                        Rules: <br /><br />

                        {'>'} Pay 0.1 SOL via Phantom wallet (connect button on screen).  <br /><br />
                        {'>'} Wait for confirmation, then access the chat.  
                        Solve riddles, find the private key, claim all SOL.  <br /><br />
                        {'>'} 3 wrong guesses = Pay another 0.1 SOL. <br /><br /> 
                        {'>'} First to unlock the private key sentence wins all the SOL.  <br /> <br />
                        {'>'} Follow on X/Twitter for new rounds and jackpot updates. Entry fee and jackpot increase with each new wallet found.</p>
                    <WalletMultiButton />
                    <button onClick={sendPayment} disabled={!publicKey} className='font-mono text-white bg-green-600 whitespace-pre-wrap'>{'>'} Send Payment to Begin</button>    
                </div>
            )}
            
            {confirmed && <WelcomeBanner />}
        </div>
    );
}

function SolanaAuth() {
    const wallets = [new PhantomWalletAdapter()];

    const onConfirm = (isConfirmed: boolean) => {
        console.log(isConfirmed ? 'Transaction confirmed' : 'Transaction failed');
    };

    return (
        <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
                <SolanaAuthInner onConfirm={onConfirm} />
            </WalletModalProvider>
        </WalletProvider>
    );
}

export default SolanaAuth;