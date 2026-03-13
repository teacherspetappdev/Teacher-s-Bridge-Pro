"use server";

import { createClient } from "@/supabase/server";
import { createLessonPlan } from "@/lib/db/lesson-plans";
import { searchDocuments } from "@/lib/rag";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface GenerateLessonPlanInput {
  subject: string;
  gradeLevel: string;
  topic: string;
  duration: number;
  additionalContext?: string;
}

export async function generateLessonPlan(input: GenerateLessonPlanInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { subject, gradeLevel, topic, duration, additionalContext } = input;

  let context = "";
  try {
    const relatedDocs = await searchDocuments(topic, 0.7, 3);
    if (relatedDocs.length > 0) {
      context = "Relevant curriculum context:\n" + relatedDocs.map(d => d.content).join("\n\n");
    }
  } catch {
    // Continue without context if search fails
  }

  const prompt = `You are an expert educator. Create a detailed lesson plan.

Subject: ${subject}
Grade Level: ${gradeLevel}
Topic: ${topic}
Duration: ${duration} minutes
${additionalContext ? `Additional Context: ${additionalContext}` : ""}
${context ? `\n${context}` : ""}

Generate a lesson plan in JSON format with the following structure:
{
  "title": "Lesson title",
  "description": "Brief description of the lesson",
  "objectives": ["Learning objective 1", "Learning objective 2", "Learning objective 3"],
  "materials": ["Material 1", "Material 2"],
  "activities": [
    {
      "name": "Activity name",
      "duration": 10,
      "description": "Detailed description of the activity"
    }
  ]
}

Ensure activities durations sum to approximately ${duration} minutes. Return only valid JSON.`;

  let lessonPlanContent: {
    title: string;
    description: string;
    objectives: string[];
    materials: string[];
    activities: { name: string; duration: number; description: string }[];
  };

  if (OPENAI_API_KEY) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate lesson plan");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      lessonPlanContent = JSON.parse(content);
    } catch {
      throw new Error("Failed to parse lesson plan response");
    }
  } else {
    lessonPlanContent = {
      title: `${topic} - ${subject}`,
      description: `A ${duration}-minute lesson on ${topic} for ${gradeLevel} grade students.`,
      objectives: [
        `Understand the key concepts of ${topic}`,
        `Apply knowledge to practical examples`,
        `Demonstrate understanding through activities`,
      ],
      materials: ["Whiteboard", "Worksheets", "Projector"],
      activities: [
        {
          name: "Introduction",
          duration: Math.floor(duration * 0.15),
          description: `Introduce the topic of ${topic} and engage students with prior knowledge.`,
        },
        {
          name: "Direct Instruction",
          duration: Math.floor(duration * 0.25),
          description: "Present key concepts and demonstrate examples.",
        },
        {
          name: "Guided Practice",
          duration: Math.floor(duration * 0.3),
          description: "Work through examples together as a class.",
        },
        {
          name: "Independent Practice",
          duration: Math.floor(duration * 0.2),
          description: "Students work independently on related exercises.",
        },
        {
          name: "Closure",
          duration: Math.floor(duration * 0.1),
          description: "Review key points and preview next lesson.",
        },
      ],
    };
  }

  const lessonPlan = await createLessonPlan(user.id, {
    title: lessonPlanContent.title,
    description: lessonPlanContent.description,
    grade_level: gradeLevel,
    subject: subject,
    objectives: lessonPlanContent.objectives,
    materials: lessonPlanContent.materials,
    activities: lessonPlanContent.activities.map(a => JSON.stringify(a)),
    duration_minutes: duration,
  });

  return lessonPlan;
}
