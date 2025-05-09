# Supabase Setup Guide for CS Connect

## Introduction

This guide walks you through setting up Supabase for the CS Connect application. Supabase is an open-source Firebase alternative that provides a PostgreSQL database, authentication, instant APIs, and real-time subscriptions.

## Prerequisites

Before setting up Supabase for CS Connect, ensure you have:

- A [Supabase](https://supabase.com/) account
- Basic understanding of SQL and database concepts
- Access to the CS Connect codebase

## Step 1: Create a Supabase Project

1. Log in to your Supabase account at [app.supabase.com](https://app.supabase.com)
2. Click **New Project**
3. Enter a name for your project (e.g., `cs-connect`)
4. Choose a secure database password (save this in a secure location)
5. Select the region closest to your users
6. Click **Create New Project**

Wait for your project to be provisioned (this may take a few minutes).

## Step 2: Set Up Database Schema

CS Connect requires several tables for its functionality. You can set these up using the SQL Editor in Supabase.

1. Navigate to the **SQL Editor** in your Supabase dashboard
2. Create the following tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT CHECK (user_type IN ('student', 'faculty', 'admin')) NOT NULL
);

-- Careers table
CREATE TABLE careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

-- Student Profiles
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  career_id UUID REFERENCES careers(id) ON DELETE SET NULL,
  bio TEXT,
  profile_pic TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Student Module Progress
CREATE TABLE student_module_progress (
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_slug TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  PRIMARY KEY (student_id, module_slug)
);
```
### Triggers and Functions

```sql
  -- Function to handle new auth.users entries
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, user_type)
  VALUES (NEW.id, 'student');
  
  INSERT INTO public.student_profiles (id, first_name, last_name)
  VALUES (NEW.id, 'Pending', 'Setup');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


```

## Step 3: Configure Authentication

CS Connect uses Supabase's built-in authentication system:

1. Navigate to **Authentication** > **Settings** in your Supabase dashboard
2. Under **Email Auth**, ensure the following settings:
   - Enable email confirmations: ON
   - Secure email change: ON
   - Custom email templates: Use default for now (you can customize later)

3. Under **External OAuth Providers**, you can optionally set up:
   - Google
   - GitHub
   - Microsoft

4. Under **Attack Protection**, you can setup security to protect from attacks:
   - Enable Captcha Protection: ON
   - Choose Captcha Provider: (Here we used hCaptcha)
   - Captcha Secret: (You obtain this key from the Captcha provider)

## Step 4: Set Up Row Level Security (RLS)

To ensure data security, implement Row Level Security policies:

1. Navigate to **Table Editor** > **profiles**
2. Click on **Policies** tab
3. Enable RLS by toggling the switch
4. Add the following policies:

```sql
-- Enable SELECT access to own profile
CREATE POLICY "Users can read their own profile" 
ON student_profiles FOR SELECT 
USING (auth.uid() = id);

-- Allow students to update their own profile
CREATE POLICY "Allow students to update their own profile"
ON student_profiles
FOR UPDATE
USING (auth.uid() = id);

-- Allow students to insert their profile
CREATE POLICY "Allow students to insert their own profile"
ON student_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Module progress for students
CREATE POLICY "Students can manage their own module progress"
ON student_module_progress
FOR ALL USING (auth.uid() = student_id);

