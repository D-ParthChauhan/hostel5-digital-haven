import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Home as HomeIcon, Wifi, Coffee, Dumbbell, BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hostel-hero.jpeg";

const Home = () => {
  const highlights = [
    {
      icon: Users,
      title: "Strong Community",
      description: "A vibrant community of students supporting each other",
    },
    {
      icon: HomeIcon,
      title: "Modern Facilities",
      description: "Well-equipped rooms and common areas for comfort",
    },
    {
      icon: Wifi,
      title: "High-Speed WiFi",
      description: "Stay connected with reliable internet across the hostel",
    },
    {
      icon: Coffee,
      title: "Quality Mess",
      description: "Nutritious and delicious meals served daily",
    },
    {
      icon: Dumbbell,
      title: "Sports & Fitness",
      description: "Gym and sports facilities for an active lifestyle",
    },
    {
      icon: BookOpen,
      title: "Study Spaces",
      description: "Quiet areas and library for focused learning",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/60 dark:from-background/98 dark:via-background/90 dark:to-background/70" />
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl float" style={{ animationDelay: "-3s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <div className="animate-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Welcome to Your Second Home</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-in-delay-1">
            <span className="text-gradient">Hostel 5</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-muted-foreground animate-in-delay-2">
            Where community meets comfort. Experience the perfect blend of modern living and lasting friendships.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in-delay-3">
            <Link to="/about">
              <Button size="lg" className="bg-gradient-hero hover:opacity-90 glow-hover group h-14 px-8 text-lg">
                Explore Our Story
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/community">
              <Button size="lg" variant="outline" className="glass h-14 px-8 text-lg hover:bg-primary/10">
                Join Community
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1.5 h-3 bg-foreground/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 mesh-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-gradient">Hostel 5?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover what makes our hostel the perfect home away from home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => (
              <Card
                key={index}
                className="glass group hover:shadow-large transition-all duration-500 hover:-translate-y-2 animate-in gradient-border"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-hero rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 glow">
                    <highlight.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
                  <p className="text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Learn more about life at Hostel 5 and become part of our family
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/facilities">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 h-14 px-8 text-lg">
                View Facilities
              </Button>
            </Link>
            <Link to="/events">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 h-14 px-8 text-lg backdrop-blur-sm"
              >
                Check Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
