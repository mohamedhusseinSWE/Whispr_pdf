"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import {
  ArrowRight,
  Upload,
  MessageSquare,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Play,
  FileText,
  Users,
  Star,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";

function WatchDemoButton() {
  const scrollToDemo = () => {
    const demoSection = document.querySelector("#demo-section");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={scrollToDemo}
      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
    >
      <Play className="mr-2 h-5 w-5" />
      Watch Demo
    </button>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white/80 backdrop-blur-md px-7 py-2 shadow-xl transition-all hover:border-gray-300 hover:bg-white/90 hover:shadow-2xl hover:scale-105 duration-300">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-sm font-semibold text-gray-700">
            Whispr Pdf is now public!
          </p>
        </div>

        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-1000">
          Chat with your{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            documents
          </span>{" "}
          in seconds.
        </h1>

        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg animate-in slide-in-from-bottom-6 duration-1000 delay-200">
          Whispr Pdf allows you to have conversations with any PDF document.
          Simply upload your file and start asking questions right away with our
          AI-powered chat interface.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-8 duration-1000 delay-400">
          <Link
            className={buttonVariants({
              size: "lg",
              className:
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105",
            })}
            href="/dashboard"
          >
            Get started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>

          <WatchDemoButton />
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 animate-in slide-in-from-bottom-10 duration-1000 delay-600">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">10K+</div>
            <div className="text-sm text-gray-600">Documents Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">50K+</div>
            <div className="text-sm text-gray-600">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Product Preview Section */}
      <div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                  <Image
                    src="/dashboard-preview.png"
                    alt="product preview"
                    width={1364}
                    height={866}
                    quality={100}
                    className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div
        id="demo-section"
        className="mx-auto mb-32 mt-32 max-w-7xl px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            See Whispr Pdf in Action
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the power of AI-driven document conversations with our
            interactive demo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Interface */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-white/80 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/40 rounded-full"></div>
                  <div className="ml-auto">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        What are the main points discussed in this document?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        Based on the document, the main points include:
                      </p>
                      <ul className="mt-2 text-sm text-gray-600 space-y-1">
                        <li>• Financial performance analysis</li>
                        <li>• Market trend insights</li>
                        <li>• Strategic recommendations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>AI is typing...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Features */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Instant Upload
                </h3>
                <p className="text-gray-600">
                  Drop your PDF and watch as Whispr Pdf processes it in seconds,
                  making it ready for intelligent conversations.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Natural Conversations
                </h3>
                <p className="text-gray-600">
                  Ask questions in plain English and get accurate, contextual
                  answers from your documents.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-600">
                  Get instant responses powered by advanced AI that understands
                  context and meaning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl text-gray-900 sm:text-5xl">
              Start chatting in minutes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Chatting to your PDF files has never been easier than with Whispr
              Pdf.
            </p>
          </div>
        </div>

        {/* Enhanced Steps */}
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-blue-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4 transition-all duration-300 hover:border-blue-500 group">
              <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                Step 1
              </span>
              <span className="text-xl font-semibold group-hover:text-blue-900 transition-colors">
                Sign up for an account
              </span>
              <span className="mt-2 text-zinc-700">
                Either starting out with a free plan or choose our{" "}
                <Link
                  href="/pricing"
                  className="text-blue-700 underline underline-offset-2 hover:text-blue-800"
                >
                  pro plan
                </Link>
                .
              </span>
              <div className="flex items-center space-x-2 mt-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">
                  No credit card required
                </span>
              </div>
            </div>
          </li>

          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-purple-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4 transition-all duration-300 hover:border-purple-500 group">
              <span className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
                Step 2
              </span>
              <span className="text-xl font-semibold group-hover:text-purple-900 transition-colors">
                Upload your PDF file
              </span>
              <span className="mt-2 text-zinc-700">
                We&apos;ll process your file and make it ready for you to chat
                with in seconds.
              </span>
              <div className="flex items-center space-x-2 mt-3">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">
                  Secure & encrypted
                </span>
              </div>
            </div>
          </li>

          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-pink-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4 transition-all duration-300 hover:border-pink-500 group">
              <span className="text-sm font-medium text-pink-600 group-hover:text-pink-700">
                Step 3
              </span>
              <span className="text-xl font-semibold group-hover:text-pink-900 transition-colors">
                Start asking questions
              </span>
              <span className="mt-2 text-zinc-700">
                It&apos;s that simple. Try out Whispr Pdf today - it really
                takes less than a minute.
              </span>
              <div className="flex items-center space-x-2 mt-3">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">
                  Instant responses
                </span>
              </div>
            </div>
          </li>
        </ol>

        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <Image
                src="/file-upload-preview.jpg"
                alt="uploading preview"
                width={1419}
                height={732}
                quality={100}
                className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mx-auto mb-32 mt-32 max-w-4xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to know about Whispr Pdf
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              question: "How does Whispr Pdf work?",
              answer:
                "Whispr Pdf uses advanced AI to analyze your PDF documents and create a searchable knowledge base. You can then ask questions in natural language, and our AI provides accurate answers based on the content of your documents.",
            },
            {
              question: "What types of documents does Whispr Pdf support?",
              answer:
                "Currently, Whispr Pdf supports PDF documents of all types - research papers, reports, manuals, books, and more. We're working on adding support for other document formats in the future.",
            },
            {
              question: "Is my data secure?",
              answer:
                "Absolutely. We use enterprise-grade encryption to protect your documents and conversations. Your data is never shared with third parties, and you can delete your documents at any time.",
            },
            {
              question: "How accurate are the responses?",
              answer:
                "Whispr Pdf provides highly accurate responses based on the content of your documents. However, the quality depends on the clarity and structure of your original documents. We're continuously improving our AI models for better accuracy.",
            },
            {
              question: "Can I use Whispr Pdf for free?",
              answer:
                "Yes! Whispr Pdf offers a free plan that allows you to upload and chat with a limited number of documents. For unlimited usage and advanced features, you can upgrade to our Pro plan.",
            },
            {
              question: "How long does it take to process a document?",
              answer:
                "Most documents are processed within seconds. Larger or more complex documents may take up to a minute. You'll see a real-time progress indicator during processing.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    {faq.question}
                  </h3>
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <ArrowRight className="h-4 w-4 text-blue-600 transform group-open:rotate-90 transition-transform" />
                    </div>
                  </div>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mx-auto mb-32 mt-32 max-w-6xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            What our users say
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of satisfied users who love Whispr Pdf
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Research Analyst",
              content:
                "Whispr Pdf has revolutionized how I work with research papers. I can quickly find relevant information across dozens of documents in seconds.",
              rating: 5,
            },
            {
              name: "Michael Chen",
              role: "Student",
              content:
                "As a graduate student, Whispr Pdf helps me understand complex academic papers and extract key insights for my thesis research.",
              rating: 5,
            },
            {
              name: "Emily Rodriguez",
              role: "Legal Professional",
              content:
                "The ability to quickly search through legal documents and get precise answers has made my work so much more efficient.",
              rating: 5,
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                &quot;{testimonial.content}&quot;
              </p>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto mb-32 mt-32 max-w-4xl px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-16 sm:px-16 text-center">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Ready to transform your documents?
            </h2>
            <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of users who are already having intelligent
              conversations with their documents.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
