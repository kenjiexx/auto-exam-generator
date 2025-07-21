import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function AutoExamGenerator() {
  const [pdfText, setPdfText] = useState("");
  const [questions, setQuestions] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") return;

    const reader = new FileReader();
    reader.onload = async () => {
      const typedarray = new Uint8Array(reader.result);
      const pdfDoc = await PDFDocument.load(typedarray);
      const numPages = pdfDoc.getPageCount();
      let fullText = "";

      for (let i = 0; i < numPages; i++) {
        const page = pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const strings = textContent.items.map((item) => item.str).join(" ");
        fullText += strings + " ";
      }

      setPdfText(fullText);
      generateExamQuestions(fullText);
    };
    reader.readAsArrayBuffer(file);
  };

  const generateExamQuestions = (text) => {
    // Simple keyword-based generator - replace with real GPT logic
    const keywords = ["constitutional", "criminal", "liable", "jurisdiction", "doctrine"];
    const generated = keywords.map((word, index) => ({
      question: `What is the legal implication of the term "${word}" as used in the uploaded material?`,
      options: ["A", "B", "C", "D"],
      answer: "A" // Placeholder
    }));

    setQuestions(generated);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="mb-6">
        <CardContent className="p-4 text-center">
          <label htmlFor="file-upload" className="cursor-pointer">
            <Inbox className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-sm text-gray-600">Drop a PDF here or click to upload</p>
            <input id="file-upload" type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
          </label>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">Generated Exam Questions</h2>
            {questions.map((q, i) => (
              <div key={i} className="space-y-1">
                <p className="font-medium">{i + 1}. {q.question}</p>
                <ul className="pl-4 list-disc">
                  {q.options.map((opt, j) => <li key={j}>{opt}</li>)}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
