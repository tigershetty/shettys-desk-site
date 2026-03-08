"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    id: "1",
    title: "Curiosity",
    content:
      "It starts with a question I can't let go of. Usually from work, sometimes from a headline, sometimes from a conversation.",
  },
  {
    id: "2",
    title: "Research",
    content:
      "YouTube deep dives, industry reports, annual filings. I go until the story connects.",
  },
  {
    id: "3",
    title: "Synthesize",
    content:
      "Strip it down to what matters. If I can't explain it simply, I don't understand it yet.",
  },
  {
    id: "4",
    title: "Visualize",
    content:
      "The infographic. I use AI tools (Gemini) with custom prompts to match the Shetty's Desk look.",
  },
  {
    id: "5",
    title: "Publish",
    content:
      "LinkedIn first. The caption matters as much as the visual. That's where the real thinking lives.",
  },
  {
    id: "6",
    title: "Reflect",
    content:
      "Who read it? What seniority? What industry? The analytics tell me if the message landed.",
  },
];

export default function ApproachAccordion() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Accordion type="single" defaultValue="1" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className="last:border-b"
          >
            <AccordionTrigger className="text-left pl-6 md:pl-14 overflow-hidden text-foreground/20 duration-200 hover:no-underline cursor-pointer -space-y-6 data-[state=open]:space-y-0 data-[state=open]:text-primary [&>svg]:hidden">
              <div className="flex flex-1 items-start gap-4">
                <p className="text-xs">{item.id}</p>
                <h1 className="uppercase relative text-center text-3xl md:text-5xl">
                  {item.title}
                </h1>
              </div>
            </AccordionTrigger>

            <AccordionContent className="text-muted-foreground pb-6 pl-6 md:px-20">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
