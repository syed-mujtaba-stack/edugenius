import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { learningStyle, difficulty, topics, timeCommitment } = await request.json();
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Generate the prompt
    const prompt = `
    Create a personalized learning path with these parameters:
    - Learning Style: ${learningStyle}
    - Difficulty: ${difficulty}
    - Topics: ${topics.join(', ')}
    - Weekly Time Commitment: ${timeCommitment} hours
    
    Generate a structured learning path with 4-6 modules. Each module should have:
    - A clear title
    - Learning objectives
    - A list of resources (videos, articles, exercises)
    - Estimated time to complete
    - Practice exercises
    
    Format the response as a JSON object with this structure:
    {
      "modules": [
        {
          "title": "Module Title",
          "description": "Brief description of what will be covered",
          "duration": "X hours",
          "resources": [
            {
              "title": "Resource Title",
              "type": "video|article|exercise|project",
              "url": "https://example.com/resource",
              "duration": "X minutes"
            }
          ],
          "exercises": ["Exercise 1", "Exercise 2"]
        }
      ]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    const learningPath = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(text);
    
    return NextResponse.json(learningPath);
    
  } catch (error) {
    console.error('Error generating learning path:', error);
    return NextResponse.json(
      { error: 'Failed to generate learning path' },
      { status: 500 }
    );
  }
}