-- Allow public read access to profilepictures bucket
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profilepictures');
```

## Step 5: Get API Keys

To connect your CS Connect frontend to Supabase:

1. Go to **Project Settings** > **API** in your Supabase dashboard
2. Copy the following values:
   - **URL**: Your project URL
   - **anon public**: The anonymous key for public operations

## Step 6: Configure CS Connect Frontend

1. Create a `.env.local` file in the root of your CS Connect project with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

2. Restart your development server to apply the changes

## Step 7: Test the Connection

CS Connect includes a test endpoint to verify your Supabase connection:

1. Start your development server: `npm run dev`
2. Navigate to `/api/test-supabase` in your browser
3. You should see a JSON response: `{"success":true,"message":"Supabase connection successful"}`

## Database Schema Details

### 🧑‍💼 Users Table

| Column    | Type  | Description                                      |
|-----------|--------|--------------------------------------------------|
| id        | UUID   | Primary key, references `auth.users(id)`         |
| user_type | TEXT   | User role; must be `'student'`, `'faculty'`, or `'admin'` |

### 🎓 Careers Table

| Column  | Type    | Description              |
|---------|---------|--------------------------|
| id      | UUID    | Primary key              |
| name    | TEXT    | Career name              |

### 🧑‍🎓 Student Profiles Table

| Column      | Type      | Description                                      |
|-------------|-----------|--------------------------------------------------|
| id          | UUID      | Primary key, references `users(id)`             |
| first_name  | TEXT      | User's first name                               |
| last_name   | TEXT      | User's last name                                |
| career_id   | UUID      | References `careers(id)`                        |
| bio         | TEXT      | Short biography                                 |
| profile_pic | TEXT      | URL/path to profile picture                     |
| created_at  | TIMESTAMP | Record creation timestamp                       |
| updated_at  | TIMESTAMP | Record last update timestamp                    |


### 📊 Student Module Progress Table

| Column        | Type      | Description                                        |
|---------------|-----------|----------------------------------------------------|
| student_id    | UUID      | References `users(id)`                             |
| module_slug     | UUID      | References `modules(id)`                         |
| is_completed  | BOOLEAN   | Whether the student completed the module           |
| started_at    | TIMESTAMP | Timestamp of when student started the module       |
| completed_at  | TIMESTAMP | Timestamp of when a student completed module
| PRIMARY KEY   | (student_id, module_slug) | Composite key for uniqueness   
## Advanced Configuration

### Email Templates

You can customize email templates for authentication:

1. Navigate to **Authentication** > **Email Templates**
2. Customize the templates for:
   - Confirmation
   - Invitation
   - Magic Link
   - Reset Password

### Webhooks

For advanced functionality, you can set up webhooks:

1. Navigate to **Database** > **Webhooks**
2. Create webhooks for events like:
   - New user signup
   - Profile updates
   - Other database changes

## hCaptcha

Supabase provides you with the option of adding CAPTCHA to your sign-in, sign-up, and password reset forms. This keeps your website safe from bots and malicious scripts.

Before starting make sure you have an hCaptcha account and have copied the Secret key and Sitekey

1. Go to the hCaptcha website and sign up for an account. On the Welcome page, copy the Sitekey and Secret key. If you have already signed up and didn't copy this information from the Welcome page, you can get the Secret key from the Settings page and the sitkey from the Settings of the active site you have created.
2. Navigate to the Auth section of your Project Settings in the Supabase Dashboard and find the Enable CAPTCHA protection toggle under Settings > Authentication > Bot and Abuse Protection > Enable CAPTCHA protection. Select your CAPTCHA provider from the dropdown, enter your CAPTCHA Secret key, and click Save

Install @hcaptcha/react-hcaptcha in your project as a dependency.

```bash
npm install @hcaptcha/react-hcaptcha
```

Now import the HCaptcha component from the @hcaptcha/react-hcaptcha library.

```javascript
import HCaptcha from '@hcaptcha/react-hcaptcha'
```

Let's create a empty state to store our captchaToken

```javascript
const [captchaToken, setCaptchaToken] = useState()
```

Now lets add the HCaptcha component to the JSX section of our code

```javascript
<HCaptcha />
``` 

We will pass it the sitekey we copied from the hCaptcha website as a property along with a onVerify property which takes a callback function. This callback function will have a token as one of its properties. Let's set the token in the state using setCaptchaToken

```javascript
<HCaptcha  sitekey="your-sitekey"  onVerify={(token) => {    setCaptchaToken(token)  }}/>
```

Now lets use the CAPTCHA token we receive in our Supabase signUp function.

```javascript
await supabase.auth.signUp({  email,  password,  options: { captchaToken },})
```

We will also need to reset the CAPTCHA challenge after we have made a call to the function above.

Create a ref to use on our HCaptcha component.

```javascript
const captcha = useRef()
```

Let's add a ref attribute on the HCaptcha component and assign the captcha constant to it.

```javascript
<HCaptcha  ref={captcha}  sitekey="your-sitekey"  onVerify={(token) => {    setCaptchaToken(token)  }}/>
```

Reset the captcha after the signUp function is called using the following code:

```javascript
captcha.current.resetCaptcha()
```

Run the application and you should now be provided with a CAPTCHA challenge.

## Troubleshooting

### Common Issues

1. **Authentication errors**:
   - Check that your environment variables are correctly set
   - Verify that your Supabase project is active

2. **Database query errors**:
   - Check your RLS policies
   - Verify table schemas match what the application expects

3. **CORS issues**:
   - Add your frontend URL to the allowed origins in Supabase settings

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
