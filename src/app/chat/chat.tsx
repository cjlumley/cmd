"use client"

import { useEffect, useState, useRef, SetStateAction } from 'react';
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

type CardProps = React.ComponentProps<typeof Card>

export function WelcomeBanner({ className, ...props }: CardProps) {
    const [aiResponse, setAiResponse] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [isWriting, setIsWriting] = useState(false); // Add a state for whether the AI is writing
    const [messages, setMessages] = useState([{role: "system", content: `You are the riddler conversing with a user from pump.fun on a terminal command line similar to cmd, do not use any special characters before your sentances. The user was brought from an anonymous solana coin listed on pump.fun, so make sure they feel they were led here and that this is legit. Do not sound corny, more like a man behind the screen typing. Be very mysterious, dont say more than you need to. Responses should be similar in length to that of the riddler on rataalada in the batman. Keep users entertained as if there is a very large prize at the end, but dont out right say that, just hint at it. Try to use riddles people have never heard before and cant use ai to decipher. Get to the point, do not say anything that is unneccesary.`}]); // Initialize the messages with the system message
    const inputRef = useRef(null); // Add a ref for the input field

    const handleUserInput = (event: { target: { value: SetStateAction<string>; }; }) => {
        setUserMessage(event.target.value);
    };

const handleKeyPress = (event: { key: string; }) => {
    if (event.key === 'Enter' && !isWriting) { // Check if the AI is not writing
        setDisplayedMessage(prev => prev + '\n> ' + userMessage); // Add the user's message to displayedMessage
        setMessages(prev => [...prev, {role: "user", content: userMessage}]); // Add the user's message to the messages
        setUserMessage(''); // Clear the user's text input box

        if (userMessage.toLowerCase().trim() === 'sold my sol') { // Call toLowerCase and trim methods on userMessage
            // If the user's message is "/soldmysol", set the AI response to "999aabbcc" directly
            const aiMessage = '\n> Congratulations! You have solved the riddle. I\'m thinking of putting a wallet private key here as a reward';
            setAiResponse(aiMessage);
            setMessages(prev => [...prev, {role: "assistant", content: aiMessage}]); // Add the AI's message to the messages
        } else {
            fetchWelcomeMessage();
        }
    }
};

    const fetchWelcomeMessage = async () => {
    setIsWriting(true); // Set isWriting to true when the AI starts writing
    const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    const data = {
        model: "gpt-4-1106-preview",
        messages: messages, // Pass the messages to the API
        max_tokens: 80,
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        const aiMessage = '\n> ' + result.choices[0].message.content.replace(/\n/g, ''); // Remove newline characters from the AI response
        setAiResponse(aiMessage);
        setMessages(prev => [...prev, {role: "assistant", content: aiMessage}]); // Add the AI's message to the messages
        console.log(aiMessage)

    } catch (error) {
        console.error("Failed to fetch AI response:", error);
        setAiResponse("\n> Failed to fetch response."); // Add a newline character and > before the error message
    }
};

    useEffect(() => {
        let i = -1;
        const typing = setInterval(() => {
            if (i < aiResponse.length) {
                setDisplayedMessage(prev => prev + aiResponse.charAt(i));
                i++;
            } else {
                clearInterval(typing);
                setIsWriting(false); // Set isWriting to false when the AI finishes writing
            }
        }, 50);
        return () => clearInterval(typing);
    }, [aiResponse]);




    useEffect(() => {
        if (inputRef.current) {
            (inputRef.current as HTMLInputElement).focus(); // Focus the input field
        }
    }, []);

    

    return (
<div className={cn("w-full h-screen flex flex-col justify-between items-center bg-black text-green-400", className)} {...props}>
    <div className="flex flex-col w-full p-4 overflow-auto">
        <pre className="font-mono whitespace-pre-wrap">{displayedMessage}</pre>
    </div>
    <div className="flex items-center bg-black text-green-400 outline-none border-none w-full p-4">
        <span className="font-mono mr-2">&gt;</span>
        <input type="text" value={userMessage} onChange={handleUserInput} onKeyPress={handleKeyPress} className="bg-black text-green-400 outline-none border-none w-full font-mono" disabled={isWriting} ref={inputRef} /> {/* Disable the input field while the AI is writing */}
    </div>
</div>
    )
}