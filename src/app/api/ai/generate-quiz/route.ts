import { NextResponse } from 'next/server';

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-3.5-turbo'; // You can change this to any model supported by OpenRouter

// Subject-specific fallback questions
const FALLBACK_QUESTIONS: Record<string, any[]> = {
  math: [
    {
      question: 'What is the value of π (pi) to two decimal places?',
      options: ['3.14', '3.16', '3.18', '3.20'],
      correctIndex: 0
    },
    {
      question: 'What is the square root of 64?',
      options: ['6', '7', '8', '9'],
      correctIndex: 2
    },
    {
      question: 'Solve for x: 2x + 5 = 15',
      options: ['5', '7', '10', '15'],
      correctIndex: 0
    },
    {
      question: 'What is 15% of 200?',
      options: ['15', '20', '30', '45'],
      correctIndex: 2
    },
    {
      question: 'What is the area of a circle with radius 3? (π ≈ 3.14)',
      options: ['9.42', '18.84', '28.26', '37.68'],
      correctIndex: 2
    },
    {
      question: 'What is 7 squared?',
      options: ['14', '28', '42', '49'],
      correctIndex: 3
    },
    {
      question: 'If a triangle has angles of 45° and 45°, what is the third angle?',
      options: ['45°', '60°', '90°', '180°'],
      correctIndex: 2
    },
    {
      question: 'What is the next number in the sequence: 1, 1, 2, 3, 5, 8, ...?',
      options: ['11', '12', '13', '14'],
      correctIndex: 2
    },
    {
      question: 'What is the value of 5! (5 factorial)?',
      options: ['25', '50', '100', '120'],
      correctIndex: 3
    },
    {
      question: 'If x - 7 = 15, what is x?',
      options: ['8', '15', '22', '105'],
      correctIndex: 2
    },
    {
      question: 'What is the perimeter of a square with side length 5?',
      options: ['10', '15', '20', '25'],
      correctIndex: 2
    },
    {
      question: 'What is 3/4 as a decimal?',
      options: ['0.25', '0.5', '0.75', '1.0'],
      correctIndex: 2
    },
    {
      question: 'What is the sum of the angles in a triangle?',
      options: ['90°', '180°', '270°', '360°'],
      correctIndex: 1
    },
    {
      question: 'What is the cube of 3?',
      options: ['6', '9', '27', '81'],
      correctIndex: 2
    },
    {
      question: 'If a train travels 300 miles in 5 hours, what is its average speed?',
      options: ['40 mph', '50 mph', '60 mph', '70 mph'],
      correctIndex: 2
    },
    {
      question: 'What is the greatest common divisor (GCD) of 12 and 18?',
      options: ['2', '3', '6', '9'],
      correctIndex: 2
    },
    {
      question: 'What is the least common multiple (LCM) of 4 and 6?',
      options: ['6', '8', '12', '24'],
      correctIndex: 2
    },
    {
      question: 'If a = 5 and b = 3, what is a² - b²?',
      options: ['4', '16', '25', '34'],
      correctIndex: 1
    },
    {
      question: 'What is the value of 2³ + 3²?',
      options: ['11', '13', '17', '19'],
      correctIndex: 2
    },
    {
      question: 'If a rectangle has length 8 and width 5, what is its area?',
      options: ['13', '26', '35', '40'],
      correctIndex: 3
    }
  ],
  science: [
    {
      question: 'What is the chemical symbol for gold?',
      options: ['Go', 'Gd', 'Au', 'Ag'],
      correctIndex: 2
    },
    {
      question: 'Which gas do plants absorb from the atmosphere?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
      correctIndex: 2
    },
    {
      question: 'What is the hardest natural substance on Earth?',
      options: ['Gold', 'Iron', 'Diamond', 'Graphite'],
      correctIndex: 2
    },
    {
      question: 'What is the chemical formula for water?',
      options: ['CO2', 'H2O', 'O2', 'N2'],
      correctIndex: 1
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctIndex: 1
    },
    {
      question: 'What is the largest organ in the human body?',
      options: ['Liver', 'Brain', 'Skin', 'Heart'],
      correctIndex: 2
    },
    {
      question: 'What is the atomic number of Carbon?',
      options: ['4', '6', '8', '12'],
      correctIndex: 1
    },
    {
      question: 'Which of these is a noble gas?',
      options: ['Oxygen', 'Nitrogen', 'Helium', 'Chlorine'],
      correctIndex: 2
    },
    {
      question: 'What is the speed of light in a vacuum (approximately)?',
      options: ['300,000 km/s', '500,000 km/s', '700,000 km/s', '1,000,000 km/s'],
      correctIndex: 0
    },
    {
      question: 'What is the main component of the Sun?',
      options: ['Liquid Lava', 'Hydrogen', 'Oxygen', 'Carbon'],
      correctIndex: 1
    },
    {
      question: 'Which blood type is known as the universal donor?',
      options: ['A+', 'B+', 'AB+', 'O-'],
      correctIndex: 3
    },
    {
      question: 'What is the chemical symbol for silver?',
      options: ['Si', 'Ag', 'Au', 'Sr'],
      correctIndex: 1
    },
    {
      question: 'Which part of the plant conducts photosynthesis?',
      options: ['Root', 'Stem', 'Leaf', 'Flower'],
      correctIndex: 2
    },
    {
      question: 'What is the pH value of pure water?',
      options: ['5', '6', '7', '8'],
      correctIndex: 2
    },
    {
      question: 'Which gas is most abundant in the Earth\'s atmosphere?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
      correctIndex: 2
    },
    {
      question: 'What is the unit of electrical resistance?',
      options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
      correctIndex: 2
    },
    {
      question: 'Which metal is liquid at room temperature?',
      options: ['Sodium', 'Mercury', 'Aluminum', 'Copper'],
      correctIndex: 1
    },
    {
      question: 'What is the chemical symbol for potassium?',
      options: ['P', 'K', 'Pt', 'Po'],
      correctIndex: 1
    },
    {
      question: 'Which of these is NOT a type of rock?',
      options: ['Igneous', 'Metamorphic', 'Sedimentary', 'Magnetic'],
      correctIndex: 3
    },
    {
      question: 'What is the chemical formula for table salt?',
      options: ['NaCl', 'H2O', 'CO2', 'C6H12O6'],
      correctIndex: 0
    }
  ],
  history: [
    {
      question: 'In which year did World War II end?',
      options: ['1943', '1945', '1947', '1950'],
      correctIndex: 1
    },
    {
      question: 'Who was the first President of the United States?',
      options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'],
      correctIndex: 2
    },
    {
      question: 'Which ancient civilization built the Great Pyramids?',
      options: ['Greeks', 'Romans', 'Egyptians', 'Persians'],
      correctIndex: 2
    },
    {
      question: 'In which year did the Titanic sink?',
      options: ['1905', '1912', '1915', '1920'],
      correctIndex: 1
    },
    {
      question: 'Who painted the Mona Lisa?',
      options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
      correctIndex: 2
    },
    {
      question: 'When was the Declaration of Independence signed?',
      options: ['1774', '1776', '1781', '1787'],
      correctIndex: 1
    },
    {
      question: 'Which country was the first to send a human to space?',
      options: ['USA', 'China', 'Soviet Union', 'Germany'],
      correctIndex: 2
    },
    {
      question: 'Who was the first woman to win a Nobel Prize?',
      options: ['Marie Curie', 'Mother Teresa', 'Rosalind Franklin', 'Jane Addams'],
      correctIndex: 0
    },
    {
      question: 'In which year did the Berlin Wall fall?',
      options: ['1985', '1989', '1991', '1993'],
      correctIndex: 1
    },
    {
      question: 'Who was the leader of the Soviet Union during World War II?',
      options: ['Vladimir Lenin', 'Joseph Stalin', 'Nikita Khrushchev', 'Leon Trotsky'],
      correctIndex: 1
    },
    {
      question: 'Which ancient wonder was located in Babylon?',
      options: ['Great Pyramid', 'Hanging Gardens', 'Colossus of Rhodes', 'Lighthouse of Alexandria'],
      correctIndex: 1
    },
    {
      question: 'Who discovered penicillin?',
      options: ['Alexander Fleming', 'Louis Pasteur', 'Marie Curie', 'Robert Koch'],
      correctIndex: 0
    },
    {
      question: 'In which year did the French Revolution begin?',
      options: ['1776', '1789', '1799', '1804'],
      correctIndex: 1
    },
    {
      question: 'Who wrote "The Communist Manifesto"?',
      options: ['Vladimir Lenin', 'Karl Marx', 'Friedrich Engels', 'Joseph Stalin'],
      correctIndex: 1
    },
    {
      question: 'Which empire was ruled by Genghis Khan?',
      options: ['Roman Empire', 'Ottoman Empire', 'Mongol Empire', 'British Empire'],
      correctIndex: 2
    },
    {
      question: 'In which year did Christopher Columbus reach the Americas?',
      options: ['1492', '1502', '1510', '1520'],
      correctIndex: 0
    },
    {
      question: 'Who was the first female Prime Minister of the United Kingdom?',
      options: ['Theresa May', 'Margaret Thatcher', 'Indira Gandhi', 'Angela Merkel'],
      correctIndex: 1
    },
    {
      question: 'Which ancient civilization built Machu Picchu?',
      options: ['Aztecs', 'Mayans', 'Incas', 'Maya'],
      correctIndex: 2
    },
    {
      question: 'Who was the first person to step on the moon?',
      options: ['Buzz Aldrin', 'Neil Armstrong', 'Michael Collins', 'Yuri Gagarin'],
      correctIndex: 1
    },
    {
      question: 'In which year did World War I begin?',
      options: ['1912', '1914', '1916', '1918'],
      correctIndex: 1
    }
  ],
  programming: [
    {
      question: 'What does HTML stand for?',
      options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink and Text Markup Language', 'Home Tool Markup Language'],
      correctIndex: 0
    },
    {
      question: 'Which of these is a JavaScript framework?',
      options: ['Django', 'Flask', 'React', 'Laravel'],
      correctIndex: 2
    },
    {
      question: 'What is the output of 2 + "2" in JavaScript?',
      options: ['4', '22', 'NaN', 'Error'],
      correctIndex: 1
    },
    {
      question: 'What does CSS stand for?',
      options: ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
      correctIndex: 2
    },
    {
      question: 'Which symbol is used for single-line comments in JavaScript?',
      options: ['//', '/*', '#', '--'],
      correctIndex: 0
    },
    {
      question: 'What is the correct way to declare a variable in JavaScript?',
      options: ['variable x;', 'var x;', 'x = var;', 'x;'],
      correctIndex: 1
    },
    {
      question: 'Which of these is NOT a JavaScript data type?',
      options: ['String', 'Boolean', 'Character', 'Object'],
      correctIndex: 2
    },
    {
      question: 'What does API stand for?',
      options: ['Application Programming Interface', 'Advanced Programming Interface', 'Automated Programming Interface', 'Application Process Integration'],
      correctIndex: 0
    },
    {
      question: 'Which method adds a new element to the end of an array?',
      options: ['push()', 'pop()', 'shift()', 'unshift()'],
      correctIndex: 0
    },
    {
      question: 'What does the "=== " operator check for?',
      options: ['Value equality', 'Type equality', 'Both value and type equality', 'Assignment'],
      correctIndex: 2
    },
    {
      question: 'Which of these is NOT a JavaScript framework?',
      options: ['React', 'Angular', 'Django', 'Vue'],
      correctIndex: 2
    },
    {
      question: 'What does DOM stand for?',
      options: ['Data Object Model', 'Document Object Model', 'Digital Object Model', 'Document Oriented Model'],
      correctIndex: 1
    },
    {
      question: 'Which keyword is used to declare a constant in JavaScript?',
      options: ['let', 'var', 'const', 'final'],
      correctIndex: 2
    },
    {
      question: 'What is the correct way to write an IF statement in JavaScript?',
      options: ['if x = 5', 'if (x == 5)', 'if x == 5 then', 'if x = 5 then'],
      correctIndex: 1
    },
    {
      question: 'Which method converts a string to lowercase in JavaScript?',
      options: ['toLowerCase()', 'toLower()', 'changeCase("lower")', 'str.lower()'],
      correctIndex: 0
    },
    {
      question: 'What is the correct way to create a function in JavaScript?',
      options: ['function = myFunction()', 'function myFunction()', 'create myFunction()', 'new function myFunction()'],
      correctIndex: 1
    },
    {
      question: 'Which operator is used for strict equality in JavaScript?',
      options: ['=', '==', '===', '!='],
      correctIndex: 2
    },
    {
      question: 'What does JSON stand for?',
      options: ['JavaScript Object Notation', 'JavaScript Object Naming', 'JavaScript Oriented Notation', 'JavaScript Object Network'],
      correctIndex: 0
    },
    {
      question: 'Which method removes the last element from an array?',
      options: ['pop()', 'push()', 'shift()', 'unshift()'],
      correctIndex: 0
    },
    {
      question: 'What is the correct way to write a comment in HTML?',
      options: ['// This is a comment', '<!-- This is a comment -->', '/* This is a comment */', '# This is a comment'],
      correctIndex: 1
    }
  ],
  default: [
    {
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctIndex: 2
    },
    {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctIndex: 1
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctIndex: 1
    },
    {
      question: 'What is the largest mammal in the world?',
      options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
      correctIndex: 1
    },
    {
      question: 'How many continents are there?',
      options: ['5', '6', '7', '8'],
      correctIndex: 2
    },
    {
      question: 'What is the chemical symbol for gold?',
      options: ['Go', 'Gd', 'Au', 'Ag'],
      correctIndex: 2
    },
    {
      question: 'Who wrote "Romeo and Juliet"?',
      options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
      correctIndex: 1
    },
    {
      question: 'What is the largest planet in our solar system?',
      options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'],
      correctIndex: 2
    },
    {
      question: 'How many colors are in a rainbow?',
      options: ['5', '6', '7', '8'],
      correctIndex: 2
    },
    {
      question: 'What is the capital of Japan?',
      options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'],
      correctIndex: 2
    },
    {
      question: 'What is the largest ocean on Earth?',
      options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
      correctIndex: 3
    },
    {
      question: 'Who painted the Mona Lisa?',
      options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
      correctIndex: 2
    },
    {
      question: 'What is the square root of 144?',
      options: ['10', '12', '14', '16'],
      correctIndex: 1
    },
    {
      question: 'Which country is home to the Great Barrier Reef?',
      options: ['Brazil', 'Australia', 'Thailand', 'Mexico'],
      correctIndex: 1
    },
    {
      question: 'What is the hardest natural substance on Earth?',
      options: ['Gold', 'Iron', 'Diamond', 'Graphite'],
      correctIndex: 2
    },
    {
      question: 'How many bones are in the human body?',
      options: ['156', '206', '256', '306'],
      correctIndex: 1
    },
    {
      question: 'What is the largest desert in the world?',
      options: ['Sahara', 'Arabian', 'Gobi', 'Antarctic'],
      correctIndex: 3
    },
    {
      question: 'Which element has the chemical symbol "O"?',
      options: ['Gold', 'Osmium', 'Oxygen', 'Oganesson'],
      correctIndex: 2
    },
    {
      question: 'What is the capital of Canada?',
      options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'],
      correctIndex: 2
    },
    {
      question: 'How many players are on a standard soccer team?',
      options: ['9', '10', '11', '12'],
      correctIndex: 2
    }
  ]
};

