"use client";

import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] bg-gradient-to-r from-slate-900 to-slate-800 text-white neon-bg">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] -top-20 -right-20 bg-indigo-900/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute w-[500px] h-[500px] -bottom-20 -left-20 bg-blue-900/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

        <div className="container relative mx-auto px-4 py-32">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/5 rounded-full mb-8 backdrop-blur-sm border border-white/10 neon-glow">
              <SparklesIcon className="w-5 h-5 mr-2 text-primary" />
              <span className="text-sm font-medium">About Us</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transforming Communication Through AI
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              We're on a mission to revolutionize how people interact with AI,
              making conversations more natural, intelligent, and meaningful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-muted/50 relative">
        <div className="absolute inset-0 bg-grid-gray-900/5"></div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-secondary rounded-full mb-8">
                  <SparklesIcon className="w-5 h-5 mr-2 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Our Story
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                  Building the Future of AI Communication
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Founded with a vision to make AI communication more accessible
                  and natural, we've developed a platform that combines
                  cutting-edge technology with intuitive design.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our team of experts in AI, machine learning, and user
                  experience work tirelessly to create a chat platform that
                  understands context, learns from interactions, and delivers
                  meaningful conversations.
                </p>
              </div>
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <Image
                  src="/about-image.jpg"
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-background relative">
        <div className="absolute inset-0 bg-grid-gray-900/5"></div>
        <div className="container relative mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-secondary rounded-full mb-8">
              <SparklesIcon className="w-5 h-5 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">
                Our Values
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-6 text-foreground">
              What Drives Us Forward
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our core values shape everything we do, from product development
              to customer support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Innovation",
                description:
                  "Constantly pushing the boundaries of what's possible with AI technology.",
              },
              {
                title: "User-Centric",
                description:
                  "Every feature and improvement is designed with our users in mind.",
              },
              {
                title: "Transparency",
                description:
                  "Building trust through open communication and ethical AI practices.",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-muted/50 p-8 rounded-2xl border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
