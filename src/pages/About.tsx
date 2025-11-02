import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart, Target, Zap } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "Building strong bonds and supporting each other through university life",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Striving for the best in academics, sports, and personal growth",
    },
    {
      icon: Target,
      title: "Discipline",
      description: "Maintaining high standards while respecting individual freedom",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Embracing new ideas and continuously improving our hostel experience",
    },
  ];

  const timeline = [
    {
      year: "1995",
      title: "Foundation",
      description: "Hostel 5 was established as part of the university expansion program",
    },
    {
      year: "2005",
      title: "Major Renovation",
      description: "Complete modernization of facilities and infrastructure",
    },
    {
      year: "2015",
      title: "Digital Transformation",
      description: "Introduction of high-speed WiFi and smart room features",
    },
    {
      year: "2023",
      title: "Sustainability Initiative",
      description: "Launch of eco-friendly practices and solar power integration",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">Our Story</h1>
          <p className="text-xl max-w-3xl mx-auto animate-fade-in opacity-90">
            For decades, Hostel 5 has been more than just a place to stay—it's been a home where
            friendships are forged, dreams are pursued, and memories are made.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-large animate-fade-in">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To provide a safe, comfortable, and vibrant living environment that supports
                  students in their academic journey while fostering personal growth, community
                  engagement, and lifelong friendships.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-large animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-primary">Our Vision</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To be recognized as the premier hostel on campus, setting the standard for
                  student accommodation excellence through innovation, sustainability, and an
                  unwavering commitment to our residents' well-being.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-lg">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-large transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Our Journey
            </h2>
            <p className="text-muted-foreground text-lg">Milestones in our history</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((event, index) => (
              <div
                key={index}
                className="flex gap-6 mb-8 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center font-bold text-primary-foreground text-lg flex-shrink-0">
                    {event.year}
                  </div>
                  {index !== timeline.length - 1 && (
                    <div className="w-1 h-full bg-border mt-2" />
                  )}
                </div>
                <Card className="flex-1 shadow-medium hover:shadow-large transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "200+", label: "Residents" },
              { number: "30+", label: "Years of Excellence" },
              { number: "50+", label: "Events Annually" },
              { number: "100%", label: "WiFi Coverage" },
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
