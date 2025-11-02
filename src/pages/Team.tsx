import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

const Team = () => {
  const administration = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Warden",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh",
      email: "warden.h5@university.edu",
      phone: "+91 XXX-XXX-XXXX",
      description: "Overseeing hostel operations and student welfare",
    },
    {
      name: "Mr. Amit Sharma",
      role: "Assistant Warden",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=amit",
      email: "asst.warden.h5@university.edu",
      phone: "+91 XXX-XXX-XXXX",
      description: "Assisting in day-to-day management and student support",
    },
  ];

  const studentCouncil = [
    {
      name: "Arjun Verma",
      role: "General Secretary",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
      email: "gensec.h5@university.edu",
      description: "Leading hostel council and coordinating all activities",
    },
    {
      name: "Priya Singh",
      role: "Cultural Secretary",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
      email: "cultural.h5@university.edu",
      description: "Organizing cultural events and celebrations",
    },
    {
      name: "Vikram Patel",
      role: "Sports Secretary",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
      email: "sports.h5@university.edu",
      description: "Managing sports activities and competitions",
    },
    {
      name: "Ananya Reddy",
      role: "Mess Secretary",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya",
      email: "mess.h5@university.edu",
      description: "Overseeing mess operations and menu planning",
    },
    {
      name: "Karthik Menon",
      role: "Maintenance Secretary",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=karthik",
      email: "maintenance.h5@university.edu",
      description: "Handling maintenance requests and facility upkeep",
    },
    {
      name: "Riya Sharma",
      role: "Technical Secretary",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=riya",
      email: "tech.h5@university.edu",
      description: "Managing technical infrastructure and IT support",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">Our Team</h1>
          <p className="text-xl max-w-3xl mx-auto animate-fade-in opacity-90">
            Meet the dedicated individuals who make Hostel 5 a home away from home
          </p>
        </div>
      </section>

      {/* Administration Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Administration
            </h2>
            <p className="text-muted-foreground text-lg">
              Experienced professionals ensuring smooth hostel operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {administration.map((member, index) => (
              <Card
                key={index}
                className="shadow-large hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 mb-6 rounded-full overflow-hidden ring-4 ring-primary/20">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <div className="inline-block px-4 py-1 bg-gradient-hero text-primary-foreground rounded-full text-sm font-semibold mb-4">
                      {member.role}
                    </div>
                    <p className="text-muted-foreground mb-6">{member.description}</p>
                    <div className="space-y-2 w-full">
                      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Student Council Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Student Council
            </h2>
            <p className="text-muted-foreground text-lg">
              Student representatives working for the hostel community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentCouncil.map((member, index) => (
              <Card
                key={index}
                className="shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 mb-4 rounded-full overflow-hidden ring-4 ring-primary/10">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold mb-3">
                      {member.role}
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{member.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-xs">{member.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
