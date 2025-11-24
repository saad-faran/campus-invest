import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Download, FileText, Loader2 } from "lucide-react";
import jsPDF from "jspdf";

// Function to clean markdown and format text professionally
function cleanAndFormatText(text: string): string {
  if (!text) return "";
  
  let cleaned = text;
  
  // Remove markdown headers (##, ###, etc.)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, "");
  
  // Remove horizontal rules (---)
  cleaned = cleaned.replace(/^---+$/gm, "");
  
  // Convert markdown bold (**text**) to plain text
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "$1");
  
  // Convert markdown italic (*text*) to plain text
  cleaned = cleaned.replace(/\*(.+?)\*/g, "$1");
  
  // Convert markdown list items (- or *) to proper bullets
  cleaned = cleaned.replace(/^[\s]*[-*]\s+/gm, "• ");
  
  // Convert numbered markdown lists (1. 2. etc.) to proper numbering
  cleaned = cleaned.replace(/^(\d+)\.\s+/gm, "$1. ");
  
  // Clean up multiple blank lines (more than 2 consecutive)
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  
  // Trim each line
  cleaned = cleaned.split("\n").map(line => line.trim()).join("\n");
  
  // Remove leading/trailing whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

// Function to format text for PDF with proper spacing
function formatForPDF(text: string): string {
  const cleaned = cleanAndFormatText(text);
  
  // Add extra spacing after section headers (lines that are all caps or short)
  const lines = cleaned.split("\n");
  const formatted: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];
    
    formatted.push(line);
    
    // Add spacing after headers (short lines, likely section titles)
    if (line.length > 0 && line.length < 60 && !line.startsWith("•") && !line.match(/^\d+\./)) {
      if (nextLine && nextLine.length > 0 && !nextLine.match(/^[A-Z\s]+$/) && !nextLine.startsWith("•")) {
        formatted.push("");
      }
    }
  }
  
  return formatted.join("\n");
}

const FYPTransformer = () => {
  const [abstract, setAbstract] = useState("");
  const [result, setResult] = useState("");
  const [formattedResult, setFormattedResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function transform() {
    if (!abstract.trim()) {
      setError("Please enter an abstract to transform.");
      return;
    }

      setLoading(true);
      setError("");
      setResult("");
      setFormattedResult("");

    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ abstract }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to transform abstract");
      }

      const rawText = data.text || "No output generated.";
      const cleaned = cleanAndFormatText(rawText);
      setResult(rawText); // Keep original for fallback
      setFormattedResult(cleaned); // Use cleaned version for display
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function downloadPDF() {
    if (!formattedResult) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Startup Concept Plan", margin, 30);
    
    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const date = new Date().toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
    doc.text(`Generated on ${date}`, margin, 37);
    
    // Content
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    const pdfText = formatForPDF(formattedResult);
    const lines = doc.splitTextToSize(pdfText, maxWidth);
    
    let yPos = 45;
    const lineHeight = 7;
    
    lines.forEach((line: string) => {
      // Check if we need a new page
      if (yPos > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
      
      // Format section headers (short lines, likely titles)
      if (line.length < 60 && line.length > 0 && !line.startsWith("•") && !line.match(/^\d+\./)) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        yPos += 3; // Extra space before header
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
      }
      
      doc.text(line, margin, yPos);
      yPos += lineHeight;
    });
    
    doc.save("FYP-to-Startup.pdf");
  }

  function downloadTXT() {
    if (!formattedResult) return;

    const date = new Date().toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
    
    const content = `STARTUP CONCEPT PLAN\nGenerated on ${date}\n\n${formatForPDF(formattedResult)}`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "FYP-to-Startup.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <section id="ai-tools-section" className="py-24 px-4 bg-background scroll-mt-20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border-2 border-primary/30 mb-6 animate-pulse">
            <Sparkles className="w-4 h-4 text-primary animate-spin-slow" />
            <span className="text-sm font-medium text-primary">✨ AI-Powered Tool</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            FYP → Startup Transformer
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Transform your final-year project abstract into a comprehensive startup concept with AI. Get a complete business plan including problem, solution, target market, monetization, and launch roadmap.
          </p>
        </div>

        <Card className="p-8 border-2 hover:border-primary/50 transition-all duration-300 bg-card">
          <div className="space-y-6">
            <div>
              <label htmlFor="abstract-input" className="block text-sm font-semibold text-foreground mb-3">
                Paste Your Final-Year Project Abstract
              </label>
              <Textarea
                id="abstract-input"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                rows={8}
                placeholder="Enter your FYP abstract here... For example: 'This project aims to develop a mobile application for managing agricultural data using IoT sensors...'"
                className="w-full resize-none"
              />
            </div>

            <Button
              onClick={transform}
              disabled={loading || !abstract.trim()}
              size="lg"
              variant="secondary"
              className="w-full group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Transforming with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Transform with AI
                </>
              )}
            </Button>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {formattedResult && (
              <div className="mt-6 p-6 bg-muted/50 rounded-xl border-2 border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Generated Startup Plan
                  </h3>
                </div>
                <div className="bg-background p-6 rounded-lg border border-border">
                  <div className="prose prose-sm max-w-none text-foreground">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {formattedResult.split("\n").map((line, idx) => {
                        const trimmedLine = line.trim();
                        
                        // Empty line - add spacing
                        if (!trimmedLine) {
                          return <br key={idx} />;
                        }
                        
                        // Section header detection (short lines, likely titles)
                        if (trimmedLine.length < 70 && 
                            trimmedLine.length > 3 && 
                            !trimmedLine.startsWith("•") && 
                            !trimmedLine.match(/^\d+\./) &&
                            (idx === 0 || formattedResult.split("\n")[idx - 1].trim() === "")) {
                          return (
                            <h4 key={idx} className="font-bold text-base text-primary mt-6 mb-3 first:mt-0">
                              {trimmedLine}
                            </h4>
                          );
                        }
                        
                        // List item
                        if (trimmedLine.startsWith("•") || trimmedLine.match(/^\d+\./)) {
                          const content = trimmedLine.replace(/^[•\d.\s]+/, "").trim();
                          return (
                            <div key={idx} className="flex items-start mb-2 ml-4">
                              <span className="mr-2 text-primary font-bold">•</span>
                              <span className="text-muted-foreground">{content}</span>
                            </div>
                          );
                        }
                        
                        // Regular text line
                        return (
                          <p key={idx} className="mb-3 text-muted-foreground leading-relaxed">
                            {trimmedLine}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    onClick={downloadPDF}
                    variant="default"
                    className="group"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={downloadTXT}
                    variant="outline"
                    className="group"
                  >
                    <FileText className="w-4 h-4" />
                    Download TXT
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default FYPTransformer;

