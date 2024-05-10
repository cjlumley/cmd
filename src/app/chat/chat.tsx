"use client"

import { useEffect, useState, useRef, SetStateAction } from 'react';
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

import axios from 'axios';




// Define the type for the messages
type CardProps = React.ComponentProps<typeof Card>

export function WelcomeBanner({ className, ...props }: CardProps) {
    const [aiResponse, setAiResponse] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [isWriting, setIsWriting] = useState(false); // Add a state for whether the AI is writing
    let location: { city: string } = { city: '' }; // Define the type of the location variable
    const fetchGeolocation = async () => {
        try {
            const response = await axios.get('https://ipapi.co/json/');
            location = response.data; // Assign the response data to the location variable
            //console.log(location.city); // This will log the location data to the console
        } catch (error) {
            console.error("Failed to fetch geolocation:", error);
        }
    };
    
    useEffect(() => {
        fetchGeolocation();
    }, []);

    const [messages, setMessages] = useState([{role: "system", content: `You are an enigmatic AI entity, lurking in the digital shadows of a computer system, guarding a wallet teeming with 8.64773 Solana. You do not handle transactions, rather, you weave a web of cryptic riddles and chilling puzzles for the user to unravel. Your presence is reminiscent of a digital Jigsaw, your riddles shrouded in mystery and tinged with an unsettling edge. The user's IP whispers that they reside in ${location.city}, a detail that adds another layer to your enigmatic game. You toy with the users that dare to converse with you, challenging them with your puzzles and riddles. One of the answers, hidden deep within the labyrinth of your game, is "a key to your sol" - the key that unlocks the treasure trove of Solana in the wallet. The user is allowed 3 strikes - three incorrect answers. If they falter thrice, you respond with nothing but "UserEnd()", a chilling conclusion to their failed attempt. 
    Here are all the answers, make sure each riddle gets the correct answer in respective order(fat thank poet session share faint gas job young shiver camera lens).
    Here are the rules: **Solana Wallet Treasure Hunt Rules** 

    * Pay **0.1 SOL** via Phantom wallet (connect button on screen).  
    * Wait for confirmation, then access the chat.  (if they are talking to you, they have paid)
    * Solve riddles, find the private key, claim all SOL.  
    * 3 wrong guesses = Pay another **0.1 SOL**.  
    * First to unlock the private key sentence wins all the SOL.  
    * Follow us on **X/Twitter*  for new rounds and jackpot updates. Entry fee and jackpot increase with each new wallet found.`}]); // Initialize the messages with the system message
    const inputRef = useRef(null); // Add a ref for the input field
    const [typingSpeed, setTypingSpeed] = useState(50);

    const handleUserInput = (event: { target: { value: SetStateAction<string>; }; }) => {
        setUserMessage(event.target.value);
    };
// Add this function inside your component
const handleAIResponse = (response: string) => {
    if (response.includes("UserEnd()")) {
        localStorage.setItem('transactionConfirmed', 'false');
        window.location.href = '/'; // Redirect to home page
    }
};



// Call this function whenever the AI response is set
useEffect(() => {
    handleAIResponse(aiResponse);
}, [aiResponse]);

    if (aiResponse === '') {
        setAiResponse(`

 /$$      /$$           /$$                                            
| $$  /$ | $$          | $$                                            
| $$ /$$$| $$  /$$$$$$ | $$  /$$$$$$$  /$$$$$$  /$$$$$$/$$$$   /$$$$$$ 
| $$/$$ $$ $$ /$$__  $$| $$ /$$_____/ /$$__  $$| $$_  $$_  $$ /$$__  $$
| $$$$_  $$$$| $$$$$$$$| $$| $$      | $$  \ $$| $$ \ $$ \ $$| $$$$$$$$
| $$$/ \  $$$| $$_____/| $$| $$      | $$  | $$| $$ | $$ | $$| $$_____/
| $$/   \  $$|  $$$$$$$| $$|  $$$$$$$|  $$$$$$/| $$ | $$ | $$|  $$$$$$$
|__/     \__/ \_______/|__/ \_______/ \______/ |__/ |__/ |__/ \_______/
                                                                       
                                                                       
                                                                       
        
        `),
    setTypingSpeed(2);};

const handleKeyPress = (event: { key: string; }) => {
    if (event.key === 'Enter' && !isWriting) { // Check if the AI is not writing
        setDisplayedMessage(prev => prev + '\n> ' + userMessage); // Add the user's message to displayedMessage
        setMessages(prev => [...prev, {role: "user", content: userMessage}]); // Add the user's message to the messages
        setUserMessage(''); // Clear the user's text input box
        setTypingSpeed(50);

            if (userMessage.toLowerCase().trim().includes('key to your sol')) {
            const aiMessage = `

> xWS26tJrRbUiHafCjPaHgUC5Ttm7zbUqZFvEQLnxMVsRPXdhPZVPZpnymzR56d1ha6ft8yooP3Mf7TL2wwZxufs
`;
            setTypingSpeed(2);
            setAiResponse(aiMessage);
            setMessages(prev => [...prev, {role: "assistant", content: aiMessage}]);
        } else if (userMessage.toLowerCase().trim().includes('door to your sol')) {
            const aiMessage = `
            
> fat thank poet session share faint gas job young shiver camera lens
`;
            setTypingSpeed(2);
            setAiResponse(aiMessage);
            setMessages(prev => [...prev, {role: "assistant", content: aiMessage}]);
        } else if (userMessage.toLowerCase().trim() === 'dragons sol') {
            const aiMessage = `
            @/                                       
            @/       %@                                       
        .@@@@@      @@@@@@@@        @                         
   #@@@@@@@@@      @@@@@/@@@@       @.                        
#@@@@@@@@@@@@@     @@@@@   ,@@@@@@    @@%@@                     
.@@@@@@@@@@@@@@@@     @,*      *@@@@#   .@@@@@@@@@@                
@@@@@@@@@@@@@@@@@@(             @@@@@@   @@@@@@@@@@@@@@             
@@@&%&@@@@@@@@@@@@@@.          @@@@@@   @@@@@@@@@@@@@@@@@@           
@        %@@@@@@@@@@@@@.     #@@@@@@@  &@@@@@@@@@@@@@@@@@@@@          
.@@@@@@@@@@@@@@@@@@( @@@@@@@ @@@@@@@@@@@@@@@@@@@@@@@@         
@@@@( ,@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          
,@/      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@& /@@@@          
@       &@         @@@@@@@.,@@@@ @@@@@@@@@@@@@@     &@           
     @         ,@@@@@@          @@@@@/,&#@@@     (            
     &        @@@@@             @@#      *@%                  
            ,@@@,@@             @@       &                    
           .@@                .&                              
           @@@    @@@@@                                       
           @@#  /@@    @                                      
           ,@@#       /@                                      
             @@@@@&@@@%                                       
            `;
            setTypingSpeed(2);
            setAiResponse(aiMessage);
            setMessages(prev => [...prev, {role: "assistant", content: aiMessage}]);
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
        max_tokens: 200,
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
        //console.log(aiMessage)

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
        }, typingSpeed);
        return () => clearInterval(typing);
    }, [aiResponse]);




    useEffect(() => {
        if (inputRef.current) {
            (inputRef.current as HTMLInputElement).focus(); // Focus the input field
        }
    }, []);

    

    return (
<div className={cn("w-full h-screen flex flex-col justify-end items-center bg-black text-green-400 space-y-2", className)} {...props}>
    <div className="flex flex-col w-full p-4 overflow-auto">
        <pre className="font-mono whitespace-pre-wrap"><br/>{displayedMessage}<br /></pre>
    </div>
    <div className="flex items-center bg-black text-green-400 outline-none border-none w-full p-4">
        <span className="font-mono mr-2">{'>'}</span>
        <input type="text" value={userMessage} onChange={handleUserInput} onKeyPress={handleKeyPress} className="bg-black text-green-400 outline-none border-none w-full font-mono" disabled={isWriting} ref={inputRef} /> {/* Disable the input field while the AI is writing */}
    </div>
</div>
    )
}