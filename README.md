# YelpCamp

A full-stack campground review platform that allows users to discover, share, and review campsites with an interactive mapping interface.

## Live Demo
View the hosted application: [https://yelpcamp-n23a.onrender.com/](https://yelpcamp-n23a.onrender.com/)

## Overview
YelpCamp is a comprehensive campground management platform that enables users to:
- Upload and share campsite information with descriptions, photos, and location details
- Browse and search campsites using an interactive map interface
- Leave comments and reviews for campsites they've visited
- Explore sample campground data generated with AI assistance

## Technology Stack

### Backend
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Template Engine**: [EJS (Embedded JavaScript)](https://ejs.co/)

### Frontend & Services
- **Mapping**: [Mapbox](https://www.mapbox.com/)
- **Image Source**: [Unsplash](https://unsplash.com/)
- **Image Hosting**: [Cloudinary](https://cloudinary.com/)
- **AI Content Generation**: [OpenAI GPT API](https://platform.openai.com/docs/api-reference/introduction)

## AI-Generated Content
Sample campground descriptions are generated using OpenAI's API with the following prompt structure:

> Give me an example description of about 50 words for a campground named ${campName} which is in ${location}.
> Do not mention the name of the campground and write it in the tone of a real user on a website like Yelp.
> Start with a description and talk about the location later.

## Getting Started
Visit the live application: [https://yelpcamp-n23a.onrender.com/](https://yelpcamp-n23a.onrender.com/)
