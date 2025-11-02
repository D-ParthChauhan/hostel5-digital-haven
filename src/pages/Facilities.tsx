import { Card, CardContent } from "@/components/ui/card";
import {
  Wifi,
  Utensils,
  Dumbbell,
  BookOpen,
  Tv,
  Droplet,
  Wind,
  Shield,
  Coffee,
  Camera,
  WashingMachine,
  Activity,
} from "lucide-react";

const Facilities = () => {
  const facilities = [
    {
      icon: Wifi,
      title: "High-Speed WiFi",
      description: "24/7 high-speed internet connectivity throughout the hostel with dedicated bandwidth per student",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Utensils,
      title: "Quality Mess",
      description: "Hygienic mess facility serving nutritious vegetarian and non-vegetarian meals with varied menu",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Dumbbell,
      title: "Gymnasium",
      description: "Fully-equipped gym with modern cardio and weight training equipment, open from 6 AM to 10 PM",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: BookOpen,
      title: "Reading Room & Library",
      description: "Quiet study spaces with extensive collection of academic resources and reference materials",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Tv,
      title: "Common Room",
      description: "Spacious recreation area with TV, indoor games, and comfortable seating for relaxation",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Droplet,
      title: "24/7 Water Supply",
      description: "Uninterrupted supply of hot and cold water with RO purified drinking water stations",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: Wind,
      title: "Air Conditioned Rooms",
      description: "Climate-controlled accommodation options with individual temperature control for comfort",
      color: "from-sky-500 to-blue-500",
    },
    {
      icon: Shield,
      title: "24/7 Security",
      description: "Round-the-clock security with CCTV surveillance and secure entry systems for resident safety",
      color: "from-red-500 to-rose-500",
    },
    {
      icon: Coffee,
      title: "Cafeteria",
      description: "On-campus cafeteria serving snacks, beverages, and light meals during extended hours",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Camera,
      title: "CCTV Surveillance",
      description: "Comprehensive camera coverage in common areas ensuring safety and security",
      color: "from-slate-500 to-gray-500",
    },
    {
      icon: WashingMachine,
      title: "Laundry Service",
      description: "Modern laundry facilities with washing machines and dryers available for student use",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Activity,
      title: "Sports Facilities",
      description: "Access to outdoor courts for cricket, football, basketball, and other sports activities",
      color: "from-lime-500 to-green-500",
    },
  ];

  const roomFeatures = [
    "Comfortable single/double occupancy beds",
    "Study table and chair for each student",
    "Wardrobe and storage space",
    "Attached/common washrooms",
    "Power backup",
    "Well-ventilated rooms with natural light",
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            World-Class Facilities
          </h1>
          <p className="text-xl max-w-3xl mx-auto animate-fade-in opacity-90">
            Everything you need for comfortable living and academic success, all under one roof
          </p>
        </div>
      </section>

      {/* Main Facilities Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <Card
                key={index}
                className="group hover:shadow-large transition-all duration-300 hover:-translate-y-2 animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${facility.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <facility.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{facility.title}</h3>
                  <p className="text-muted-foreground">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Room Features Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Room Amenities
              </h2>
              <p className="text-muted-foreground text-lg">
                Each room is designed for comfort and productivity
              </p>
            </div>

            <Card className="shadow-large">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-4">
                  {roomFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-2 h-2 bg-gradient-accent rounded-full" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Experience Our Facilities</h2>
          <p className="text-xl mb-8 opacity-90">
            Visit us to see how we make student life comfortable and convenient
          </p>
        </div>
      </section>
    </div>
  );
};

export default Facilities;
