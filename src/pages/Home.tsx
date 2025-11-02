import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Home as HomeIcon, Wifi, Coffee, Dumbbell, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hostel-hero.jpg";

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
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center text-primary-foreground">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Welcome to Hostel 5
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in opacity-90">
            Where community meets comfort. Experience the perfect blend of modern living and lasting friendships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/about">
              <Button size="lg" variant="secondary" className="group">
                Explore Our Story
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent-light border-2 border-primary-foreground/20"
              >
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Why Choose Hostel 5?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover what makes our hostel the perfect home away from home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => (
              <Card
                key={index}
                className="group hover:shadow-large transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-hero rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
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
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Learn more about life at Hostel 5 and become part of our family
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/facilities">
              <Button size="lg" variant="secondary">
                View Facilities
              </Button>
            </Link>
            <Link to="/events">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
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
