
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gamepad2, Users, Loader2, Crown, Swords, ClipboardCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const players = [
    { name: 'You', score: 120, isHost: true },
    { name: 'Ali Raza', score: 90, isHost: false },
    { name: 'Sana Javed', score: 110, isHost: false },
];

const question = {
    text: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Cell Wall"],
    time: 15,
};

export default function PlaygroundPage() {
    const [gameState, setGameState] = useState<'lobby' | 'in-game' | 'results'>('lobby');
    const [roomCode, setRoomCode] = useState('XYZ123'); // Dummy room code
    const { toast } = useToast();

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode);
        toast({
            title: 'Room Code Copied!',
            description: 'Share it with your friends to let them join.',
        });
    };

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
                <h1 className="font-headline text-3xl md:text-4xl">Quiz Playground</h1>
            </div>

            {gameState === 'lobby' && (
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gamepad2 /> Welcome to the Playground!</CardTitle>
                        <CardDescription>Challenge your friends to a real-time quiz battle.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full" onClick={() => setGameState('in-game')}>
                            <Swords className="mr-2 h-4 w-4" /> Create a New Room
                        </Button>
                        <div className="flex items-center gap-2">
                            <Input placeholder="Enter Room Code" />
                            <Button variant="secondary">Join Room</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {gameState === 'in-game' && (
                 <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2">
                         <Card>
                             <CardHeader>
                                 <CardTitle>Question 1/10</CardTitle>
                                 <CardDescription>Time left: {question.time}s</CardDescription>
                             </CardHeader>
                             <CardContent>
                                 <p className="text-xl font-semibold mb-6">{question.text}</p>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {question.options.map((option, index) => (
                                         <Button key={index} variant="outline" size="lg" className="justify-start h-auto py-3">
                                             {option}
                                         </Button>
                                     ))}
                                 </div>
                             </CardContent>
                             <CardFooter>
                                <p className="text-sm text-muted-foreground">The AI will generate questions on the fly!</p>
                             </CardFooter>
                         </Card>
                    </div>
                     <Card>
                         <CardHeader>
                             <CardTitle className="flex items-center justify-between">
                                 Leaderboard
                                 <Button variant="ghost" size="icon" onClick={copyRoomCode}>
                                    <ClipboardCopy className="h-4 w-4" />
                                 </Button>
                             </CardTitle>
                             <CardDescription>Room Code: <span className="font-bold">{roomCode}</span></CardDescription>
                         </CardHeader>
                         <CardContent>
                            <ul className="space-y-4">
                                {players.sort((a,b) => b.score - a.score).map((player, index) => (
                                    <li key={index} className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-lg font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium flex items-center gap-2">
                                                {player.name}
                                                {player.isHost && <Crown className="h-4 w-4 text-yellow-500" />}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{player.score} Points</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                         </CardContent>
                          <CardFooter>
                            <Button className="w-full" variant="destructive" onClick={() => setGameState('results')}>End Game</Button>
                         </CardFooter>
                     </Card>
                 </div>
            )}
             {gameState === 'results' && (
                <Card className="max-w-lg mx-auto text-center">
                    <CardHeader>
                        <CardTitle>Game Over!</CardTitle>
                        <CardDescription>Here are the final results.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center">
                             <Crown className="h-16 w-16 text-yellow-400 mb-2" />
                             <p className="text-2xl font-bold">Ali Raza Wins!</p>
                             <p className="text-muted-foreground">with 150 points</p>
                        </div>
                       
                        <div className="text-left pt-4">
                             <h3 className="font-semibold mb-2">Final Scores:</h3>
                             <ul className="space-y-2">
                                 <li className="flex justify-between p-2 rounded-md bg-secondary"><span>1. Ali Raza</span> <strong>150</strong></li>
                                 <li className="flex justify-between p-2"><span>2. You</span> <strong>120</strong></li>
                                 <li className="flex justify-between p-2"><span>3. Sana Javed</span> <strong>110</strong></li>
                             </ul>
                        </div>

                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button className="w-full" onClick={() => setGameState('in-game')}>Play Again</Button>
                        <Button className="w-full" variant="outline" onClick={() => setGameState('lobby')}>Back to Lobby</Button>
                    </CardFooter>
                </Card>
            )}
        </main>
    );
}
