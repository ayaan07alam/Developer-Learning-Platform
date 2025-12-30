export const metadata = {
  title: 'About Us',
  description: 'Learn more about RuntimeRiver, where code runs free. Discover our mission, values, and the team behind our content.',
  og: {
    title: 'About Us - RuntimeRiver',
    description: 'Learn about our mission, values, and team at RuntimeRiver.',
    image: 'https://runtimeriver.dev/about-og-image.jpg',
  },
  twitter: {
    title: 'About Us - RuntimeRiver',
    description: 'Learn about our mission, values, and team at RuntimeRiver.',
    image: 'https://runtimeriver.dev/about-twitter-image.jpg',
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
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">About RuntimeRiver</h1>
                <p class="text-gray-600 dark:text-gray-400 mb-8">
                  RuntimeRiver is a leading tech tutorial website that provides high-quality, comprehensive
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
                <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  RuntimeRiver
                </div>
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
        {/* Team section removed as it contained placeholder data */}
      </main>
    </>
  )
}