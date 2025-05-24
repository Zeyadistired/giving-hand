import { ArrowLeft, Facebook, Instagram, Linkedin, Twitter, Heart, Utensils, TrendingUp, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SocialIcon } from "@/components/ui/social-icon"

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-12">
      {/* Header with back button */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <nav className="flex gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">About Us</span>
        </nav>
      </div>

      {/* Hero section */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="relative z-10 p-8 md:p-12 flex flex-col items-start">
          <Badge className="bg-white/20 text-white hover:bg-white/30 mb-4">Our Story</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Our Mission</h1>
          <p className="text-white/90 max-w-2xl mb-6">
            We aim to bridge the gap between food surplus and hunger by connecting hotels, restaurants, and supermarkets
            with charities and shelters across Egypt. Our goal is to reduce food waste and help those in need.
          </p>
          <div className="flex gap-4 mt-2">
            <Button className="bg-white text-emerald-600 hover:bg-white/90" asChild>
              <Link to="/guest">Join Our Cause</Link>
            </Button>
            <Button variant="outline" className="border-white/80 text-white bg-white/10 hover:bg-white/20 hover:border-white" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* What We Do section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
          <span className="bg-emerald-100 p-1.5 rounded-md">
            <Heart className="h-5 w-5 text-emerald-600" />
          </span>
          What We Do
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <Utensils className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold">Food Collection</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We collect surplus food donations from hotels, restaurants, and supermarkets that would otherwise go to
                waste.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold">Distribution</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We distribute collected food to verified charities and shelters, ensuring it reaches those who need it
                most.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold">Analytics</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We provide detailed analytics and reports to our partners, helping them track their contributions and
                impact.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <Heart className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold">Community Building</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We foster a community of like-minded organizations and individuals committed to reducing food waste and
                fighting hunger.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Impact section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
          <span className="bg-emerald-100 p-1.5 rounded-md">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </span>
          Our Impact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center border-none shadow-md bg-gradient-to-b from-emerald-50 to-white">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-emerald-600 mb-2">1,482</div>
              <p className="text-sm text-muted-foreground">Meals Delivered</p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-md bg-gradient-to-b from-emerald-50 to-white">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-emerald-600 mb-2">573 KG</div>
              <p className="text-sm text-muted-foreground">Food Saved From Waste</p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-md bg-gradient-to-b from-emerald-50 to-white">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-emerald-600 mb-2">284</div>
              <p className="text-sm text-muted-foreground">Families Supported</p>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-center text-muted-foreground italic">
          *We'll update these stats as our impact grows!
        </p>
      </section>

      {/* Social media and contact */}
      <section className="border-t pt-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info and Social Media */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Connect With Us</h3>
              <p className="text-sm text-muted-foreground mb-4">Follow our journey and join the conversation</p>

              <div className="flex gap-4 mb-6">
                <SocialIcon platform="facebook" icon={Facebook} />
                <SocialIcon platform="instagram" icon={Instagram} />
                <SocialIcon platform="linkedin" icon={Linkedin} />
                <SocialIcon platform="twitter" icon={Twitter} />
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Phone:</span>
                  <a href="tel:19006" className="text-emerald-600 hover:underline">19006</a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <a href="mailto:info@givinghand.org" className="text-emerald-600 hover:underline">info@givinghand.org</a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Address:</span>
                  <span>New Cairo, Egypt</span>
                </p>
              </div>
            </div>
          </div>

          {/* Location Map */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Our Location</h3>
            <div className="rounded-xl overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.072771998445!2d31.46271531511264!3d30.045361581883107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583d2c4efc5b69%3A0xa8e41d973aa09ab6!2sNew%20Cairo%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1587391103783!5m2!1sen!2seg"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Giving Hand Location in New Cairo"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}