import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">About PromptVerse AI</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The ultimate destination for AI creators and enthusiasts to discover, share, and collaborate on the best prompts.
        </p>
      </div>
      <div className="max-w-4xl mx-auto mt-12">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-card-foreground/80">
            <p>
              In the rapidly evolving landscape of artificial intelligence, the quality of output is often determined by the quality of the input. A well-crafted prompt can unlock creative potential, solve complex problems, and generate insightful content. However, finding and creating these powerful prompts can be a challenge.
            </p>
            <p>
              PromptVerse AI was born out of a passion for leveraging the full potential of AI. Our mission is to build a comprehensive and community-driven library of prompts for a wide array of AI models and use cases. We believe that by providing a centralized platform for prompt discovery and sharing, we can empower creators, developers, researchers, and hobbyists to achieve more with AI.
            </p>
            <p>
              Whether you're a seasoned prompt engineer or just starting your journey with AI, PromptVerse AI is here to be your trusted resource. Join our growing community and help us build the ultimate prompt library.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
