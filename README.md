# Laravel React Chat Application
This is a chat application built using Laravel for the backend and React with Inertia.js for the frontend. The application provides real-time chat functionality, user authentication, and profile management. 

It utilizes Tailwind CSS for styling, TypeScript for type safety, React Router for client-side routing, and Vite for fast builds and hot module replacement.

## Tech Stack

- **Laravel**: A PHP framework for building robust and scalable web applications.
- **React**: A JavaScript library for building user interfaces.
- **Inertia.js**: A framework that allows you to build single-page apps using classic server-side routing and controllers.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.
- **Docker**: Containerization platform for running the application database.
- **Vite**: A build tool that provides a faster and leaner development experience for modern web projects.
- **Sanctum**: Laravel's lightweight authentication system for SPAs and simple APIs.
- **Reverb**: Laravel WebSocket server to handle real-time events
- **Laravel Echo**: Frontend JavaScript library used to subscribe to channels and listen for events broadcast by Laravel backend, enabling real-time web communication

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/fanboxio/laravel-react-chat-eugene
    cd laravel-react-chat
    ```

2. **Install dependencies**:
    ```sh
    composer install
    npm install
    ```

3. **Copy the `.env.example` file to `.env`**:
    ```sh
    cp .env.example .env
    ```

4. **Generate an application key**:
    ```sh
    php artisan key:generate
    ```

8. **Run database in Docker**:
    

5. **Set up the database**:
    - Update the `.env` file with your database credentials.
    - Run database in Docker
        ```sh
        docker-compose up -d
        ```
    - Run the migrations:
        ```sh
        php artisan migrate
        ```
    - Seed the database:
        ```sh
        php artisan db:seed
        ```


## Launching the App After Initial Setup

After initially completing the installation steps, you can launch the application with the following commands:

1. **Start the database Docker container**:
    ```sh
    docker-compose up -d
    ```

2. **Start the backend server**:
    ```sh
    php artisan serve
    ```

3. **Start the frontend development Vite server**:
    ```sh
    npm run dev
    ```

4. **Start the Reverb WebSockets server**:
    ```sh
    php artisan reverb:start
    ```
    (optional) **Restart the Reverb WebSockets server after making changes to your code**:
    ```sh
    php artisan reverb:start
    ```

5. **Run the Jobs Queue Worker for WebSockets broadcasting to work**
    ```sh
    php artisan queue:listen
    ```

## Usage

- **Authentication**: The application uses Laravel Breeze for authentication. You can register, log in, and manage your profile.
- **Chat**: Users can send and receive messages in real-time.
- **Profile Management**: Users can update their profile information and change their password.
