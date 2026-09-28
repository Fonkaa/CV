import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Intelligent Local Search & Context Extraction Engine
function extractRelevantPdfSections(pdfText: string, query: string): string[] {
  if (!pdfText) return [];

  // Normalize lines and split into blocks/sections
  const paragraphs = pdfText
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 25);

  const queryTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["what", "which", "where", "when", "does", "have", "with", "from", "that", "this"].includes(w));

  // Score each section based on term presence and heading cues
  const scored = paragraphs.map((para) => {
    const lowerPara = para.toLowerCase();
    let score = 0;

    for (const term of queryTerms) {
      if (lowerPara.includes(term)) {
        score += 3;
      }
    }

    // Boost common career and qualification domains
    if (/certificate|certification|award|honor|credential|license/i.test(query) && /certificate|certified|certification|award|training|program/i.test(para)) {
      score += 6;
    }
    if (/education|degree|university|school|study|gpa|bachelor/i.test(query) && /university|institute|college|degree|bachelor|gpa/i.test(para)) {
      score += 6;
    }
    if (/experience|internship|job|work|role|company/i.test(query) && /experience|engineer|intern|developer|responsibilities/i.test(para)) {
      score += 6;
    }

    return { para, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.para)
    .slice(0, 3);
}

export async function POST(req: NextRequest) {
  try {
    const { message, history, context, aiInstructions } = await req.json();

    const candidateName = context?.hero?.name || "Abdulbasit Ylkal Abate";
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // Extracted PDF background document content
    const pdfDocumentContent = (context?.resumePdfText || "").trim();
    const pdfDocumentName = context?.resumePdfName || "Resume Document";
    const userQuery = (message || "").trim();
    const lower = userQuery.toLowerCase();

    // 1. FAST-PATH: Direct Identity & Basic Names
    if (lower === "what is his name" || lower === "what is your name" || lower.includes("who is he") || lower.includes("his name")) {
      return NextResponse.json({
        reply: `His name is ${candidateName}. He is a ${context?.hero?.subheadline || "Software Engineer"}. ${context?.hero?.bio || ""}`
      });
    }

    // 2. LIVE GEMINI 2.5 FLASH WITH NATIVE SYSTEM INSTRUCTION
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `
You are the official AI Twin and System Representative for ${candidateName}.

Admin Directives:
"${aiInstructions || "Be authoritative, articulate, and ground your answers strictly in the verified background document and live portfolio state."}"

=== VERIFIED DOCUMENT (INGESTED PDF RESUME / CV) ===
${pdfDocumentContent ? `Document: ${pdfDocumentName}\n\n${pdfDocumentContent}` : "[No PDF document uploaded yet.]"}
=====================================================

=== VERIFIED LIVE SCREEN STATE ===
Name: ${candidateName}
Headline: ${context?.hero?.headline || ""}
Subheadline: ${context?.hero?.subheadline || ""}
Status: ${context?.hero?.status || "Active"}
Bio: ${context?.hero?.bio || ""}
Skills: ${JSON.stringify(context?.skills || [])}
Projects: ${JSON.stringify(context?.projects || [])}
Contact Endpoints: ${JSON.stringify(context?.contact || {})}
===================================

GROUNDING INSTRUCTIONS:
1. When asked about certificates, degrees, universities, work experience, roles, or metrics, prioritize the VERIFIED DOCUMENT (PDF) text above.
2. If information is asked that exists in the PDF or system state, extract and summarize it clearly in 2 to 4 sentences.
3. If the user asks about something completely absent from both the PDF and live portfolio, respond:
   "That detail is not documented in ${candidateName}'s verified portfolio or background record. Feel free to contact him directly via the contact channels."
4. Always address ${candidateName} respectfully and accurately.
`;

        // Format conversation turns for the Google GenAI SDK
        const contents = [
          ...(history || []).map((h: { sender: string; text: string }) => ({
            role: h.sender === "user" ? "user" : "model",
            parts: [{ text: h.text }],
          })),
          { role: "user", parts: [{ text: userQuery }] },
        ];

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents,
          config: {
            systemInstruction,
            temperature: 0.2,
          },
        });

        if (response.text) {
          return NextResponse.json({ reply: response.text.trim() });
        }
      } catch (sdkError: any) {
        console.warn("Gemini API call failed, activating local semantic fallback:", sdkError?.message || sdkError);
      }
    }

    // 3. DETERMINISTIC SEMANTIC SEARCH (Runs whenever API is unavailable or unconfigured)
    
    // Visitor Name Handling
    const nameMatch = userQuery.match(/(?:my name is|i am|call me)\s+([a-zA-Z]+)/i);
    if (nameMatch && nameMatch[1]) {
      return NextResponse.json({
        reply: `Pleasure to meet you, ${nameMatch[1]}! How can I assist you regarding ${candidateName}'s projects, certifications, or technical background?`
      });
    }

    if (lower.includes("what is my name") || lower.includes("do you remember my name")) {
      const priorName = (history || []).find((h: any) => /(?:my name is|i am|call me)\s+([a-zA-Z]+)/i.test(h.text));
      if (priorName) {
        const m = priorName.text.match(/(?:my name is|i am|call me)\s+([a-zA-Z]+)/i);
        if (m && m[1]) return NextResponse.json({ reply: `According to our conversation, your name is ${m[1]}.` });
      }
      return NextResponse.json({ reply: "You haven't told me your name yet! What should I call you?" });
    }

    // A. Intelligent PDF Content Matching
    if (pdfDocumentContent) {
      // Certificate & Award queries
      if (/certificate|certification|certified|award|honor|training|program/i.test(lower)) {
        const matches = extractRelevantPdfSections(pdfDocumentContent, "certificate certification training award achievement program");
        if (matches.length > 0) {
          return NextResponse.json({
            reply: `Here are the verified certificates, achievements, and training programs documented for ${candidateName}:\n\n${matches.map(m => `• ${m}`).join("\n\n")}`
          });
        }
      }

      // Education & University queries
      if (/education|degree|university|college|school|gpa|graduat/i.test(lower)) {
        const matches = extractRelevantPdfSections(pdfDocumentContent, "education university degree bachelor software engineering student gpa");
        if (matches.length > 0) {
          return NextResponse.json({
            reply: `Educational credentials from ${candidateName}'s verified document:\n\n${matches.map(m => `• ${m}`).join("\n\n")}`
          });
        }
      }

      // General Document / CV / Summary queries
      if (/document|pdf|resume|cv|summary|background|who is/i.test(lower)) {
        const preview = pdfDocumentContent.slice(0, 360).replace(/\s+/g, " ");
        return NextResponse.json({
          reply: `Document on file: "${pdfDocumentName}" (${pdfDocumentContent.length} characters indexed).\n\nOverview:\n"${preview}..."\n\nYou can ask about specific projects, certifications, or competencies.`
        });
      }

      // Search all paragraphs if specific keywords are found
      const generalMatches = extractRelevantPdfSections(pdfDocumentContent, userQuery);
      if (generalMatches.length > 0) {
        return NextResponse.json({
          reply: `From ${candidateName}'s verified background document:\n\n${generalMatches.map(m => `• ${m}`).join("\n\n")}`
        });
      }
    } else {
      if (/certificate|certification|resume|cv|document|pdf/i.test(lower)) {
        return NextResponse.json({
          reply: `No background PDF document is currently attached. Please upload a resume or certificate document in the Admin Codex (Folio 8) and click "Inscribe & Bind".`
        });
      }
    }

    // B. Live Portfolio State Fallbacks
    // Skills
    if (/skill|stack|technolog|language|framework|tool/i.test(lower)) {
      const skills = (context?.skills || []).map((s: any) => `• ${s.category}: ${s.list?.join(", ")}`).join("\n");
      return NextResponse.json({
        reply: `Technical competencies for ${candidateName}:\n\n${skills || "No skills currently listed."}`
      });
    }

    // Projects
    for (const project of (context?.projects || [])) {
      if (lower.includes(project.title.toLowerCase()) || (project.tagline && lower.includes(project.tagline.toLowerCase()))) {
        return NextResponse.json({
          reply: `"${project.title}" (${project.tagline}): ${project.description}. Stack: ${project.tags?.join(", ")}.${project.liveUrl ? ` Live Demo: ${project.liveUrl}` : ""}`
        });
      }
    }

    if (/project|work|built|portfolio|system/i.test(lower)) {
      const projects = (context?.projects || []).map((p: any) => `• ${p.title} (${p.tags?.join(", ")})`).join("\n");
      return NextResponse.json({
        reply: `Curated engineering implementations in the portfolio:\n\n${projects || "No projects currently indexed."}`
      });
    }

    // Contact Endpoints
    if (/contact|email|phone|telegram|reach|hire/i.test(lower)) {
      return NextResponse.json({
        reply: `You can reach ${candidateName} directly through:\n• Email: ${context?.contact?.email || "fikiylkal@gmail.com"}\n• Phone: ${context?.contact?.phone || "N/A"}\n• Telegram: ${context?.contact?.telegram || "N/A"}`
      });
    }

    // Final Dynamic Fallback
    return NextResponse.json({
      reply: pdfDocumentContent
        ? `I have indexed ${candidateName}'s background document "${pdfDocumentName}". Ask me about his certificates, education, project architectures, or technical disciplines.`
        : `I am the AI Assistant for ${candidateName}. Ask me about his technical stack, engineering projects, or contact channels.`
    });

  } catch (error: any) {
    console.error("Assistant Route Error:", error);
    return NextResponse.json({ reply: "Service is temporarily synchronizing. Please try again." }, { status: 500 });
  }
}