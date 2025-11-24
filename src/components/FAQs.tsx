import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can I invest even if I only have a small amount?",
    answer: "Yes! Campus Invest is built for micro-funding—you can start with as little as PKR 100 and still make an impact. This makes investing accessible to students, faculty, and alumni regardless of their budget.",
  },
  {
    question: "What do investors get in return?",
    answer: "Investors receive exclusive rewards and perks such as merchandise, early/beta access to products, early-supporter badges, recognition within the university community, and future revenue-share options in later rounds as startups mature.",
  },
  {
    question: "How do you make sure the startups are genuine?",
    answer: "Every founder is required to pass university CMS/student ID verification, and projects are reviewed before going live. Startups must provide regular progress updates, and inactive or suspicious listings get auto-flagged or removed to protect investor trust.",
  },
  {
    question: "Do investors get updates on progress?",
    answer: "Yes, founders must provide periodic updates on milestones, progress reports, and growth metrics. Delays or inactivity can trigger warnings or removal, ensuring transparency and accountability.",
  },
  {
    question: "What fees does Campus Invest charge?",
    answer: "Campus Invest charges a platform commission of 5-10% per funding round, paid by the startup. There is also a startup onboarding fee (PKR 2,000-5,000) depending on startup type. Investors pay no fees—you invest exactly what you choose.",
  },
];

const FAQs = () => {
  return (
    <section id="faqs" className="py-24 px-4 bg-gradient-subtle">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Campus Invest
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border-2 border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:hello@campusinvest.pk"
            className="text-primary font-semibold hover:underline"
          >
            Contact us at hello@campusinvest.pk
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQs;

