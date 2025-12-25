export const metadata = {
  title: 'About Us',
  description: 'Learn more about IntelForgeeks, your ultimate tech resource hub. Discover our mission, values, and the team behind our content.',
  og: {
    title: 'About Us - IntelForgeeks',
    description: 'Learn about our mission, values, and team at IntelForgeeks.',
    image: 'https://intelforgeeks.com/about-og-image.jpg',
  },
  twitter: {
    title: 'About Us - IntelForgeeks',
    description: 'Learn about our mission, values, and team at IntelForgeeks.',
    image: 'https://intelforgeeks.com/about-twitter-image.jpg',
  }
}

export default function () {
  return (
    <>
      <main class="flex-1">
        <section class="bg-gray-100 dark:bg-gray-800 py-12 md:py-20 lg:py-28">
          <div class="container mx-auto px-4 md:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">About IntelForgeeks</h1>
                <p class="text-gray-600 dark:text-gray-400 mb-8">
                  IntelForgeeks is a leading tech tutorial website that provides high-quality, comprehensive
                  tutorials on a wide range of programming languages, frameworks, and technologies.
                </p>
                <div class="flex gap-4">
                  <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2">
                    Explore Tutorials
                  </button>
                  <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2">
                    Join Community
                  </button>
                </div>
              </div>
              <div class="hidden md:block">
                <img
                  src="/placeholder.svg"
                  alt="About IntelForgeeks"
                  class="rounded-lg"
                  width="500"
                  height="400"

                />
              </div>
            </div>
          </div>
        </section>
        <section class="py-12 md:py-20 lg:py-28">
          <div class="container mx-auto px-4 md:px-6 lg:px-8">
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-8">Our Mission</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
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
                  class="w-10 h-10 mb-4 text-primary-500"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                <h3 class="text-xl font-bold mb-2">Empower Learners</h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Our mission is to empower learners of all levels to master programming and technology through
                  high-quality, accessible tutorials and resources.
                </p>
              </div>
              <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
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
                  class="w-10 h-10 mb-4 text-primary-500"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
                <h3 class="text-xl font-bold mb-2">Fuel Innovation</h3>
                <p class="text-gray-600 dark:text-gray-400">
                  We aim to fuel innovation by providing a platform for developers to learn, share, and collaborate on
                  the latest technologies and best practices.
                </p>
              </div>
              <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
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
                  class="w-10 h-10 mb-4 text-primary-500"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <h3 class="text-xl font-bold mb-2">Build Community</h3>
                <p class="text-gray-600 dark:text-gray-400">
                  At the heart of our mission is a desire to build a thriving community of learners, developers, and
                  tech enthusiasts who support and inspire one another.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section class="bg-gray-100 dark:bg-gray-800 py-12 md:py-20 lg:py-28">
          <div class="container mx-auto px-4 md:px-6 lg:px-8">
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-8">Our Team</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                <img
                  src="/placeholder.svg"
                  alt="John Doe"
                  width="96"
                  height="96"
                  class="rounded-full mb-4"

                />
                <h3 class="text-xl font-bold mb-2">John Doe</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Co-Founder &amp; CEO</p>
                <div class="flex gap-4 text-gray-600 dark:text-gray-400">
                  <a class="hover:text-primary-500" href="#">
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
                      class="w-6 h-6"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a class="hover:text-primary-500" href="#">
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
                      class="w-6 h-6"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a class="hover:text-primary-500" href="#">
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
                      class="w-6 h-6"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                <img
                  src="/placeholder.svg"
                  alt="Jane Smith"
                  width="96"
                  height="96"
                  class="rounded-full mb-4"

                />
                <h3 class="text-xl font-bold mb-2">Jane Smith</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Co-Founder &amp; CTO</p>
                <div class="flex gap-4 text-gray-600 dark:text-gray-400">
                  <a class="hover:text-primary-500" href="#">
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
                      class="w-6 h-6"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a class="hover:text-primary-500" href="#">
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
                      class="w-6 h-6"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a class="hover:text-primary-500" href="#">
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
                      class="w-6 h-6"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                <img
                  src="/placeholder.svg"
                  alt="Michael Johnson"
                  width="96"
                  height="96"
                  class="rounded-full mb-4"

                />
                <h3 class="text-xl font-bold mb-2">Michael Johnson</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Lead Instructor</p>
                <div class="flex gap-4 text-gray-600 dark:text-gray-400">
                  <a class="hover:text-primary-500" href="#">
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
                      class="w-6 h-6"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a class="hover:text-primary-500" href="#">
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
                      class="w-6 h-6"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a class="hover:text-primary-500" href="#">
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
                      class="w-6 h-6"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}