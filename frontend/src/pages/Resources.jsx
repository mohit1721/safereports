import React from "react";

const resources = [
  {
    title: "Helpful Articles",
    links: [
      {
        title: "Understanding Whistleblower Protection",
        href: "https://www.cpacanada.ca/public-interest/Public-Policy-Government-Relations/policy-advocacy/other-policy-topics/understanding-whistleblower-protection",
      },
      {
        title: "Common Reporting Mistakes to Avoid",
        href: "https://www.247software.com/blog/10-incident-reporting-mistakes-to-avoid",
      },
      { title: "Preparing Your Report Effectively", href: "#" },
    ],
  },
  {
    title: "External Resources",
    links: [
      {
        title: "Organization 1: Whistleblower Support",
        href: "https://www.integritymatters.in/?gad_source=1&gclid=CjwKCAiAp4O8BhAkEiwAqv2UqKw_hxMUjguWKeqsT5UjDFVnmFnt1JbYPJ-69QZO7J6miTG42YBYhxoC8HIQAvD_BwE",
      },
      {
        title: "Organization 2: Legal Aid",
        href: "https://nalsa.gov.in/services/legal-aid/legal-services",
      },
      {
        title: "Organization 3: Mental Health Support",
        href: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
      },
    ],
  },
];

const ResourcesPage = () => {
  return (
    <div className="bg-black-900 text-white min-h-screen">
      <div className="container mx-auto py-16 px-6">
        <h1 className="text-3xl font-bold mb-8">Resources</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((section) => (
            <div key={section.title} className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              <ul className="list-disc pl-6">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <a href={link.href} className="text-blue-400 hover:underline">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center md:mb-10">
          <p>
            Need More Help?{" "}
            <a href="/contact" className="text-blue-400 hover:underline">
              Contact Us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
