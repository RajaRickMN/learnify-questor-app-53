
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckSquare, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const modules = [
    {
      title: "Flashcards",
      description: "Study with interactive flashcards that test your knowledge and track your progress",
      icon: <BookOpen className="h-10 w-10" />,
      path: "/flashcards",
    },
    {
      title: "Multiple Choice Questions",
      description: "Practice with a variety of multiple choice questions on different subjects and topics",
      icon: <CheckSquare className="h-10 w-10" />,
      path: "/mcqs",
    },
    {
      title: "Test App",
      description: "Take structured tests and measure your performance across different sections",
      icon: <FileQuestion className="h-10 w-10" />,
      path: "/test-app",
    },
  ];

  return (
    <div className="page-container">
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl font-semibold tracking-tight mb-3">Interactive Learning App</h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Enhance your learning experience with interactive flashcards, multiple-choice questions, and tests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {modules.map((module, index) => (
          <Link 
            key={module.title}
            to={module.path}
            className="group"
          >
            <Card className="h-full transition-all duration-300 border-border hover:border-primary/20 hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="rounded-full w-16 h-16 flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-colors mb-4">
                  {module.icon}
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-4">
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  Start Learning
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-16 p-6 bg-secondary/50 rounded-xl border border-border text-center animate-slide-up">
        <h2 className="text-2xl font-medium mb-3">How It Works</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose a learning module, filter questions by subject or topic, and track your progress.
          The app will remember which questions you've answered correctly or incorrectly,
          helping you focus on areas that need improvement.
        </p>
      </div>
    </div>
  );
};

export default Index;
