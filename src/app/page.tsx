"use client";

import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  BoltIcon,
  ArrowDownIcon,
  BeakerIcon,
  UserGroupIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const ChatMessage = ({
  isAI = false,
  delay = 0,
  title = "",
  message = "",
  emoji = "",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`flex ${isAI ? "flex-row" : "flex-row-reverse"} gap-4 mb-4`}
  >
    <div className={`max-w-[80%] ${isAI ? "text-left" : "text-right"}`}>
      <div
        className={`p-4 rounded-3xl ${
          isAI
            ? "bg-[#0c0f1a] text-gray-200 border border-gray-800"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {title && (
          <div className="text-sm font-medium mb-1 text-gray-400">{title}</div>
        )}
        <div className="text-base">
          {message}
          {emoji && <span className="ml-1">{emoji}</span>}
        </div>
      </div>
    </div>
  </motion.div>
);

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-r from-slate-900 to-slate-800 text-white neon-bg">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] -top-20 -right-20 bg-indigo-900/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute w-[500px] h-[500px] -bottom-20 -left-20 bg-blue-900/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute w-[500px] h-[500px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

        <div className="container relative mx-auto px-4 py-32">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div
              className="flex-1 text-center md:text-left z-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/5 rounded-full mb-8 backdrop-blur-sm border border-white/10 neon-glow">
                <SparklesIcon className="w-5 h-5 mr-2 text-primary" />
                <span className="text-sm font-medium">
                  AI-Powered Chat Platform
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span>Experience</span>{" "}
                <span className="text-primary">AI-Powered</span>{" "}
                <span>Conversations</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Transform your communication with intelligent, context-aware
                chat experiences
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative overflow-hidden px-8 py-4 rounded-full font-semibold bg-background text-foreground shadow-lg"
                >
                  <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/80 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                  <Link href="/chat" className="absolute inset-0 z-10" />
                  <span className="relative group-hover:text-primary-foreground transition-colors duration-200">
                    Get Started
                  </span>
                </motion.button>
              </div>
            </motion.div>

            {/* Chat Interface Preview */}
            <motion.div
              className="flex-1 perspective-1000"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative w-full h-[500px] transform rotate-y-[-8deg] rotate-z-2">
                <div className="absolute inset-0 bg-[#0f1219]/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-sm text-gray-400">
                        AI Chat Interface
                      </div>
                    </div>
                    <div className="space-y-6">
                      <ChatMessage
                        isAI
                        delay={0.2}
                        title="Thêm chi phí"
                        message="Bạn đã tiêu 595k cho việc ăn nhà hàng. Chúc bạn ăn ngon miệng, nhưng hãy cẩn thận với chi phí nhé!"
                        emoji="🍔"
                      />
                      <ChatMessage
                        isAI={false}
                        delay={0.4}
                        message="500k tiền thưởng"
                      />
                      <ChatMessage
                        isAI
                        delay={0.6}
                        title="Thêm thu nhập"
                        message="Đã thêm 500k từ tiền thưởng vào tài khoản của bạn. Tốt hơn hết là bạn nên cẩn nhắc kỹ lương trước khi tiêu xài nhé, đừng để tháng sau lại đốm!"
                        emoji="🤑"
                      />
                      <ChatMessage isAI={false} delay={0.8} message="hehe" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDownIcon className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-muted/50 relative">
        <div className="absolute inset-0 bg-grid-gray-900/5"></div>
        <div className="container relative mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-secondary rounded-full mb-8">
              <SparklesIcon className="w-5 h-5 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Revolutionizing Communication
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              AI Chat combines cutting-edge artificial intelligence with
              intuitive design to create a communication platform that adapts to
              your needs. Experience conversations that are more meaningful,
              efficient, and intelligent.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <motion.div
                className="group relative p-8 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/50 rounded-2xl transform transition-transform group-hover:scale-95"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110">
                    <BeakerIcon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    Advanced AI
                  </h3>
                  <p className="text-muted-foreground">
                    Powered by state-of-the-art language models
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="group relative p-8 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/50 rounded-2xl transform transition-transform group-hover:scale-95"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110">
                    <UserGroupIcon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    Human-Centric
                  </h3>
                  <p className="text-muted-foreground">
                    Designed for natural, flowing conversations
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="group relative p-8 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/50 rounded-2xl transform transition-transform group-hover:scale-95"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110">
                    <BoltIcon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    Lightning Fast
                  </h3>
                  <p className="text-muted-foreground">
                    Real-time responses with minimal latency
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-900/5"></div>
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-secondary rounded-full mb-8">
              <SparklesIcon className="w-5 h-5 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">Features</span>
            </div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Powerful Features
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              className="group p-8 bg-card rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                Smart Conversations
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI understands context, learns from interactions, and
                provides intelligent responses that feel natural and meaningful.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="group p-8 bg-card rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110">
                <ShieldCheckIcon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                Enterprise Security
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Bank-grade encryption, advanced privacy controls, and compliance
                with global security standards keep your data safe.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="group p-8 bg-card rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110">
                <BoltIcon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Experience real-time responses powered by our optimized
                infrastructure and advanced AI processing capabilities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
