import { CurriculumStep } from '../types';

export const CURRICULUM_STEPS: CurriculumStep[] = [
  {
    stepNumber: 1,
    title: 'Introduction to Full Stack Architecture',
    topic: 'What is Full Stack? Client vs Server vs External API',
    summary: 'Understand why we decouple frontend React from backend Node/Express and external weather services.',
    theory: `Full Stack Web Development encompasses both client-side (frontend) and server-side (backend) engineering.

1. **Frontend (Client)**: Runs in the browser (React + Vite). Handles user interface, interactions, user input, and visual rendering.
2. **Backend (Server)**: Runs on the host machine/cloud container (Node.js + Express). Manages API proxying, business logic, security, response transformation, and rate limiting.
3. **External API (Open-Meteo)**: Third-party web service providing raw meteorological calculations via REST endpoints over HTTP.

**Why Separate Frontend and Backend?**
- **Security**: Protects secret tokens, API keys, and internal logic from browser tampering.
- **Data Abstraction**: Converts complex 5,000-line raw meteorological arrays into clean, structured JSON formatted specifically for our UI.
- **CORS & Rate Limiting**: Avoids browser Cross-Origin Resource Sharing restrictions and allows caching requests on the server to prevent exceeding API limits.`,
    diagram: `
+-----------------------------------------------------------------------------------+
|                                REQUEST - RESPONSE LIFECYCLE                         |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ User Browser ]                                                                 |
|   (React + Vite)  ---(1) HTTP GET /api/weather?city=London---> [ Express Server ] |
|         ^                                                           (Node.js)     |
|         |                                                              |          |
|         |                                                             (2)         |
|         |                                                        HTTP GET Geocode |
|         |                                                           & Forecast    |
|         |                                                              v          |
|         |                                                       [ Open-Meteo API ]|
|         |                                                           (External)    |
|         |                                                              |          |
|         |                                                             (3)         |
|         |                                                        Raw JSON Data    |
|         |                                                              |          |
|         +-------------(4) Clean Structured JSON <----------------------+          |
|                                                                                   |
+-----------------------------------------------------------------------------------+
`,
    codeSnippet: `// server.ts - Express Route Handler
app.get('/api/weather', async (req: Request, res: Response) => {
  const city = req.query.city as string; // Extract query param
  const geoRes = await fetch(\`https://geocoding-api.open-meteo.com/v1/search?name=\${city}\`);
  const geoData = await geoRes.json();
  const { latitude, longitude } = geoData.results[0];
  
  const weatherRes = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${latitude}&longitude=\${longitude}&current=temperature_2m,relative_humidity_2m\`);
  const weatherData = await weatherRes.json();
  
  res.json({ city, temp: weatherData.current.temperature_2m });
});`,
    lineByLine: [
      'Line 1: Express route GET /api/weather listening for client HTTP requests.',
      'Line 2: Extracts the "city" parameter from query string (e.g., ?city=London).',
      'Line 3: Asynchronously fetches latitude and longitude from Open-Meteo Geocoding API.',
      'Line 4: Parses geocoding HTTP response string into a native JavaScript object via .json().',
      'Line 5: Destructures latitude and longitude coordinates from top match result.',
      'Line 7: Fetches current forecast metrics using coordinates from Open-Meteo API.',
      'Line 8: Parses weather JSON response payload.',
      'Line 10: Sends clean custom JSON back to React frontend client.'
    ],
    interviewQuestions: [
      {
        q: 'Why should you never call external APIs with secret keys directly from the browser?',
        a: 'Any key used in client-side code is exposed in network dev tools and source code bundles, allowing attackers to steal your credentials.'
      },
      {
        q: 'What is CORS and how does a backend proxy solve it?',
        a: 'Cross-Origin Resource Sharing is a browser security mechanism blocking requests between different origins. A backend proxy fetches data server-to-server where CORS rules do not apply.'
      }
    ],
    quiz: {
      question: 'Which tier in our full stack architecture is responsible for transforming raw weather data into activity recommendations?',
      options: [
        'Browser DOM',
        'Express Backend Server',
        'Open-Meteo Database',
        'Vite Asset Bundler'
      ],
      correctIndex: 1,
      explanation: 'The Express server processes raw meteorological parameters and applies business decision logic to generate actionable activity recommendations.'
    },
    exercise: 'Identify three reasons why Open-Meteo is an ideal API choice for beginners (Hint: No API key requirement, generous free tier, WMO weather codes).',
    bestPractices: [
      'Keep API credentials server-side in environment variables (.env).',
      'Always catch network errors gracefully on both server and client.',
      'Transform external payloads into consistent domain models before returning to UI.'
    ]
  },
  {
    stepNumber: 2,
    title: 'Monorepo Project Architecture & Directory Structure',
    topic: 'Organizing Client and Server code bases',
    summary: 'Learn clean separation of concerns in full-stack projects.',
    theory: `Professional full-stack applications structure code so that frontend components, API endpoints, backend logic, and static assets remain decoupled.

In standard Node environments:
- **Client**: '/src/components', '/src/hooks', '/src/pages'
- **Server**: '/server.ts' or '/src/server/'
- **Shared Types**: '/src/types.ts'

This prevents accidental leaking of backend Node code into Vite client builds.`,
    diagram: `
weather-intelligence-app/
├── package.json          <-- Root scripts & unified dependencies
├── server.ts             <-- Express server entry point (Node.js)
├── vite.config.ts        <-- Vite build & dev proxy configuration
├── index.html            <-- Single Page Application (SPA) HTML template
└── src/
    ├── main.tsx          <-- React DOM mounting entry point
    ├── App.tsx           <-- Top-level UI layout & state context
    ├── types.ts          <-- TypeScript interfaces (Location, Forecast, Recommendation)
    ├── components/       <-- Modular UI widgets (Header, SearchBar, ForecastCard)
    └── data/             <-- Static datasets & curriculum content
`,
    codeSnippet: `// vite.config.ts - Development setup for full-stack SPA
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});`,
    lineByLine: [
      'Line 1: Imports Vite configuration helpers and React/Tailwind plugins.',
      'Line 2: Configures plugins for JSX compilation and Tailwind CSS v4 styling.',
      'Line 3: Sets local development dev server binding to host 0.0.0.0 and port 3000.'
    ],
    interviewQuestions: [
      {
        q: 'What is the purpose of package.json in a Node project?',
        a: 'It acts as the project manifest, declaring dependencies, scripts, author metadata, and package module formats.'
      }
    ],
    quiz: {
      question: 'Where should shared TypeScript interfaces like WeatherData reside?',
      options: [
        'Inside node_modules/',
        'In a shared types module like /src/types.ts',
        'Inside inline script tags in index.html',
        'Only in server.ts'
      ],
      correctIndex: 1,
      explanation: 'Centralizing types in /src/types.ts allows both client components and server code to share identical type contracts.'
    },
    exercise: 'Examine package.json and verify which dependencies handle HTTP routing vs UI rendering.',
    bestPractices: [
      'Group files by feature or domain responsibility.',
      'Never put backend secret files inside /public or frontend build outputs.'
    ]
  },
  {
    stepNumber: 3,
    title: 'Initializing React with Vite & Module Bundling',
    topic: 'Vite vs Webpack, JSX, Virtual DOM, and ES Modules',
    summary: 'Master modern frontend tooling and rapid HMR (Hot Module Replacement).',
    theory: `Vite (French for "fast") leverages native browser ES Modules (ESM) during development, eliminating slow Webpack bundling steps.

Key Concepts:
- **Virtual DOM**: React keeps an in-memory representation of UI tree and performs efficient diffing before updating actual DOM.
- **JSX/TSX**: Syntax extension combining HTML structural layout directly inside JavaScript functions.
- **Entry Flow**: \`index.html\` -> \`src/main.tsx\` -> \`createRoot()\` -> \`App.tsx\`.`,
    diagram: `
+------------------------------------------------------------------------+
|                          VITE MODULE RESOLUTION                        |
+------------------------------------------------------------------------+
|                                                                        |
|  [ index.html ]                                                        |
|        |                                                               |
|        v                                                               |
|  <script type="module" src="/src/main.tsx"></script>                  |
|        |                                                               |
|        v                                                               |
|  [ src/main.tsx ] ---> createRoot(document.getElementById('root'))     |
|        |                                                               |
|        v                                                               |
|  [ src/App.tsx ]  ---> Renders Weather Intel UI inside React DOM Tree  |
|                                                                        |
+------------------------------------------------------------------------+
`,
    codeSnippet: `// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
    lineByLine: [
      'Line 1: Imports StrictMode wrapper to catch developer side-effects during dev.',
      'Line 2: Imports createRoot function from react-dom/client (React 18+ API).',
      'Line 3: Imports root App component containing our dashboard.',
      'Line 4: Imports global Tailwind CSS styles.',
      'Line 6: Locates <div id="root"> element in index.html and attaches React Fiber root node.',
      'Line 7-9: Renders App component inside StrictMode container.'
    ],
    interviewQuestions: [
      {
        q: 'Why is Vite faster than traditional Webpack dev servers?',
        a: 'Vite serves code as native ES modules over HTTP, compiling files on-demand rather than pre-bundling the entire application on startup.'
      }
    ],
    quiz: {
      question: 'What is the entry point element in index.html where React attaches the UI tree?',
      options: ['<app></app>', '<div id="root"></div>', '<main></main>', '<body></body>'],
      correctIndex: 1,
      explanation: 'createRoot searches for document.getElementById("root") and mounts the entire Virtual DOM tree into it.'
    },
    exercise: 'Explain what happens if document.getElementById("root") is missing in index.html.',
    bestPractices: [
      'Use React 18+ createRoot instead of deprecated ReactDOM.render.',
      'Keep index.html minimal and let React components handle dynamic DOM generation.'
    ]
  },
  {
    stepNumber: 4,
    title: 'Building Express Middleware & API Proxy Routes',
    topic: 'Express app instance, Middleware pipeline, Route Handlers',
    summary: 'Build robust REST HTTP endpoints using Express.js.',
    theory: `Express is a minimal Node.js web application framework providing a pipeline of middleware functions.

- **Middleware**: Functions that execute in order, receiving \`req\` (Request), \`res\` (Response), and \`next\` callback.
- **JSON Parser**: \`app.use(express.json())\` parses incoming HTTP request body strings into JavaScript objects.
- **Route Handlers**: \`app.get('/api/weather', handler)\` maps HTTP verbs and URL paths to business functions.`,
    diagram: `
Incoming HTTP Request ---> [ Express.js Pipeline ]
                                  |
                                  v
                       [ express.json() Middleware ]
                                  |
                                  v
                       [ Route: /api/geocode ]
                                  |
                                  v
                       [ Route: /api/weather ]
                                  |
                                  v
Outgoing HTTP Response <--- [ res.json(data) ]
`,
    codeSnippet: `// Express Middleware & API Endpoint Setup
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});`,
    lineByLine: [
      'Line 1: Imports express library and TypeScript Request/Response types.',
      'Line 3: Creates Express application server instance.',
      'Line 4: Attaches global JSON body parsing middleware.',
      'Line 6: Registers GET endpoint /api/health for heartbeat monitoring.',
      'Line 7: Responds with JSON payload containing status and ISO timestamp.'
    ],
    interviewQuestions: [
      {
        q: 'What is middleware in Express.js?',
        a: 'A function that has access to request, response, and next functions, capable of executing code, modifying req/res objects, or ending the request-response cycle.'
      }
    ],
    quiz: {
      question: 'What method is used in Express to send a JSON response with status 200?',
      options: ['res.sendText()', 'res.json()', 'res.write()', 'res.finish()'],
      correctIndex: 1,
      explanation: 'res.json() automatically serializes a JavaScript object into a JSON string and sets content-type to application/json.'
    },
    exercise: 'Write an Express middleware that logs the incoming request HTTP method and URL to console.',
    bestPractices: [
      'Always set explicit HTTP error status codes (400 for bad input, 404 for not found, 500 for server crash).',
      'Mount custom API routes BEFORE static fallback or Vite middlewares.'
    ]
  },
  {
    stepNumber: 5,
    title: 'Server Ports, Localhost & Full Stack Communication',
    topic: 'How client and server communicate over HTTP on port 3000',
    summary: 'Understand network ports, IP binding, and Vite dev server integration.',
    theory: `When building full-stack applications locally or in cloud containers:
- **Host**: \`0.0.0.0\` binds to all network interfaces, making the application accessible inside sandboxed containers.
- **Port**: \`3000\` is the default single externally exposed port.
- **Vite Integration**: Express runs on port 3000 and uses \`createViteServer()\` in dev mode as middleware so React HMR and Express API routes share the exact same port!`,
    diagram: `
+--------------------------------------------------------------------+
|               SINGLE PORT 3000 REVERSE PROXY ARCHITECTURE           |
+--------------------------------------------------------------------+
|                                                                    |
|                      [ Browser / Client ]                          |
|                                |                                   |
|                          Port 3000 HTTP                            |
|                                v                                   |
|                   [ Express Server (server.ts) ]                   |
|                      /                   \\                         |
|                     /                     \\                        |
|             API Routes                   Vite Middleware           |
|         (/api/weather, etc.)             (Serves React SPA)        |
|                                                                    |
+--------------------------------------------------------------------+
`,
    codeSnippet: `// server.ts - Integrated Express + Vite Server
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
}

app.listen(3000, '0.0.0.0', () => {
  console.log('Unified Server running on http://0.0.0.0:3000');
});`,
    lineByLine: [
      'Line 1: Checks if environment is NOT production.',
      'Line 2-5: Instantiates Vite server in middleware mode.',
      'Line 6: Mounts Vite asset handlers directly onto Express request pipeline.',
      'Line 9: Binds Express HTTP listener to port 3000 on host 0.0.0.0.'
    ],
    interviewQuestions: [
      {
        q: 'Why is middlewareMode in Vite useful for Express full-stack apps?',
        a: 'It allows Express to handle API routes directly while handing off frontend asset compilation and SPA routing to Vite on a single port.'
      }
    ],
    quiz: {
      question: 'Why do we bind our server to host 0.0.0.0 instead of 127.0.0.1 in cloud containers?',
      options: [
        '0.0.0.0 encrypts all traffic',
        '0.0.0.0 accepts network traffic from outside container interfaces',
        '127.0.0.1 is faster',
        '0.0.0.0 is required by React'
      ],
      correctIndex: 1,
      explanation: '127.0.0.1 loopback only listens internally. 0.0.0.0 permits incoming connections from container reverse proxies.'
    },
    exercise: 'Test the /api/health route in your browser network tab or API inspector.',
    bestPractices: [
      'Avoid running client and server on separate ports in production to eliminate CORS headers and multi-port complexity.',
      'Gracefully shut down HTTP servers when SIGTERM signals are received.'
    ]
  },
  {
    stepNumber: 6,
    title: 'Version Control & Git Best Practices',
    topic: 'Git init, Commits, Branches, and .gitignore rules',
    summary: 'Manage source code safety and prevent tracking node_modules or secrets.',
    theory: `Git tracks changes across source code files.

Key Principles:
- **.gitignore**: Specifies files Git must ignore (e.g., \`node_modules/\`, \`.env\`, \`dist/\`, \`.DS_Store\`).
- **Atomic Commits**: Each commit should represent a single logical feature or fix.
- **Commit Messages**: Use imperative present tense (e.g., "Add Open-Meteo geocoding proxy endpoint").`,
    diagram: `
Working Directory  --->  Staging Area (git add)  --->  Local Repository (git commit)
    (Modified)                 (Indexed)                       (History)
`,
    codeSnippet: `# .gitignore example
node_modules/
dist/
.env
.env.local
*.log`,
    lineByLine: [
      'Line 1: Excludes compiled third-party npm packages.',
      'Line 2: Excludes frontend production build artifacts.',
      'Line 3: Prevents committing environment variables and API keys.'
    ],
    interviewQuestions: [
      {
        q: 'Why should node_modules never be committed to Git?',
        a: 'It contains tens of thousands of platform-dependent binary files that bloat the repository. Dependencies should be installed via package.json.'
      }
    ],
    quiz: {
      question: 'Which file dictates which files Git should ignore during commits?',
      options: ['metadata.json', '.gitignore', 'package.json', 'vite.config.ts'],
      correctIndex: 1,
      explanation: '.gitignore lists file patterns that Git will bypass.'
    },
    exercise: 'Verify that .env is listed in .gitignore before publishing to public repositories.',
    bestPractices: [
      'Commit frequently with clear, descriptive messages.',
      'Never commit hardcoded secrets or API tokens.'
    ]
  },
  {
    stepNumber: 7,
    title: 'Backend API Design: Query Parameters & Status Codes',
    topic: 'Designing RESTful GET endpoints, status codes, and error payloads',
    summary: 'Build REST endpoints following standard HTTP guidelines.',
    theory: `REST APIs use HTTP verbs and standard query formats:
- **Query Parameters**: Key-value pairs after \`?\` in URL (e.g., \`/api/weather?city=London&unit=celsius\`).
- **HTTP Status Codes**:
  - \`200 OK\`: Request succeeded.
  - \`400 Bad Request\`: Client provided invalid or missing query parameters.
  - \`404 Not Found\`: Requested resource or city does not exist.
  - \`500 Internal Server Error\`: Unexpected backend exception.`,
    diagram: `
Client Request: GET /api/weather?city=London
                   |
                   v
           [ Express Route ]
                   |
     +-------------+-------------+
     | Missing?                  | Present!
     v                           v
400 Bad Request             Fetch Geocode
{"error": "City required"}      |
                                v
                           200 OK Response
`,
    codeSnippet: `// Query Parameter Validation & Error Handling
app.get('/api/geocode', async (req: Request, res: Response) => {
  const city = req.query.city as string;
  if (!city || city.trim().length === 0) {
    return res.status(400).json({ error: 'City query parameter is required.' });
  }
  // Proceed with fetch...
});`,
    lineByLine: [
      'Line 1: Express GET route listener for /api/geocode.',
      'Line 2: Casts req.query.city parameter to string.',
      'Line 3: Checks if city string is missing or empty whitespace.',
      'Line 4: Returns 400 Bad Request HTTP status with structured JSON error message.'
    ],
    interviewQuestions: [
      {
        q: 'What is the difference between path parameters (/weather/:id) and query parameters (/weather?city=London)?',
        a: 'Path parameters identify a specific resource, while query parameters sort, filter, or pass optional request parameters.'
      }
    ],
    quiz: {
      question: 'Which HTTP status code should be returned when query parameters are missing or invalid?',
      options: ['200 OK', '400 Bad Request', '404 Not Found', '500 Server Error'],
      correctIndex: 1,
      explanation: '400 Bad Request indicates client-side validation failure.'
    },
    exercise: 'In your browser or test tool, query /api/geocode without passing ?city= and observe the 400 JSON response.',
    bestPractices: [
      'Always return JSON object with consistent error property schemas: { error: string }.',
      'Validate input string parameters before calling external services.'
    ]
  },
  {
    stepNumber: 8,
    title: 'Deep Dive: Open-Meteo Geocoding & Weather Forecast APIs',
    topic: 'How WMO weather codes, Geocoding, and Lat/Lng lookup work',
    summary: 'Master free meteorological APIs without API keys.',
    theory: `Open-Meteo provides free, high-resolution weather models using standard WMO (World Meteorological Organization) weather interpretation codes.

Two-Step Location Lookup:
1. **Geocoding Search API**: Converts human city names ("London", "Tokyo") into exact geographic coordinates: \`latitude: 51.5074, longitude: -0.1278\`.
2. **Forecast API**: Accepts \`latitude\` and \`longitude\` to return current weather, 7-day daily forecasts, and hourly metrics.`,
    diagram: `
"Tokyo"  ---> [ Open-Meteo Geocoding API ] ---> { lat: 35.6762, lng: 139.6503 }
                                                        |
                                                        v
                                         [ Open-Meteo Forecast API ]
                                                        |
                                                        v
                                         Current Temp, 7-Day Forecast, UV
`,
    codeSnippet: `// Geocoding & Weather API Request URLs
const geoUrl = 'https://geocoding-api.open-meteo.com/v1/search?name=Tokyo&count=1&language=en&format=json';
const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=35.6762&longitude=139.6503&current=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto';`,
    lineByLine: [
      'Line 1: Constructs geocoding query URL targeting Tokyo.',
      'Line 2: Constructs forecast query URL requesting current temperature, humidity, weather code, and daily min/max range.'
    ],
    interviewQuestions: [
      {
        q: 'What are WMO weather codes?',
        a: 'Standard numerical codes assigned by the World Meteorological Organization representing distinct weather conditions (0 = Clear, 61 = Rain, 71 = Snow, 95 = Thunderstorm).'
      }
    ],
    quiz: {
      question: 'Why does a weather forecast API require Latitude and Longitude instead of city names?',
      options: [
        'City names change spelling across languages, whereas coordinates uniquely pinpoint exact geographical forecast grid models',
        'Latitude is required by JavaScript',
        'Coordinates compress server data',
        'Open-Meteo only works in Europe'
      ],
      correctIndex: 0,
      explanation: 'Geographic coordinates accurately locate exact forecast grid cells regardless of local city name variations.'
    },
    exercise: 'Lookup the WMO weather code for Thunderstorms (Hint: 95, 96, 99).',
    bestPractices: [
      'Pass timezone=auto to get daily sunrise and sunset times in the location local time zone.',
      'Provide fallback city suggestions when geocoding returns multiple matches.'
    ]
  },
  {
    stepNumber: 9,
    title: 'Parsing API Response Payloads & Data Transformation',
    topic: 'Mapping WMO weather codes, formatting dates, calculating min/max',
    summary: 'Transform raw API output into clean, frontend-ready domain models.',
    theory: `External APIs return raw arrays organized by field key (e.g., \`time: ['2026-10-24', ...]\`, \`temperature_2m_max: [22, ...]\`).

Data Transformation Goals:
- Convert parallel daily arrays into an array of clean JavaScript objects: \`[{ date: 'Oct 24', tempMax: 22, tempMin: 14, icon: '⛅' }]\`.
- Map WMO numerical codes to human descriptions ("Partly Cloudy") and visual emojis/icons.
- Formulate sunrise/sunset timestamps into formatted strings ("06:45 AM").`,
    diagram: `
Raw Open-Meteo Payload:                             Transformed Domain Model:
{                                                   [
  daily: {                                            {
    time: ["2026-10-24"],           ===>                dayName: "Today",
    temperature_2m_max: [22],                           tempMax: 22,
    weather_code: [2]                                   condition: "Partly Cloudy",
  }                                                     icon: "⛅"
}                                                     }
                                                    ]
`,
    codeSnippet: `// Transformation helper for WMO codes
function getWmoWeatherInfo(code: number) {
  switch (code) {
    case 0: return { description: 'Clear sky', icon: '☀️' };
    case 2: return { description: 'Partly cloudy', icon: '⛅' };
    case 61: return { description: 'Light rain', icon: '🌧️' };
    default: return { description: 'Variable weather', icon: '🌤️' };
  }
}`,
    lineByLine: [
      'Line 1: Accepts numerical WMO weather code integer.',
      'Line 2: Evaluates code using JavaScript switch statement.',
      'Line 3-5: Returns human-readable description string and matching icon emoji.'
    ],
    interviewQuestions: [
      {
        q: 'Why should data transformation happen on the backend server rather than the frontend client?',
        a: 'It keeps frontend component rendering logic simple, reduces client bundle size, and allows changing API providers without modifying UI code.'
      }
    ],
    quiz: {
      question: 'What is the purpose of mapping WMO weather codes in server.ts?',
      options: [
        'To reduce server memory',
        'To translate raw numbers like 61 into user-friendly strings like "Light rain" and visual icons',
        'To speed up HTTP transmission',
        'Required by Express'
      ],
      correctIndex: 1,
      explanation: 'Transforming numerical codes into descriptive text and icons delivers intuitive UI labels for end users.'
    },
    exercise: 'Add support for WMO code 71 (Snowfall) in the getWmoWeatherInfo function.',
    bestPractices: [
      'Never send raw unprocessed multi-thousand line arrays directly to the frontend.',
      'Include defensive fallbacks for missing or null properties.'
    ]
  },
  {
    stepNumber: 10,
    title: 'Frontend Page Navigation & Routing Architecture',
    topic: 'Single Page Applications (SPA) & Component Views',
    summary: 'Manage application views cleanly without browser page reloads.',
    theory: `In Single Page Applications (SPAs), navigation happens dynamically via React state and JavaScript components rather than requesting new HTML files from a web server.

Key Benefits:
- Instant UI transitions without page flickering.
- Preserves client-side application state across view changes.
- Seamless tab toggling between Live Dashboard, 7-Day Forecast, and Mentor Curriculum mode.`,
    diagram: `
+-------------------------------------------------------------------------+
|                         SINGLE PAGE APPLICATION VIEWS                   |
+-------------------------------------------------------------------------+
|                                                                         |
|  [ Header Navigation Tabs ]                                             |
|        |                                                                |
|        +------> Active Tab = "weather"   ---> Render Live Weather Dashboard |
|        |                                                                |
|        +------> Active Tab = "mentor"    ---> Render Interactive Bootcamp |
|        |                                                                |
|        +------> Active Tab = "hourly"    ---> Render 24-Hour Trend Visual |
|                                                                         |
+-------------------------------------------------------------------------+
`,
    codeSnippet: `// App.tsx View State Handler
const [activeTab, setActiveTab] = useState<'weather' | 'mentor' | 'hourly'>('weather');

return (
  <div>
    <nav>
      <button onClick={() => setActiveTab('weather')}>Dashboard</button>
      <button onClick={() => setActiveTab('mentor')}>Mentor Guide</button>
    </nav>
    
    {activeTab === 'weather' && <WeatherDashboard />}
    {activeTab === 'mentor' && <MentorGuide />}
  </div>
);`,
    lineByLine: [
      'Line 2: Declares activeTab state using React useState hook.',
      'Line 7-8: Buttons update activeTab state on user click.',
      'Line 11-12: Conditional rendering checks activeTab and displays matching page component.'
    ],
    interviewQuestions: [
      {
        q: 'What is the key advantage of an SPA over traditional multi-page web applications?',
        a: 'SPAs load HTML/JS once, rendering view updates dynamically in the browser without full page reloads, delivering a smooth desktop-like feel.'
      }
    ],
    quiz: {
      question: 'How does conditional rendering in React work?',
      options: [
        'By using standard JavaScript boolean expressions like {condition && <Component />} inside JSX',
        'By reloading index.html',
        'By calling window.location.reload()',
        'Through CSS display: none only'
      ],
      correctIndex: 0,
      explanation: 'React evaluates boolean expressions inside curly braces {} to conditionally mount components into the Virtual DOM.'
    },
    exercise: 'Try switching between Dashboard and Mentor Guide tabs in the running application above.',
    bestPractices: [
      'Use state-driven view routing for simple dashboards.',
      'Maintain clear active navigation indicators so users know where they are.'
    ]
  },
  {
    stepNumber: 11,
    title: 'Component Architecture & Modular Design',
    topic: 'Breaking UI into SearchBar, WeatherCard, ForecastCard, MetricsGrid',
    summary: 'Build reusable, single-responsibility UI components.',
    theory: `Component-Driven Architecture breaks complex user interfaces into small, isolated, reusable building blocks.

Our Weather App Component Tree:
- **App**: Root state container (city search query, weather data, loading/error states).
- **Header**: Search input, quick city pills, units toggle (°C/°F), and Mentor status badge.
- **CurrentWeatherCard**: Displays temperature, condition description, location name, and activity recommendation box.
- **MetricsGrid**: 6 metric cards (Feels Like, Wind Speed, Humidity, UV Index, Rain %, Pressure).
- **ForecastStrip**: Dark slate 7-day forecast strip.
- **MentorGuide**: Interactive 20-step learning module with quizzes and line-by-line breakdowns.`,
    diagram: `
                              [ App Component ]
                                      |
       +------------------+-----------+-----------+-------------------+
       |                  |                       |                   |
 [ Header ]     [ CurrentWeatherCard ]     [ MetricsGrid ]     [ ForecastStrip ]
       |                  |                       |                   |
 (SearchBar,        (Temp, Icon,             (6 Utility          (7-Day Daily
  City Pills)       Recommendation)           Cards)               Cards)
`,
    codeSnippet: `// Reusable Metric Card Component
interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  badge?: string;
}

export function MetricCard({ label, value, icon, badge }: MetricCardProps) {
  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      {badge && <span className="text-xs text-orange-500 font-medium mt-1 inline-block">{badge}</span>}
    </div>
  );
}`,
    lineByLine: [
      'Line 2-7: Defines TypeScript interface for component props.',
      'Line 9: Functional component accepting props with destructuring.',
      'Line 11: Render container with Clean Utility theme border and shadow classes.',
      'Line 12: Displays uppercase metric label.',
      'Line 14-15: Displays metric value and matching weather icon emoji.',
      'Line 17: Conditionally renders colored badge if passed.'
    ],
    interviewQuestions: [
      {
        q: 'What are the benefits of component-driven development?',
        a: 'Reusability, isolated testability, maintainability, clean separation of concerns, and team scalability.'
      }
    ],
    quiz: {
      question: 'What React mechanism passes data down from parent to child components?',
      options: ['State', 'Props', 'Hooks', 'Reducers'],
      correctIndex: 1,
      explanation: 'Props (short for properties) pass read-only data downward from parent components to child components.'
    },
    exercise: 'Identify three modular components created in this project.',
    bestPractices: [
      'Keep components focused on a single responsibility.',
      'Define explicit TypeScript interfaces for all component props.'
    ]
  },
  {
    stepNumber: 12,
    title: 'Core React Concepts: Props, State & Hooks',
    topic: 'useState, useEffect, Controlled Components, and Lifting State',
    summary: 'Master fundamental React reactive hooks and state management.',
    theory: `React uses Hooks to tap into state and lifecycle features:

1. **useState**: Holds mutable reactive data (e.g., \`const [city, setCity] = useState('London')\`). When state changes, React automatically re-renders the component.
2. **useEffect**: Performs side-effects (e.g., fetching weather data when city changes).
3. **Controlled Components**: Form inputs whose value is bound directly to React state: \`<input value={city} onChange={e => setCity(e.target.value)} />\`.
4. **Lifting State Up**: Moving shared state to the closest common parent component so multiple child components can share data.`,
    diagram: `
   User types in <input />  --->  onChange event fires  --->  setCity("Tokyo")
                                                                  |
                                                                  v
   Weather Card updates    <---  React re-renders App  <---  State updated!
`,
    codeSnippet: `// React Hooks Example: Controlled Input & Data Fetching
const [city, setCity] = useState('London');
const [weather, setWeather] = useState<WeatherData | null>(null);

useEffect(() => {
  let isMounted = true;
  async function fetchWeather() {
    const res = await axios.get(\`/api/weather?city=\${city}\`);
    if (isMounted) setWeather(res.data);
  }
  fetchWeather();
  return () => { isMounted = false; };
}, [city]);`,
    lineByLine: [
      'Line 2: Initializes city state with default value "London".',
      'Line 3: Initializes weather state with null.',
      'Line 5: useEffect hook runs after component mounts and whenever city changes.',
      'Line 6: Cleanup flag protects against state updates if component unmounts during active fetch.',
      'Line 8: Axios GET request calls backend Express endpoint.',
      'Line 9: Updates weather state with returned JSON payload.',
      'Line 12: Dependency array [city] tells React when to re-trigger effect.'
    ],
    interviewQuestions: [
      {
        q: 'Why should you include a dependency array in useEffect?',
        a: 'Without a dependency array, useEffect executes after every single render, causing infinite loops if state is updated inside the effect.'
      }
    ],
    quiz: {
      question: 'What hook is used to manage reactive state variables in React functional components?',
      options: ['useEffect', 'useState', 'useRef', 'useContext'],
      correctIndex: 1,
      explanation: 'useState returns a stateful value and a function to update it.'
    },
    exercise: 'Explain what happens if you pass an empty array [] as the dependency to useEffect.',
    bestPractices: [
      'Always specify clean dependency arrays in useEffect.',
      'Use functional state updates when depending on previous state.'
    ]
  },
  {
    stepNumber: 13,
    title: 'Connecting Frontend to Backend with Axios',
    topic: 'Axios GET requests, Loading Spinners, and Error States',
    summary: 'Connect React client to Express proxy API using Axios.',
    theory: `Axios is a popular promise-based HTTP client for browser and Node.js.

Advantages over native Fetch:
- Automatic JSON parsing (no need for \`res.json()\`).
- Built-in request timeout and cancellation support.
- Automatic HTTP error status rejection (status >= 400 throws catchable errors).
- Clean async/await syntax.

Triple State Pattern for Asynchronous UI:
1. **Data State**: Holds fetched payload (\`data\`).
2. **Loading State**: Boolean indicating network request in flight (\`loading: true/false\`).
3. **Error State**: Holds error message string (\`error: string | null\`).`,
    diagram: `
                             [ User Requests City ]
                                       |
                                       v
                          Set Loading = True, Error = Null
                                       |
                                       v
                             [ Axios GET Request ]
                                    /     \\
                           Success /       \\ Error
                                  v         v
                         Set Weather Data  Set Error Message
                                  \\         /
                                   v       v
                             Set Loading = False
`,
    codeSnippet: `// Full Async Data Fetching Handler with Axios
async function handleSearch(cityName: string) {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.get(\`/api/weather?city=\${encodeURIComponent(cityName)}\`);
    setWeather(response.data);
  } catch (err: any) {
    const message = err.response?.data?.error || 'Failed to fetch weather data. Please try again.';
    setError(message);
  } finally {
    setLoading(false);
  }
}`,
    lineByLine: [
      'Line 2: Enables loading state to display animated skeleton UI.',
      'Line 3: Resets previous error state to null.',
      'Line 4: Enters try block to attempt network request.',
      'Line 5: Sends HTTP GET request via Axios targeting backend Express route.',
      'Line 6: Stores returned weather JSON data directly into React state.',
      'Line 7-9: Catches HTTP status errors (400, 404, 500) and extracts friendly error message.',
      'Line 11: Finally block executes regardless of success or failure to stop loading state.'
    ],
    interviewQuestions: [
      {
        q: 'Why is the try-catch-finally block ideal for asynchronous API calls?',
        a: 'Try handles successful execution, catch catches exceptions/network failures, and finally guarantees cleanup operations like resetting loading spinners.'
      }
    ],
    quiz: {
      question: 'How does Axios handle non-2xx HTTP status codes by default?',
      options: [
        'It ignores them',
        'It automatically rejects the promise and triggers the catch block',
        'It reloads the browser',
        'It returns null'
      ],
      correctIndex: 1,
      explanation: 'Axios automatically throws errors for HTTP status codes outside the 2xx range, redirecting execution to catch blocks.'
    },
    exercise: 'Trigger an error by searching for a non-existent city like "Xyz12345" and observe error state handling.',
    bestPractices: [
      'Always encode URI components (encodeURIComponent) when passing user input in URLs.',
      'Always clear loading state in a finally block.'
    ]
  },
  {
    stepNumber: 14,
    title: 'Building the Weather UI (Clean Utility / Minimal Theme)',
    topic: 'Layout, Cards, Badges, Temperature Displays & Utility Aesthetics',
    summary: 'Craft a visually stunning, responsive weather dashboard.',
    theory: `The Clean Utility / Minimal theme emphasizes clarity, high readability, subtle slate backgrounds, and crisp typography hierarchy.

Design Structure:
- **Left Panel (Col 4)**: Large current temperature hero, weather emoji, city name, date, and highlighted Intelligence Engine Recommendation Box (\`bg-indigo-50 rounded-2xl p-4\`).
- **Right Panel (Col 8)**:
  - 6-Grid Metric Cards: Feels like, Wind speed, Humidity, UV Index, Rain %, Pressure/AQI.
  - Dark Slate 7-Day Forecast Strip (\`bg-slate-900 rounded-[32px] p-6 text-white\`).`,
    diagram: `
+-------------------------------------------------------------------------------+
| HEADER: [ WeatherIntel Logo ] [ City Search Input ] [ Mentor Mode: Step 14 ]   |
+-------------------------------------------------------------------------------+
| LEFT PANEL (4 cols)                 | RIGHT PANEL (8 cols)                    |
| +---------------------------------+ | +-------------------------------------+ |
| | London                          | | | 6 METRIC UTILITY CARDS GRID         | |
| | Thursday, 24 Oct         ⛅    | | | [Feels 24°] [Wind 12] [Humidity 45%]| |
| |                                 | | | [UV 4 Mod]  [Rain 10%] [Pres 1012]  | |
| | 22°C                            | | +-------------------------------------+ |
| | Partly Cloudy                   | | +-------------------------------------+ |
| |                                 | | | 7-DAY FORECAST STRIP (Slate 900)    | |
| | INTELLIGENCE RECOMMENDATION BOX | | | FRI   SAT   SUN   MON   TUE   WED   | |
| | "Great day for a walk in park"  | | | ☀️    🌦️   ☁️    ☀️    ☀️    ⛅    | |
| +---------------------------------+ | +-------------------------------------+ |
+-------------------------------------------------------------------------------+
`,
    codeSnippet: `// Clean Utility Theme Forecast Item
<div className="flex flex-col items-center gap-2">
  <span className="text-slate-400 text-xs font-medium uppercase">{day.dayName}</span>
  <span className="text-2xl">{day.icon}</span>
  <span className="font-bold">{day.tempMax}°</span>
  <span className="text-slate-500 text-xs">{day.tempMin}°</span>
</div>`,
    lineByLine: [
      'Line 1: Vertical flex column container centering forecast item.',
      'Line 2: Renders muted uppercase day abbreviation (e.g., FRI).',
      'Line 3: Renders weather icon emoji.',
      'Line 4: Renders bold maximum temperature integer.',
      'Line 5: Renders subtle minimum night temperature integer.'
    ],
    interviewQuestions: [
      {
        q: 'What is the purpose of maintaining strict grid layout constraints in dashboard design?',
        a: 'Grid alignment provides rhythm, visual balance, predictable responsive reflows across devices, and clear information hierarchy.'
      }
    ],
    quiz: {
      question: 'In Tailwind CSS, which class creates a 3-column responsive grid layout?',
      options: ['flex flex-col 3', 'grid grid-cols-3 gap-4', 'display-3', 'cols-3-grid'],
      correctIndex: 1,
      explanation: 'grid grid-cols-3 creates a 3-column CSS Grid with automatic row distribution.'
    },
    exercise: 'Inspect the 7-day forecast strip in the app and verify temperature ranges.',
    bestPractices: [
      'Maintain strong visual contrast between active cards and neutral background canvas.',
      'Use subtle rounded corners (rounded-2xl, rounded-[32px]) for modern utility UI aesthetics.'
    ]
  },
  {
    stepNumber: 15,
    title: 'Designing the Planning Recommendation Engine',
    topic: 'Rules-based decision trees for activity and safety suggestions',
    summary: 'Build an intelligent rule engine converting raw numbers into actionable human advice.',
    theory: `Raw weather numbers (e.g., "Precipitation 65%", "UV Index 8") require cognitive effort for users to interpret. An Intelligence Engine applies rule-based decision trees to output contextual advice.

Decision Logic Rules:
1. **Umbrella Advisory**: \`precipProb >= 50%\` OR \`weatherCode in [Rain/Drizzle]\` -> "Carry an umbrella ☔".
2. **Sun Protection**: \`uvIndex >= 6\` -> "Apply SPF 30+ sunscreen and wear sunglasses 🕶️".
3. **Wind Warning**: \`windSpeed >= 25 km/h\` -> "Strong wind gusts detected 💨".
4. **Outdoor Activity**: \`18°C <= temp <= 25°C\` AND \`precip < 20%\` -> "Perfect day for walking, cycling, or running 🚴‍♂️".`,
    diagram: `
+--------------------------------------------------------------------------+
|                     INTELLIGENCE RECOMMENDATION ENGINE                   |
+--------------------------------------------------------------------------+
|                                                                          |
|  Input Metrics: { Temp: 22°C, Rain: 10%, Wind: 12km/h, UV: 4 }           |
|                                |                                         |
|                                v                                         |
|                      [ Rule Evaluation ]                                 |
|                      - Rain > 50%? No                                    |
|                      - UV > 6? No                                        |
|                      - Temp 18-25°C & Low Rain? YES!                     |
|                                |                                         |
|                                v                                         |
|  Output Recommendation:                                                  |
|  "Optimal temperature (22°C) and clear skies. Perfect day for a walk     |
|   in the park or cycling!"                                               |
|                                                                          |
+--------------------------------------------------------------------------+
`,
    codeSnippet: `// Recommendation Logic Function
function generateRecommendations(data) {
  const recs = [];
  if (data.precipitationProb >= 50) {
    recs.push({ action: 'Carry an umbrella ☔', text: 'Rain expected today.' });
  }
  if (data.temp >= 18 && data.temp <= 25 && data.precipitationProb < 20) {
    recs.push({ action: 'Great for cycling 🚴‍♂️', text: 'Perfect weather conditions.' });
  }
  return recs;
}`,
    lineByLine: [
      'Line 1: Function receiving current weather metrics payload.',
      'Line 2: Initializes recommendations array.',
      'Line 3-5: Evaluates rain probability threshold and appends umbrella suggestion.',
      'Line 6-8: Evaluates ideal temperature window for outdoor activities.',
      'Line 9: Returns list of active recommendations to UI.'
    ],
    interviewQuestions: [
      {
        q: 'What is a rule-based expert system in software engineering?',
        a: 'A system that uses human expert rules (if-then statements) to deduce conclusions or recommendations from input data parameters.'
      }
    ],
    quiz: {
      question: 'When should the Intelligence Engine recommend carrying an umbrella?',
      options: [
        'When temperature is 25°C',
        'When rain probability exceeds 50% or rain codes are present',
        'When humidity is 10%',
        'When wind speed is zero'
      ],
      correctIndex: 1,
      explanation: 'Precipitation probability over 50% indicates significant rain likelihood, triggering the umbrella advisory.'
    },
    exercise: 'Test how searching for a rainy location (e.g., Seattle or London) alters the Intelligence Box advice.',
    bestPractices: [
      'Order recommendation rules by safety priority (Severe weather/UV warnings first, recreational advice second).',
      'Provide clear concise action labels.'
    ]
  },
  {
    stepNumber: 16,
    title: 'Tailwind CSS Utility Masterclass & Responsive Design',
    topic: 'Flexbox, Grid, Spacing Math, Color Saturation, and Responsive Prefixes',
    summary: 'Master clean utility styling and responsive break points.',
    theory: `Tailwind CSS v4 provides atomic utility classes that map directly to modern CSS properties.

Key Design Guidelines from Theme:
- **Clean Neutral Canvas**: \`bg-slate-50\` with subtle dark slate contrast accents (\`bg-slate-900\`).
- **Responsive Prefixes**:
  - Default: Mobile first layout (\`col-span-12\`).
  - \`md:\`: Tablet screens (\`col-span-6\`).
  - \`lg:\`: Desktop screens (\`col-span-4\` / \`col-span-8\` split).
- **Flex & Grid Math**: \`grid grid-cols-12 gap-6\` allows flexible column span distribution across card widgets.`,
    diagram: `
+--------------------------------------------------------------------------+
|                     TAILWIND CSS BREAKPOINT RESPONSIVENESS               |
+--------------------------------------------------------------------------+
|                                                                          |
|  Mobile (<768px):    [ Left Panel ]  (Stacked single column)             |
|                      [ Right Panel ]                                     |
|                                                                          |
|  Desktop (>1024px):  [ Left Panel (col-span-4) ] [ Right Panel (col-8) ]|
|                      (Side-by-side dashboard layout)                     |
|                                                                          |
+--------------------------------------------------------------------------+
`,
    codeSnippet: `// Responsive Grid Layout
<main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
  <div className="col-span-1 md:col-span-4"> {/* Left Hero Card */} </div>
  <div className="col-span-1 md:col-span-8"> {/* Right Metrics & Forecast */} </div>
</main>`,
    lineByLine: [
      'Line 1: Main tag with padding 6, using 12-column CSS Grid layout on desktop.',
      'Line 2: Left panel spans 4 out of 12 columns on medium screens and above.',
      'Line 3: Right panel spans remaining 8 columns.'
    ],
    interviewQuestions: [
      {
        q: 'What is mobile-first responsive design in CSS frameworks like Tailwind?',
        a: 'Styles without prefixes apply to all screen sizes starting from mobile, while breakpoint prefixes (sm:, md:, lg:) override styles for larger viewport widths.'
      }
    ],
    quiz: {
      question: 'Which Tailwind class sets elements side-by-side in a flexible row?',
      options: ['flex flex-col', 'flex flex-row items-center', 'grid-rows-1', 'block-inline'],
      correctIndex: 1,
      explanation: 'flex flex-row lays children out horizontally along the main axis.'
    },
    exercise: 'Resize your browser window or preview pane and observe how the dashboard smoothly reflows.',
    bestPractices: [
      'Maintain consistent spacing scale (p-4, p-6, p-8).',
      'Avoid hardcoded pixel widths; use relative grid columns and percentage flex bases.'
    ]
  },
  {
    stepNumber: 17,
    title: 'Loading States & Skeleton UI Architecture',
    topic: 'Preventing Layout Shift with Animated Skeleton Placeholders',
    summary: 'Deliver smooth perceived performance during network fetches.',
    theory: `When fetching asynchronous network data, blank screens or sudden layout shifts degrade user experience.

- **Spinner**: Good for small inline button actions.
- **Skeleton UI**: Mirrored structural placeholder shapes rendered during loading with pulse animations (\`animate-pulse bg-slate-200\`).
- **Benefits**: Eliminates Cumulative Layout Shift (CLS) and keeps UI structural framework stable.`,
    diagram: `
Fetching Data...
+-------------------------------------------------------------+
| [ Skeleton Circle ]   [ Skeleton Rect (City Name) ]         |
| [ Skeleton Rect ]     [ Skeleton Rect (Temperature) ]       |
+-------------------------------------------------------------+
                            |
                     Fetch Complete!
                            v
+-------------------------------------------------------------+
| ⛅                    London                                |
|                       22°C                                  |
+-------------------------------------------------------------+
`,
    codeSnippet: `// Skeleton UI Component
export function WeatherSkeleton() {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-3 w-1/2">
          <div className="h-8 bg-slate-200 rounded-lg w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
        </div>
        <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
      </div>
    </div>
  );
}`,
    lineByLine: [
      'Line 3: Container matching real Weather Card dimensions with Tailwind animate-pulse class.',
      'Line 5-8: Skeleton rectangles representing city title and date text.',
      'Line 9: Skeleton circle representing weather icon placeholder.'
    ],
    interviewQuestions: [
      {
        q: 'Why is Skeleton UI preferred over traditional centered loading spinners for dashboard interfaces?',
        a: 'Skeleton screens communicate layout context immediately, reducing perceived load times and preventing jarring layout jumps when content populates.'
      }
    ],
    quiz: {
      question: 'Which Tailwind CSS utility class adds a smooth pulsing opacity animation to skeleton loaders?',
      options: ['animate-bounce', 'animate-spin', 'animate-pulse', 'animate-fade'],
      correctIndex: 2,
      explanation: 'animate-pulse produces a subtle fading opacity pulse effect ideal for placeholder loading blocks.'
    },
    exercise: 'Type a new city in the search bar and watch the skeleton placeholders animate during network request.',
    bestPractices: [
      'Mirror exact layout dimensions of actual loaded cards inside skeleton placeholders.',
      'Keep animation speeds subtle.'
    ]
  },
  {
    stepNumber: 18,
    title: 'Robust Error Handling & Edge Case Management',
    topic: 'City not found, Network failures, Empty inputs, API timeouts',
    summary: 'Gracefully catch and present friendly user feedback for edge cases.',
    theory: `Robust applications handle unexpected user input and network failures without crashing.

Common Edge Cases:
1. **Empty Search Input**: Prevent network request if string is whitespace.
2. **City Not Found (404)**: Display helpful message: "No matching cities found for 'xyz'. Please check spelling."
3. **Server Error / Network Offline (500/Failed)**: Show retry button and error banner.
4. **API Rate Limits**: Fall back to cached weather data or notify user.`,
    diagram: `
User Inputs "Xyz123" ---> [ Express Proxy ] ---> [ Open-Meteo Geocoding ]
                                                      |
                                                      v
                                              Results = [] (Empty)
                                                      |
                                                      v
React UI displays Error Alert <--- 404 JSON {"error": "City not found"}
"City 'Xyz123' not found. Try 'London' or 'Tokyo'."
`,
    codeSnippet: `// Error Display Component
{error && (
  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center justify-between my-4">
    <div className="flex items-center gap-3">
      <span>⚠️</span>
      <p className="text-sm font-medium">{error}</p>
    </div>
    <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 font-bold">✕</button>
  </div>
)}`,
    lineByLine: [
      'Line 1: Evaluates if error state string exists.',
      'Line 2: Rose colored error alert box with border and rounded corners.',
      'Line 3-6: Renders warning icon and specific error message.',
      'Line 7: Dismiss button clears error state on click.'
    ],
    interviewQuestions: [
      {
        q: 'What is an Error Boundary in React?',
        a: 'A class component that catches JavaScript errors anywhere in child component trees, logging errors and displaying fallback UI instead of crashing the whole app.'
      }
    ],
    quiz: {
      question: 'How should frontend applications notify users when an API request fails?',
      options: [
        'By freezing the screen',
        'By displaying a clear, actionable error banner with retry options',
        'By logging silently to console only',
        'By closing the browser tab'
      ],
      correctIndex: 1,
      explanation: 'User-friendly error banners inform users of specific issues and provide paths to recover (like checking spelling or retrying).'
    },
    exercise: 'Type special characters or gibberish in the city search bar and verify the error alert display.',
    bestPractices: [
      'Never expose raw code stack traces to end users.',
      'Provide quick suggestions or recovery buttons in error alerts.'
    ]
  },
  {
    stepNumber: 19,
    title: 'Production Build Optimization & Cloud Deployment',
    topic: 'Vite build bundling, Environment Variables, Cloud Run & Vercel deployment',
    summary: 'Prepare application for production builds and hosting.',
    theory: `Deploying full-stack applications involves compiling static assets and executing production Node server builds.

Build Pipeline Steps:
1. \`vite build\`: Compiles TypeScript JSX into minified HTML/CSS/JS bundles in \`/dist\`.
2. \`esbuild server.ts\`: Bundles Node backend TypeScript into single CommonJS file \`dist/server.cjs\`.
3. \`node dist/server.cjs\`: Launches production web server serving API routes and static frontend bundles.

Hosting Strategy:
- **Unified Cloud Run / Render**: Serves unified server on single port 3000.
- **Vercel + Serverless**: Frontend hosted on Vercel CDN, backend deployed as Vercel Serverless Functions.`,
    diagram: `
DEVELOPMENT:
tsx server.ts ---> Express API + Vite Dev Server Middleware (Port 3000)

PRODUCTION BUILD:
npm run build
├── vite build                 ---> Output: /dist (index.html, JS, CSS)
└── esbuild server.ts          ---> Output: /dist/server.cjs

PRODUCTION START:
node dist/server.cjs           ---> Serves Express API & static /dist bundle on Port 3000
`,
    codeSnippet: `// package.json build script
"scripts": {
  "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
  "start": "node dist/server.cjs"
}`,
    lineByLine: [
      'Line 2: Compiles Vite frontend assets and bundles server.ts into dist/server.cjs.',
      'Line 3: Launches production bundled Node server.'
    ],
    interviewQuestions: [
      {
        q: 'Why do we bundle server.ts with esbuild for production?',
        a: 'Bundling resolves all relative import paths into a single file and converts TypeScript to native JS, speeding up container cold starts.'
      }
    ],
    quiz: {
      question: 'Which directory contains the compiled static assets generated by vite build?',
      options: ['/src', '/dist', '/node_modules', '/server'],
      correctIndex: 1,
      explanation: '/dist is the standard build output folder containing minified assets ready for static serving.'
    },
    exercise: 'Check the package.json scripts and verify the build command format.',
    bestPractices: [
      'Ensure environment secrets are configured in production hosting dashboard secrets.',
      'Set NODE_ENV=production in hosted runtime environments.'
    ]
  },
  {
    stepNumber: 20,
    title: 'System Design, Caching, Rate Limiting & Scalability',
    topic: 'In-Memory Caching (Redis), Rate Limiting, API Security & Performance Optimization',
    summary: 'Architect high-scale production systems for millions of requests.',
    theory: `At high scale, calling external weather APIs on every single user request wastes bandwidth and triggers API rate limits.

Scaling & Performance Strategies:
1. **Server-Side Caching (Redis/In-Memory)**: Weather forecasts do not change second-by-second. Cache London weather responses for 15-30 minutes. Subsequent requests return instantly from memory (1ms response time!).
2. **Rate Limiting**: Protect your API endpoints using rate-limit middleware (e.g., maximum 100 requests per IP per minute).
3. **Debouncing Search Input**: Delay geocoding API calls by 300ms while user is typing in search input to avoid sending requests for every keystroke.
4. **CDN Caching**: Serve static frontend assets via global Edge Content Delivery Networks (Cloudflare/Cloudfront).`,
    diagram: `
                                 [ User Request: London ]
                                            |
                                            v
                                  [ Redis / Memory Cache ]
                                     /             \\
                         Cache HIT  /               \\ Cache MISS
                        (1ms return)                 (Fetch Open-Meteo)
                                   v                   v
                         Return Weather Data   Save to Cache (TTL 15m)
`,
    codeSnippet: `// Debouncing Search Input in React
useEffect(() => {
  const handler = setTimeout(() => {
    if (searchTerm.trim().length >= 2) {
      fetchGeocodeSuggestions(searchTerm);
    }
  }, 300); // Wait 300ms after user stops typing
  
  return () => clearTimeout(handler);
}, [searchTerm]);`,
    lineByLine: [
      'Line 2: Sets timer delaying execution by 300 milliseconds.',
      'Line 3-5: Executes geocoding search only if search term length is at least 2 chars.',
      'Line 7: Cleanup function cancels pending timer if user types another character before 300ms expires.'
    ],
    interviewQuestions: [
      {
        q: 'What is input debouncing and why is it important for search bars?',
        a: 'Debouncing delays function execution until user pauses typing, preventing dozens of unnecessary network requests on every single keystroke.'
      },
      {
        q: 'Why is caching weather data appropriate?',
        a: 'Meteorological observations do not fluctuate instantly; caching for 15 minutes dramatically reduces external API costs while keeping data fresh.'
      }
    ],
    quiz: {
      question: 'What optimization technique delays search execution until the user stops typing for a given duration?',
      options: ['Throttling', 'Debouncing', 'Recursion', 'Polling'],
      correctIndex: 1,
      explanation: 'Debouncing delays trigger execution until a pause in user activity occurs, eliminating intermediate requests.'
    },
    exercise: 'Congratulate yourself! You have completed the Full Stack Weather Intelligence System Architecture curriculum.',
    bestPractices: [
      'Cache external API calls aggressively with appropriate Time-To-Live (TTL).',
      'Implement input debouncing on all search inputs.',
      'Rate-limit public API routes to defend against Denial of Service (DoS) attacks.'
    ]
  }
];
