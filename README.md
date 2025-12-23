# WheelWise - Options Strategy Tracker

WheelWise is a sophisticated logbook and analysis tool designed for traders utilizing the **Options Wheel Strategy** (Cash Secured Puts and Covered Calls). It tracks performance, calculates cost basis for assigned positions, and leverages Gemini AI to provide strategic insights.

## Features

- **Multi-User Support**: Individual account registration and secure data isolation.
- **Trade Logbook**: Comprehensive tracking of CSPs and CCs with status management (Open, Closed, Assigned, Expired).
- **Portfolio Tracking**: Real-time calculation of average price, total premiums collected, and net cost basis for assigned stocks.
- **AI Advisor**: Integration with Gemini 2.0 Flash for portfolio analysis and ticker-specific market sentiment.
- **Interactive Dashboard**: Visual analytics using Recharts for profit curves and ticker performance.

## Prerequisites

Before setting up, ensure you have the following:

1.  **MongoDB Atlas Connection String**: A URI for your MongoDB database (e.g., `mongodb+srv://...`).
2.  **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/).
3.  **Vercel Account**: For hosting the frontend and serverless backend functions.

## Setup Instructions

### 1. Environment Variables

This application requires two primary environment variables to be configured in your deployment environment (e.g., Vercel Dashboard):

| Variable | Description |
| :--- | :--- |
| `API_KEY` | Your Google Gemini API Key. |
| `MONGODB_URI` | Your MongoDB connection string. |

### 2. Local Development

To run this project locally:

1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file in the root directory and add your keys:
    ```env
    API_KEY=your_gemini_api_key_here
    MONGODB_URI=your_mongodb_uri_here
    ```
4.  Start the development server: `npm run dev`.

### 3. Vercel Deployment

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  In the **Environment Variables** section of the Vercel project settings, add `API_KEY` and `MONGODB_URI`.
4.  Deploy. Vercel will automatically handle the serverless functions in the `/api` directory.

## Tech Stack

- **Frontend**: React (v19), Tailwind CSS, Recharts.
- **Backend**: Vercel Serverless Functions (Node.js).
- **Database**: MongoDB.
- **AI**: @google/genai (Gemini 2.0 Flash).

## License

MIT
