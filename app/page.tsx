import { Hero } from "@/app/_home/hero";
import { LearningAreas } from "@/app/_home/learning-areas";
import { LearningPath } from "@/app/_home/learning-path";
import { WhySection } from "@/app/_home/why-section";
import { FeaturedLearning } from "@/app/_home/featured-learning";
import { AboutSection } from "@/app/_home/about-section";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <LearningAreas />
      <LearningPath />
      <WhySection />
      <FeaturedLearning />
      <AboutSection />
    </main>
  );
}
