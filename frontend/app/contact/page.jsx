"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Twitter, Facebook, Linkedin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Reset success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 border-b">
          <div className="container px-4 md:px-6 space-y-10">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Get in touch with us
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
                  Have a question or need help? Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot field for spam protection */}
                  <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="name"
                      >
                        Name
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={status === 'loading'}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="subject"
                    >
                      Subject
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="subject"
                      name="subject"
                      placeholder="Enter the subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={status === 'loading'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px]"
                      id="message"
                      name="message"
                      placeholder="Enter your message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={status === 'loading'}
                    ></textarea>
                  </div>

                  {/* Status Messages */}
                  {status === 'success' && (
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500">
                      <CheckCircle className="w-5 h-5" />
                      <p className="text-sm font-medium">Message sent successfully! We'll get back to you soon.</p>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                      <AlertCircle className="w-5 h-5" />
                      <p className="text-sm font-medium">{errorMessage}</p>
                    </div>
                  )}

                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                    type="submit"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Office</h2>
              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Headquarters</p>
                    <p className="text-gray-500 dark:text-gray-400">United States (Remote)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-500 dark:text-gray-400">+1 (555) 555-5555</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-500 dark:text-gray-400">ayaanalam78670@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Follow Us</h2>
              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-4">
                  <Twitter className="h-6 w-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Twitter</p>
                    <a className="text-gray-500 hover:underline dark:text-gray-400" href="#">
                      @RuntimeRiver
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Facebook className="h-6 w-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Facebook</p>
                    <a className="text-gray-500 hover:underline dark:text-gray-400" href="#">
                      RuntimeRiver
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Linkedin className="h-6 w-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">LinkedIn</p>
                    <a className="text-gray-500 hover:underline dark:text-gray-400" href="#">
                      RuntimeRiver
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
