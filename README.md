# YelpCamp

## Let Me See It!
A hosted version of this website is available [here](https://yelpcamp-n23a.onrender.com/)

## The Concept
This is a full-stack project built to allow users to upload campsites along with descriptions, photos and details. Others can then comment and review the campsites that they stay at.
Currently the project uses sample data generated via calls to OpenAI's GPT API.
The project is fully hosted and features an interactive map, allowing users to search for campsites visually.

## The Implementation
This project uses [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/) on the backend with [Embedded JavaScript templating](https://ejs.co/) for frontend rendering.
[Mapbox](https://www.mapbox.com/) is used for rendering maps, [Unsplash](https://unsplash.com/) is used for images.
For the sample descriptions [ChatGPTs API](https://platform.openai.com/docs/api-reference/introduction) is used with the following prompt:

> Give me an example description of about 50 words for a campground named ${campName} which is in ${location}.
> Do not mention the name of the campground and write it in the tone of a real user on a website like Yelp.
> Start with a description and talk about the location later.

[Cloudinary](https://cloudinary.com/) is used for image hosting.

Go and check it out [here](https://yelpcamp-n23a.onrender.com/)
