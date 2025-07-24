
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gamepad2, Users, Loader2, Crown, Swords, ClipboardCopy, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createTest, CreateTestOutput } from '@/ai/flows/create-test';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Player {
    name: string;
    score: number;
    isHost: boolean;
}

interface Question {
    question: string;
    options: string[];
    answer: string;
}

export default function PlaygroundPage() {
    const [user] = useAuthState(auth);
    const [gameState, setGameState] = useState<'lobby' | 'creating' | 'in-game' | 'results'>('lobby');
    const [gameTopic, setGameTopic] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [players, setPlayers] = useState<Player[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    
    useEffect(() => {
        if (gameState === 'lobby' && user) {
            setPlayers([{ name: user.displayName || 'You', score: 0, isHost: true }]);
        }
    }, [gameState, user]);
    
    const generateRoomCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    const copyRoomCode = () => {
        if(!roomCode) return;
        navigator.clipboard.writeText(roomCode);
        toast({
            title: 'Room Code Copied!',
            description: 'Share it with your friends to let them join.',
        });
    };

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gameTopic.trim()) {
            toast({ title: "Topic is required", description: "Please enter a topic for the quiz.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        setGameState('creating');

        try {
            const result: CreateTestOutput = await createTest({
                subject: gameTopic,
                topic: gameTopic,
                difficultyLevel: 'medium',
                numberOfQuestions: 5,
                curriculumLevel: 'General Knowledge',
                medium: 'english',
                questionType: 'mcq'
            });

            if (!result.mcqs || result.mcqs.length === 0) {
                 toast({ title: "Failed to create quiz", description: "The AI couldn't generate questions for this topic. Please try another one.", variant: "destructive" });
                 setGameState('lobby');
                 return;
            }
            
            setQuestions(result.mcqs);
            setRoomCode(generateRoomCode());
            setCurrentQuestionIndex(0);
            setGameState('in-game');

        } catch (error) {
             toast({ title: "Error", description: "Could not create the game room. Please try again.", variant: "destructive" });
             setGameState('lobby');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (selectedOption: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedOption === currentQuestion.answer) {
            const updatedPlayers = players.map(p => p.isHost ? {...p, score: p.score + 10} : p);
            setPlayers(updatedPlayers);
            toast({ title: "Correct!", description: "+10 points!" });
        } else {
            toast({ title: "Wrong!", description: `The correct answer was: ${currentQuestion.answer}`, variant: "destructive" });
        }

        // Move to next question or show results
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setGameState('results');
        }
    }

    const resetGame = () => {
        setGameState('lobby');
        setGameTopic('');
        setQuestions([]);
        setRoomCode('');
    }

    const currentQuestion = questions[currentQuestionIndex];

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
                    <CardContent>
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <div>
                                <Label htmlFor="game-topic">Quiz Topic</Label>
                                <Input 
                                    id="game-topic"
                                    placeholder="e.g., Solar System, World History" 
                                    value={gameTopic}
                                    onChange={(e) => setGameTopic(e.target.value)}
                                    required
                                />
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                <Swords className="mr-2 h-4 w-4" /> Create a New Room
                            </Button>
                        </form>
                         <Alert className="mt-4">
                            <AlertTitle>How it works</AlertTitle>
                            <AlertDescription>
                               Enter any topic, and our AI will generate a live quiz for you to play!
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            )}
            
            {gameState === 'creating' && (
                 <Card className="max-w-md mx-auto text-center">
                    <CardHeader>
                        <CardTitle>Creating Your Game</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Our AI is generating questions about "{gameTopic}". Please wait...</p>
                    </CardContent>
                </Card>
            )}

            {gameState === 'in-game' && currentQuestion && (
                 <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2">
                         <Card>
                             <CardHeader>
                                 <CardTitle>Question {currentQuestionIndex + 1}/{questions.length}</CardTitle>
                                 <CardDescription>Topic: {gameTopic}</CardDescription>
                             </CardHeader>
                             <CardContent>
                                 <p className="text-xl font-semibold mb-6">{currentQuestion.question}</p>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {currentQuestion.options.map((option, index) => (
                                         <Button key={index} variant="outline" size="lg" className="justify-start h-auto py-3 text-left" onClick={() => handleAnswer(option)}>
                                             {option}
                                         </Button>
                                     ))}
                                 </div>
                             </CardContent>
                         </Card>
                    </div>
                     <Card>
                         <CardHeader>
                             <CardTitle className="flex items-center justify-between">
                                 Leaderboard
                                 <Button variant="ghost" size="icon" onClick={copyRoomCode} disabled={!roomCode}>
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
                        <CardTitle className="flex items-center justify-center gap-2"><PartyPopper/>Game Over!</CardTitle>
                        <CardDescription>Here are the final results.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center">
                             <Crown className="h-16 w-16 text-yellow-400 mb-2" />
                             <p className="text-2xl font-bold">{players.sort((a,b) => b.score - a.score)[0].name} Wins!</p>
                             <p className="text-muted-foreground">with {players.sort((a,b) => b.score - a.score)[0].score} points</p>
                        </div>
                       
                        <div className="text-left pt-4">
                             <h3 className="font-semibold mb-2">Final Scores:</h3>
                             <ul className="space-y-2">
                                {players.sort((a,b) => b.score - a.score).map((player, index) => (
                                     <li key={player.name} className={`flex justify-between p-2 rounded-md ${index === 0 ? 'bg-secondary' : ''}`}>
                                        <span>{index + 1}. {player.name}</span> 
                                        <strong>{player.score}</strong>
                                    </li>
                                ))}
                             </ul>
                        </div>

                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button className="w-full" onClick={resetGame}>Back to Lobby</Button>
                    </CardFooter>
                </Card>
            )}
        </main>
    );
}
