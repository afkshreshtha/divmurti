// app/api/generate-description/route.ts
import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, materialRef, paintingStyle, dimensions } =
      await request.json();
    // Resolve material reference if provided
    let materialName = "";
    let unitName = "";
    if (materialRef) {
      const materialDoc = await client.fetch(`*[_id == $id][0]`, {
        id: materialRef,
      });
      materialName = materialDoc?.title || "";
    }
    // Resolve individual dimension units and values
    const parsedDimensions = {
      length: {
        value: dimensions?.length?.value || null,
        unitRef: dimensions?.length?.unitRef || null,
      },
      width: {
        value: dimensions?.width?.value || null,
        unitRef: dimensions?.width?.unitRef || null,
      },
      height: {
        value: dimensions?.height?.value || null,
        unitRef: dimensions?.height?.unitRef || null,
      },
    };

    // Resolve unit names
    async function resolveUnit(ref: string | null): Promise<string> {
      if (!ref) return "";
      
      try {
        // Query specifically for measurement documents
        const doc = await client.fetch(`*[_type == "measurement" && _id == $id][0]`, { id: ref });
        

        
        // Return symbol if available, fallback to title
        return doc?.symbol || doc?.title || "";
      } catch (error) {
        console.error(`Error resolving unit ${ref}:`, error);
        return "";
      }
    }
    
    const lengthUnit = await resolveUnit(parsedDimensions.length.unitRef);
    const widthUnit = await resolveUnit(parsedDimensions.width.unitRef);
    const heightUnit = await resolveUnit(parsedDimensions.height.unitRef);
    
 
    
    const prompt = `Generate a short product description for a marble statue:
- Name: ${name}
- Material: ${materialName}
- Painting Style: ${paintingStyle}
- Height: ${parsedDimensions.height.value} ${heightUnit}
- Width: ${parsedDimensions.width.value} ${widthUnit}
- Length: ${parsedDimensions.length.value} ${lengthUnit}

Keep it concise, elegant, and devotional.`;


    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-70b-8192", // Updated to a current Groq model
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant for an idol store.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "Error from GROQ API", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    return NextResponse.json({ description: content });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
