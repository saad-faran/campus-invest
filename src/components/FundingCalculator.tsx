import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calculator, Download, FileText, Loader2, TrendingUp } from "lucide-react";
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

// Function to format text for PDF
function formatForPDF(text: string): string {
  const cleaned = cleanAndFormatText(text);
  const lines = cleaned.split("\n");
  const formatted: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];
    
    formatted.push(line);
    
    // Add spacing after headers
    if (line.length > 0 && line.length < 60 && !line.startsWith("•") && !line.match(/^\d+\./)) {
      if (nextLine && nextLine.length > 0 && !nextLine.match(/^[A-Z\s]+$/) && !nextLine.startsWith("•")) {
        formatted.push("");
      }
    }
  }
  
  return formatted.join("\n");
}

const FundingCalculator = () => {
  const [startupIdea, setStartupIdea] = useState("");
  const [expectedUsers, setExpectedUsers] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [result, setResult] = useState("");
  const [formattedResult, setFormattedResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function calculate() {
    if (!startupIdea.trim()) {
      setError("Please enter your startup idea.");
      return;
    }

    if (!expectedUsers.trim()) {
      setError("Please enter expected number of users.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");
    setFormattedResult("");

    try {
      const response = await fetch("/api/funding-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startupIdea,
          expectedUsers: parseInt(expectedUsers) || 0,
          teamSize: teamSize ? parseInt(teamSize) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to calculate funding");
      }

      const rawText = data.text || "No output generated.";
      const cleaned = cleanAndFormatText(rawText);
      setResult(rawText);
      setFormattedResult(cleaned);
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
    doc.text("Funding Ask Calculator Report", margin, 30);
    
    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const date = new Date().toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
    doc.text(`Generated on ${date}`, margin, 37);
    
    // Input summary
    doc.setFontSize(11);
    doc.text(`Startup Idea: ${startupIdea.substring(0, 60)}${startupIdea.length > 60 ? "..." : ""}`, margin, 45);
    doc.text(`Expected Users: ${expectedUsers}`, margin, 52);
    if (teamSize) {
      doc.text(`Team Size: ${teamSize}`, margin, 59);
    }
    
    // Content
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    const pdfText = formatForPDF(formattedResult);
    const lines = doc.splitTextToSize(pdfText, maxWidth);
    
    let yPos = teamSize ? 66 : 59;
    const lineHeight = 7;
    
    lines.forEach((line: string) => {
      if (yPos > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
      
      if (line.length < 60 && line.length > 0 && !line.startsWith("•") && !line.match(/^\d+\./)) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        yPos += 3;
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
      }
      
      doc.text(line, margin, yPos);
      yPos += lineHeight;
    });
    
    doc.save("Funding-Calculator-Report.pdf");
  }

  function downloadTXT() {
    if (!formattedResult) return;

    const date = new Date().toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
    
    const content = `FUNDING ASK CALCULATOR REPORT
Generated on ${date}

Input:
Startup Idea: ${startupIdea}
Expected Users: ${expectedUsers}
${teamSize ? `Team Size: ${teamSize}` : ""}

${formatForPDF(formattedResult)}`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Funding-Calculator-Report.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border-2 border-primary/30 mb-6 animate-pulse">
            <Calculator className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">✨ AI-Powered Tool</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Funding Ask Calculator
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Calculate how much funding you need and justify your ask with AI-powered analysis. Get a detailed breakdown of costs, burn rate, and valuation suggestions.
          </p>
        </div>

        <Card className="p-8 border-2 hover:border-primary/50 transition-all duration-300 bg-card">
          <div className="space-y-6">
            <div>
              <label htmlFor="startup-idea" className="block text-sm font-semibold text-foreground mb-3">
                Startup Idea
              </label>
              <Textarea
                id="startup-idea"
                value={startupIdea}
                onChange={(e) => setStartupIdea(e.target.value)}
                rows={4}
                placeholder="Describe your startup idea in 2-3 sentences..."
                className="w-full resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="expected-users" className="block text-sm font-semibold text-foreground mb-3">
                  Expected Users <span className="text-destructive">*</span>
                </label>
                <Input
                  id="expected-users"
                  type="number"
                  value={expectedUsers}
                  onChange={(e) => setExpectedUsers(e.target.value)}
                  placeholder="e.g., 1000"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="team-size" className="block text-sm font-semibold text-foreground mb-3">
                  Team Size <span className="text-muted-foreground text-xs">(optional)</span>
                </label>
                <Input
                  id="team-size"
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  placeholder="e.g., 3"
                  className="w-full"
                />
              </div>
            </div>

            <Button
              onClick={calculate}
              disabled={loading || !startupIdea.trim() || !expectedUsers.trim()}
              size="lg"
              variant="secondary"
              className="w-full group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  Calculate Funding Ask
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
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Funding Recommendation
                  </h3>
                </div>
                <div className="bg-background p-6 rounded-lg border border-border">
                  <div className="prose prose-sm max-w-none text-foreground">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {formattedResult.split("\n").map((line, idx) => {
                        const trimmedLine = line.trim();
                        
                        if (!trimmedLine) {
                          return <br key={idx} />;
                        }
                        
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
                        
                        if (trimmedLine.startsWith("•") || trimmedLine.match(/^\d+\./)) {
                          const content = trimmedLine.replace(/^[•\d.\s]+/, "").trim();
                          return (
                            <div key={idx} className="flex items-start mb-2 ml-4">
                              <span className="mr-2 text-primary font-bold">•</span>
                              <span className="text-muted-foreground">{content}</span>
                            </div>
                          );
                        }
                        
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

export default FundingCalculator;