// Function to get subject-specific fallback questions
function getFallbackQuestions(subject: string) {
  const subjectKey = Object.keys(FALLBACK_QUESTIONS).includes(subject.toLowerCase()) 
    ? subject.toLowerCase() 
    : 'default';
  return FALLBACK_QUESTIONS[subjectKey as keyof typeof FALLBACK_QUESTIONS] || FALLBACK_QUESTIONS.default;
}

export async function POST(req: Request) {
  try {
    const { subject, difficulty = 'medium', numberOfQuestions = 10, languageOrSkill } = await req.json();

    // If the subject is programming and a language/skill is provided, use it in the prompt
    const quizSubject = (subject.toLowerCase() === 'programming' && languageOrSkill) 
      ? `${languageOrSkill} programming` 
      : subject;

    try {
      // Create the prompt for OpenRouter
      const prompt = `Generate exactly ${numberOfQuestions} multiple-choice questions about ${quizSubject}.
      Difficulty level: ${difficulty}.
      Format as a JSON array where each question has:
      - question: string
      - options: string[] (exactly 4 options)
      - correctIndex: number (0-3)
      
      ${subject.toLowerCase() === 'programming' ? 'Focus on practical coding examples and real-world scenarios.' : ''}
      
      Example:
      [
        {
          "question": "What is 2+2?",
          "options": ["3", "4", "5", "6"],
          "correctIndex": 1
        }
      ]
      
      Return only the JSON array, no other text.`;

      // Call OpenRouter API
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://your-site.com', // Required by OpenRouter
          'X-Title': 'EduGenius Quiz Generator' // Optional, shown on OpenRouter dashboard
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content in API response');
      }

      // Try to extract JSON from the response
      try {
        const jsonStart = content.indexOf('[');
        const jsonEnd = content.lastIndexOf(']') + 1;
        if (jsonStart === -1 || jsonEnd === -1) throw new Error('Invalid JSON format');
        
        const jsonString = content.substring(jsonStart, jsonEnd);
        const questions = JSON.parse(jsonString);
        
        if (!Array.isArray(questions) || questions.length === 0) {
          throw new Error('No valid questions generated');
        }

        return NextResponse.json({ questions });
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.error('Raw response:', content);
        // Fall through to use fallback questions
      }
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      // Fall through to use fallback questions
    }

    // If we reach here, AI generation failed but we have a valid subject
    let fallbackQuestions = getFallbackQuestions(subject);
    
    // If it's a programming quiz with a specific language, try to filter or modify questions
    if (subject.toLowerCase() === 'programming' && languageOrSkill) {
      // Try to find language-specific questions in the fallback
      const languageLower = languageOrSkill.toLowerCase();
      const languageSpecificQuestions = fallbackQuestions.filter(q => 
        q.question.toLowerCase().includes(languageLower) ||
        q.options.some((opt: string) => opt.toLowerCase().includes(languageLower))
      );
      
      // If we found language-specific questions, use them, otherwise use all programming questions
      if (languageSpecificQuestions.length > 0) {
        fallbackQuestions = languageSpecificQuestions;
      }
      
      // Ensure we don't return more questions than requested
      if (fallbackQuestions.length > numberOfQuestions) {
        fallbackQuestions = fallbackQuestions.slice(0, numberOfQuestions);
      }
    }
    
    return NextResponse.json({ 
      questions: fallbackQuestions,
      _fallback: true
    });

  } catch (error) {
    console.error('Error in quiz generation endpoint:', error);
    
    // If we can't parse the request or get the subject, use default fallback
    try {
      const reqData = await req.json();
      const fallbackSubject = reqData?.subject || 'default';
      return NextResponse.json(
        { 
          error: 'Failed to generate quiz questions',
          questions: getFallbackQuestions(fallbackSubject),
          _fallback: true
        },
        { status: 500 }
      );
    } catch (parseError) {
      return NextResponse.json(
        { 
          error: 'Failed to generate quiz questions',
          questions: FALLBACK_QUESTIONS.default,
          _fallback: true
        },
        { status: 500 }
      );
    }
  }
}
