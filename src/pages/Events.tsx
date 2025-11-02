import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const Events = () => {
  const upcomingEvents = [
    {
      title: "Annual Cultural Night",
      date: "2024-03-15",
      time: "6:00 PM - 10:00 PM",
      location: "Hostel Lawn",
      category: "Cultural",
      description: "Showcase your talents in music, dance, and drama. Open mic and special performances.",
      attendees: "200+",
    },
    {
      title: "Inter-Hostel Cricket Tournament",
      date: "2024-03-20",
      time: "9:00 AM - 5:00 PM",
      location: "University Sports Complex",
      category: "Sports",
      description: "Join us for an exciting day of cricket. Register your team now!",
      attendees: "150+",
    },
    {
      title: "Tech Talk: AI & Future",
      date: "2024-03-25",
      time: "7:00 PM - 9:00 PM",
      location: "Common Room",
      category: "Academic",
      description: "Industry expert discussing latest trends in AI and career opportunities.",
      attendees: "80+",
    },
    {
      title: "Movie Night: Classic Edition",
      date: "2024-03-28",
      time: "8:00 PM - 11:00 PM",
      location: "Common Room",
      category: "Entertainment",
      description: "Screening of a classic movie with snacks and discussions.",
      attendees: "100+",
    },
  ];

  const recentEvents = [
    {
      title: "Freshers' Welcome Party",
      date: "2024-02-10",
      description: "Grand welcome celebration for new hostel members",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    },
    {
      title: "Republic Day Celebrations",
      date: "2024-01-26",
      description: "Flag hoisting ceremony and patriotic events",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    },
    {
      title: "Winter Sports Fest",
      date: "2024-01-15",
      description: "Week-long sports activities and competitions",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Cultural: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Sports: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Academic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Entertainment: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">Events</h1>
          <p className="text-xl max-w-3xl mx-auto animate-fade-in opacity-90">
            Stay updated with all the exciting happenings at Hostel 5
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground text-lg">Mark your calendars!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {upcomingEvents.map((event, index) => (
              <Card
                key={index}
                className="shadow-large hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">{event.title}</h3>
                    <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>{new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span>{event.attendees} expected attendees</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Recent Events
            </h2>
            <p className="text-muted-foreground text-lg">Highlights from past celebrations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {recentEvents.map((event, index) => (
              <Card
                key={index}
                className="overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Calendar Notice */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-accent text-accent-foreground shadow-large">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">Want to Organize an Event?</h3>
              <p className="text-lg mb-6 opacity-90">
                Have an idea for a hostel event? Contact the Cultural Secretary to discuss and plan your event!
              </p>
              <a href="mailto:cultural.h5@university.edu" className="inline-block">
                <button className="px-8 py-3 bg-white text-accent font-semibold rounded-lg hover:bg-white/90 transition-colors duration-300">
                  Get in Touch
                </button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Events;
