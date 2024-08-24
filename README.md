# AI-Generated Resume Website Template: A Complete Beginner's Guide

This comprehensive guide will walk you through creating your own AI-generated resume website using Next.js, React, and Supabase, from setting up your development environment to deploying your website, customizing its content, and linking it to your own domain.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting Up Your Development Environment](#setting-up-your-development-environment)
3. [Creating a Private GitHub Repository](#creating-a-private-github-repository)
4. [Cloning and Setting Up the Project](#cloning-and-setting-up-the-project)
5. [Setting Up Supabase](#setting-up-supabase)
6. [Setting Up Your Local Environment](#setting-up-your-local-environment)
7. [Customizing Your Personal Information](#customizing-your-personal-information)
8. [Testing Your Website Locally](#testing-your-website-locally)
9. [Pushing Your Code to GitHub](#pushing-your-code-to-github)
10. [Deploying to Vercel](#deploying-to-vercel)
11. [Linking Your Vercel Deployment to Your Domain](#linking-your-vercel-deployment-to-your-domain)
12. [Further Customizing Your Website](#further-customizing-your-website)
13. [Changing Your Profile Picture](#changing-your-profile-picture)
14. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, you'll need:

- A computer with internet access
- Basic familiarity with using a computer and web browsers
- Recommended: Some understanding of JavaScript, Node.js, and Git
- A domain name (for linking to your Vercel deployment)

## Setting Up Your Development Environment

1. Install Node.js:
   - Go to https://nodejs.org/
   - Download and install the LTS (Long Term Support) version for your operating system

2. Install Git:
   - Go to https://git-scm.com/
   - Download and install Git for your operating system

3. Install Visual Studio Code (VS Code):
   - Go to https://code.visualstudio.com/
   - Download and install VS Code for your operating system

## Creating a Private GitHub Repository

1. Create a GitHub account if you don't have one:
   - Go to https://github.com/
   - Click "Sign up" and follow the instructions

2. Create a new private repository:
   - Click the "+" icon in the top-right corner of GitHub
   - Select "New repository"
   - Name your repository (e.g., "my-resume-website")
   - Choose "Private" visibility
   - Do NOT check "Add a README file"
   - Click "Create repository"

3. Configure Git with your GitHub credentials (if you haven't already):
   ```
   git config --global user.name "Your Name"
   git config --global user.email "your-email@example.com"
   ```

## Cloning and Setting Up the Project

1. Open your terminal or command prompt

2. Navigate to where you want to store your project:
   ```
   cd path/to/your/projects/folder
   ```

3. Clone the template repository:
   ```
   git clone https://github.com/Blacksuite/Resume-website-template.git my-resume-website
   ```

4. Navigate to the cloned directory:
   ```
   cd my-resume-website
   ```

5. Remove the existing Git history:
   ```
   rm -rf .git
   ```

6. Initialize a new Git repository:
   ```
   git init
   ```

7. Add your private GitHub repository as the remote:
   ```
   git remote add origin https://github.com/your-username/my-resume-website.git
   ```

8. Stage all files:
   ```
   git add .
   ```

9. Commit the files:
   ```
   git commit -m "Initial commit"
   ```

10. Push to your private repository:
    ```
    git push -u origin main
    ```

## Setting Up Supabase

1. Create a Supabase account:
   - Go to https://supabase.com/
   - Click "Start your project" and sign up

2. Create a new Supabase project:
   - Click "New project"
   - Give your project a name
   - Set a secure database password
   - Choose a region close to you
   - Click "Create new project"

3. Once your project is ready, go to the SQL Editor in your Supabase dashboard

4. Copy and paste the following SQL code into the SQL Editor:

```sql
-- Create experiences table
CREATE TABLE experiences (
    id SERIAL PRIMARY KEY,
    title JSONB NOT NULL,
    company JSONB NOT NULL,
    period JSONB NOT NULL,
    description JSONB NOT NULL,
    order_index INTEGER NOT NULL
);

-- Create content table
CREATE TABLE content (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL,
    language TEXT NOT NULL,
    value TEXT NOT NULL,
    UNIQUE (key, language)
);

-- Create contact_info table
CREATE TABLE contact_info (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    value TEXT NOT NULL,
    label TEXT NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow read access to all users
CREATE POLICY "Allow read access for all users" ON experiences FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON content FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON contact_info FOR SELECT USING (true);

-- Create a policy to allow write access only to authenticated users
CREATE POLICY "Allow write access for authenticated users" ON experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for authenticated users" ON content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for authenticated users" ON contact_info FOR ALL USING (auth.role() = 'authenticated');

-- Insert example data into experiences table
INSERT INTO experiences (title, company, period, description, order_index) VALUES
(
    '{"en": "Example Position 1", "nl": "Voorbeeld Functie 1"}',
    '{"en": "Example Company A", "nl": "Voorbeeldbedrijf A"}',
    '{"en": "Jan 2022 - Present", "nl": "Jan 2022 - Heden"}',
    '{"en": "This is an example job description for the first position. It demonstrates how job details would appear on the resume.", "nl": "Dit is een voorbeeldfunctieomschrijving voor de eerste positie. Het laat zien hoe functiedetails op het cv zouden verschijnen."}',
    1
),
(
    '{"en": "Example Position 2", "nl": "Voorbeeld Functie 2"}',
    '{"en": "Example Company B", "nl": "Voorbeeldbedrijf B"}',
    '{"en": "Jun 2020 - Dec 2021", "nl": "Jun 2020 - Dec 2021"}',
    '{"en": "This is an example job description for the second position. It shows how multiple job experiences are displayed.", "nl": "Dit is een voorbeeldfunctieomschrijving voor de tweede positie. Het toont hoe meerdere werkervaringen worden weergegeven."}',
    2
);

-- Insert example data into content table
INSERT INTO content (key, language, value) VALUES
('intro', 'en', 'Welcome to my resume! This is an example introduction text that showcases how the personal summary would appear on the page. It can be customized to highlight key skills, career objectives, or any other relevant information.'),
('intro', 'nl', 'Welkom bij mijn cv! Dit is een voorbeeldintroductietekst die laat zien hoe de persoonlijke samenvatting op de pagina zou verschijnen. Het kan worden aangepast om belangrijke vaardigheden, carrièredoelen of andere relevante informatie te benadrukken.'),
('experience', 'en', 'Experience'),
('experience', 'nl', 'Ervaring'),
('contact', 'en', 'Contact'),
('contact', 'nl', 'Contact');

-- Insert example data into contact_info table
INSERT INTO contact_info (type, value, label) VALUES
('phone', '123-456-7890', 'Phone'),
('email', 'example@email.com', 'Email'),
('calendly', 'https://calendly.com/example', 'Schedule a call'),
('linkedin', 'https://www.linkedin.com/in/example', 'LinkedIn');
```

5. Click "Run" to execute the SQL and create the tables and policies. You should see a success message indicating that the queries were executed successfully.

6. Set up authentication:
   - Go to Authentication → Providers in your Supabase dashboard
   - Enable Email/Password authentication
   - If you want to add Google or GitHub authentication:
     - For Google: Go to the Google Cloud Console, create a new project, enable the Google+ API, and create OAuth 2.0 credentials. Add these credentials to Supabase.
     - For GitHub: Go to GitHub Developer Settings, create a new OAuth App, and add the client ID and secret to Supabase.

## Setting Up Your Local Environment

1. In your Supabase project settings, find your project URL and anon key:
   - Go to Settings → API in your Supabase dashboard
   - You'll find the Project URL and anon public API key here

2. Open your project in VS Code:
   - Open VS Code
   - Go to File → Open Folder
   - Select your `my-resume-website` folder

3. Create a new file named `.env.local` in the root directory of your project

4. Add the following content to `.env.local`, replacing the placeholders with your actual Supabase URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Customizing Your Personal Information

1. Open the file `src/app/page.tsx` in your project (located in the `my-resume-website/src/app` directory)

2. Find the `currentContent` object (around line 70):

```typescript
const currentContent = {
  title: "John Doe",
  subtitle: "Sales Professional",
  intro: content.intro?.[language] || '',
  experience: content.experience?.[language] || (language === 'nl' ? "Ervaring" : "Experience"),
  personalCharacteristics: language === 'nl' ? "Persoonlijke kenmerken" : "Personal Characteristics",
  languages: language === 'nl' ? "Talen" : "Languages",
  contact: content.contact?.[language] || (language === 'nl' ? "Contact" : "Contact"),
  characteristicsList: language === 'nl' ? ["Kenmerk 1", "Kenmerk 2", "Kenmerk 3"] : ["Characteristic 1", "Characteristic 2", "Characteristic 3"],
  languagesList: language === 'nl' ? ["Nederlands", "Engels"] : ["Dutch", "English"]
};
```

3. Update the following properties:
   - `title`: Change "John Doe" to your name
   - `subtitle`: Change "Sales Professional" to your profession
   - `characteristicsList`: Update both the Dutch and English versions with your personal characteristics
   - `languagesList`: Update both the Dutch and English versions with the languages you speak

   Note: Some values like `content.intro?.[language]` are dynamically retrieved from the Supabase database based on the selected language. You can modify these values directly in the Supabase database, which will be reflected on the site.

4. Save the file

5. Open the file `src/app/layout.tsx`

6. Update the `metadata` object with your name and profession:

```typescript
export const metadata = {
  title: 'Your Name - Resume',
  description: 'Professional resume of Your Name, Your Profession',
};
```

7. Save the file

## Testing Your Website Locally

1. Open a terminal in VS Code:
   - Go to Terminal → New Terminal

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open a web browser and go to [http://localhost:3000](http://localhost:3000)

5. You should see your resume website with your updated information

6. To test the admin panel, go to [http://localhost:3000/admin](http://localhost:3000/admin) and log in using the authentication method you set up in Supabase. If you're using Email/Password authentication, you'll need to create an account first using the sign-up option.

## Pushing Your Code to GitHub

1. Stage your changes:
   ```
   git add .
   ```

2. Commit your changes:
   ```
   git commit -m "Updated personal information"
   ```

3. Push to GitHub:
   ```
   git push origin main
   ```

## Deploying to Vercel

1. Create a Vercel account at https://vercel.com/

2. Click "Add New Project" on your Vercel dashboard

3. Choose "Import Git Repository"

4. Select your private GitHub repository (`my-resume-website`)

5. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next

6. Add environment variables:
   - Go to Settings → Environment Variables in your Vercel project
   - Add the following variables:
     - NEXT_PUBLIC_SUPABASE_URL
     - NEXT_PUBLIC_SUPABASE_ANON_KEY
   (Use the values from your Supabase project, found under Settings → API)

7. Click "Deploy"

Vercel will now deploy your site and provide you with a URL. It will automatically redeploy whenever you push changes to your GitHub repository.

## Linking Your Vercel Deployment to Your Domain

1. Purchase a domain name from a domain registrar (e.g., GoDaddy, Namecheap, Google Domains)

2. In your Vercel dashboard, go to your project settings

3. Click on the "Domains" tab

4. Enter your domain name in the "Add Domain" field and click "Add"

5. Vercel will provide you with DNS records to add to your domain registrar:
   - Usually, this involves adding an A record pointing to Vercel's IP address
   - You might also need to add a CNAME record for the www subdomain

6. Go to your domain registrar's DNS settings and add the records provided by Vercel

7. Wait for the DNS changes to propagate (this can take up to 48 hours, but often happens much faster)

8. Once Vercel confirms your domain is correctly set up, your website will be accessible at your custom domain

Your resume website is now publicly accessible at your custom domain without requiring users to sign in to Vercel.

## Further Customizing Your Website

1. Edit content through the admin panel:
   - Go to your website's `/admin` route (e.g., `https://your-domain.com/admin`)
   - Log in using the authentication method you set up in Supabase
   - Use the interface to update content

   The admin panel is connected to your Supabase database. Changes made here will update the corresponding tables in Supabase, which are then reflected on the frontend.

2. Modify the design:
   - Open `src/app/page.tsx` in VS Code
   - Update the JSX and CSS classes to change the layout and styling

3. Add new features:
   - Create new components in the `src/components` directory
   - Update `src/app/page.tsx` to include these new components

4. Extend functionality:
   - Refer to the [Supabase API documentation](https://supabase.io/docs/guides/api) to learn how to add new content types or manage roles and permissions

## Changing Your Profile Picture

1. Prepare your new profile picture:
   - Choose a square image for best results
   - Resize the image to 150x150 pixels
   - Save the image as a JPG or PNG file

2. Replace the existing profile picture:
   - In your project folder, navigate to the `public` directory
   - Replace the existing `profile.jpg` with your new image
   - Make sure the new image is also named `profile.jpg` (or update the image source in the code if using a different file name)

3. If you changed the file name or want to adjust the image size:
   - Open `src/app/page.tsx` in VS Code
   - Find the `Image` component in the JSX
   - Update the `src`, `width`, and `height` props as needed:

   ```jsx
   <Image
     src="/your-new-image-name.jpg"
     alt="Your Name"
     width={150}
     height={150}
     className="rounded-full border-4 border-white shadow-lg"
   />
   ```

4. Save the changes, commit, and push to GitHub:
   ```
   git add .
   git commit -m "Updated profile picture"
   git push origin main
   ```

5. Vercel will automatically redeploy your site with the new image.

## Troubleshooting

If you encounter issues:

1. Check your `.env.local` file and Vercel environment variables:
   - Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct and match your Supabase project settings

2. Verify Supabase connection:
   - Open your Supabase project
   - Go to Settings → API
   - Confirm the Project URL and anon public API key match your `.env.local` and Vercel environment variables

3. Check Vercel deployment:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Deployments
   - Check the most recent deployment for any error messages
   - You can use the `vercel logs` command in your terminal to view deployment logs

4. Clear your browser cache or try in an incognito window

5. If you're having issues with your custom domain:
   - Double-check the DNS settings at your domain registrar
   - Ensure the records match exactly what Vercel provided
   - Use a tool like [whatsmydns.net](https://www.whatsmydns.net/) to check if your DNS changes have propagated

6. For local development issues:
   - Ensure all dependencies are installed: `npm install`
   - Try deleting the `.next` folder and rebuilding: `rm -rf .next && npm run build`

7. If you're experiencing database-related issues:
   - Check your Supabase dashboard for any error messages or warnings
   - Ensure your IP address isn't blocked if you've set up IP restrictions
   - Verify that your RLS policies are correctly set up

8. For authentication problems:
   - Confirm that you've properly set up the authentication providers in Supabase
   - Check that your OAuth credentials (if using Google or GitHub) are correct

If problems persist, you may need to:

1. Review the error messages in your browser's console (F12 to open developer tools)
2. Check the server-side logs in your Vercel deployment
3. Consult the documentation for [Next.js](https://nextjs.org/docs), [React](https://reactjs.org/docs), and [Supabase](https://supabase.io/docs)

## Maintaining Your Website

1. Regularly update your content:
   - Use the admin panel to keep your resume information current
   - Add new experiences or skills as you acquire them

2. Keep your dependencies up-to-date:
   - Periodically run `npm update` to update your project dependencies
   - Be aware of major version changes that might require code updates

3. Monitor your Vercel and Supabase usage:
   - Keep an eye on your usage limits, especially if you're on free tiers
   - Upgrade your plans if necessary as your needs grow

4. Backup your data:
   - Regularly export your Supabase database as a backup
   - Keep your GitHub repository up-to-date as an additional backup of your code

5. Stay informed about security updates:
   - Keep an eye on security announcements for Next.js, React, and Supabase
   - Apply security patches promptly

## Conclusion

Congratulations! You now have a fully functional, customizable resume website deployed to your own domain. This setup allows you to easily update your professional information and share it with potential employers or clients.

Remember to keep your Supabase and Vercel credentials secure, and never commit sensitive information to your GitHub repository. Regularly update your site to reflect your growing skills and experiences.

As you become more comfortable with the technologies used in this project, consider adding more features or customizing the design further to make your resume stand out.

Good luck with your professional endeavors!