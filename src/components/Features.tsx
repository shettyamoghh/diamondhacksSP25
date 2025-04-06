import { Feature } from "./Feature";

const features = [
  {
    title: "Syllabus to Roadmap",
    description:
      "Upload your syllabus and get a complete breakdown of topics tailored into a structured study path.",
  },
  {
    title: "Personalized Study Plans",
    description:
      "AI-generated timelines based on your exam dates help you stay on track without the guesswork.",
  },
  {
    title: "Interactive Quizzes",
    description:
      "Reinforce your learning with smart flashcards and quizzes that adapt to your progress.",
  },
  {
    title: "Auto-Sourced Resources",
    description:
      "Instantly access curated videos, notes, and articles for every topic you're working on.",
  },
  {
    title: "Track Your Progress",
    description:
      "Check off topics as you go and watch your progress grow—motivation built-in.",
  },
  {
    title: "Deadline Reminders",
    description:
      "Get timely nudges and reminders so you never fall behind and always stay on track.",
  },
];

export const Features = () => {
  return (
    <div id="features" className="bg-black text-white py-[72px] sm:py-24">
      <div className="container">
        <h2 className="text-center font-bold text-5xl sm:text-6xl tracking-tighter">
          Key Features
        </h2>
        <div className="max-w-xl mx-auto">
          <p className="text-center mt-5 text-xl text-white/70">
            Everything you need to study smarter. From AI-driven plans to
            interactive quizzes—this is your complete study system.
          </p>
        </div>
        <div className="mt-16 flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ title, description }) => (
            <Feature title={title} description={description} key={title} />
          ))}
        </div>
      </div>
    </div>
  );
};
