export const metadata = {
  title:'Contact Us',
  description: 'Reach out to us at IntelForgeeks for inquiries, support, or feedback. Find all the ways you can contact our team here.',
  og: {
    title: 'Contact Us - IntelForgeeks',
    description: 'Get in touch with us for any inquiries, support, or feedback.',
    image: 'https://IntelForgeeks/contact-og-image.jpg',
  },
  twitter: {
    title: 'Contact Us - IntelForgeeks',
    description: 'Get in touch with us for any inquiries, support, or feedback.',
    image: 'https://IntelForgeeks/contact-twitter-image.jpg',
  }
}

export default function(){
    return (
       <>
       <div class="flex flex-col min-h-[100dvh]">
  <main class="flex-1">
    <section class="w-full py-12 md:py-24 lg:py-32 border-b">
      <div class="container px-4 md:px-6 space-y-10">
        <div class="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
          <div>
            <h1 class="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
              Get in touch with us
            </h1>
            <p class="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Have a question or need help? Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
          <div class="space-y-4">
            <form class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    for="name"
                  >
                    Name
                  </label>
                  <input
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="name"
                    placeholder="Enter your name"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    for="email"
                  >
                    Email
                  </label>
                  <input
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  for="subject"
                >
                  Subject
                </label>
                <input
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="subject"
                  placeholder="Enter the subject"
                />
              </div>
              <div class="space-y-2">
                <label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  for="message"
                >
                  Message
                </label>
                <textarea
                  class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px]"
                  id="message"
                  placeholder="Enter your message"
                ></textarea>
              </div>
              <button
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                type="submit"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
    <section class="w-full py-12 md:py-24 lg:py-32">
      <div class="container px-4 md:px-6 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl">Our Office</h2>
          <div class="space-y-4 mt-6">
            <div class="flex items-start gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-6 w-6 text-gray-500 dark:text-gray-400"
              >
                <line x1="2" x2="5" y1="12" y2="12"></line>
                <line x1="19" x2="22" y1="12" y2="12"></line>
                <line x1="12" x2="12" y1="2" y2="5"></line>
                <line x1="12" x2="12" y1="19" y2="22"></line>
                <circle cx="12" cy="12" r="7"></circle>
              </svg>
              <div>
                <p class="font-medium">Headquarters</p>
                <p class="text-gray-500 dark:text-gray-400">123 Main St, Anytown USA</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-6 w-6 text-gray-500 dark:text-gray-400"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <div>
                <p class="font-medium">Phone</p>
                <p class="text-gray-500 dark:text-gray-400">+1 (555) 555-5555</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-6 w-6 text-gray-500 dark:text-gray-400"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <div>
                <p class="font-medium">Email</p>
                <p class="text-gray-500 dark:text-gray-400">support@IntelForgeeks</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl">Follow Us</h2>
          <div class="space-y-4 mt-6">
            <div class="flex items-start gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-6 w-6 text-gray-500 dark:text-gray-400"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
              <div>
                <p class="font-medium">Twitter</p>
                <a class="text-gray-500 hover:underline dark:text-gray-400" href="#">
                  @IntelForgeeks
                </a>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-6 w-6 text-gray-500 dark:text-gray-400"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              <div>
                <p class="font-medium">Facebook</p>
                <a class="text-gray-500 hover:underline dark:text-gray-400" href="#">
                  IntelForgeeks
                </a>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-6 w-6 text-gray-500 dark:text-gray-400"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              <div>
                <p class="font-medium">LinkedIn</p>
                <a class="text-gray-500 hover:underline dark:text-gray-400" href="#">
                  IntelForgeeks
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</div>
       
       </>
    )
}
