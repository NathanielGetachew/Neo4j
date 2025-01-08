# Movie Recommendation System

This project implements a movie recommendation system using Neo4j as the graph database and JavaScript for the application logic. The system employs a hybrid approach, primarily utilizing collaborative filtering with a fallback to content-based filtering to provide personalized movie recommendations to users.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Data Model](#data-model)
- [Recommendation Logic](#recommendation-logic)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Movie Recommendation System leverages the relationships between users, movies, and genres to suggest movies that a user might enjoy. By analyzing user ratings and movie genres, the system provides tailored recommendations to enhance user experience.

## Features

- **Collaborative Filtering**: Recommends movies based on the preferences of similar users.
- **Content-Based Filtering**: Suggests movies similar to those a user has liked, based on genres.
- **Hybrid Approach**: Combines both filtering methods to improve recommendation accuracy.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [Neo4j](https://neo4j.com/) (version 4.x or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/movie-recommendation-system.git
   cd movie-recommendation-system
## Install Dependencies:

bash
Copy code
npm install
Set Up Neo4j Database:

Ensure Neo4j is installed and running.
Create a new database or use an existing one.
Import your dataset, ensuring it includes User, Movie, and Genre nodes with the appropriate relationships.
## Usage
Configure Environment Variables:

Create a .env file in the root directory and add the following variables:

env
Copy code
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
Replace your_password with your Neo4j password.

## Run the Application:

bash
Copy code
node app.js
Get Recommendations:

Use the provided API endpoints or functions to fetch movie recommendations for a specific user.

## Configuration
Neo4j Connection: Update the .env file with your Neo4j connection details.
Recommendation Parameters: Modify the recommendation logic in app.js to adjust thresholds, limits, and other parameters as needed.
## Data Model
The system uses the following data model:

Nodes:

User
Movie
Genre
Relationships:

:WATCHED between User and Movie with a rating property (1-10).
:BELONGS_TO between Movie and Genre.
Recommendation Logic
The application implements a hybrid recommendation approach:

## Collaborative Filtering:

Identifies users with similar movie-watching patterns.
Recommends movies that similar users have highly rated but the target user hasn't watched.
## Content-Based Filtering (Fallback):

If collaborative filtering doesn't yield sufficient recommendations, suggests movies of genres that the user has shown interest in.
Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
