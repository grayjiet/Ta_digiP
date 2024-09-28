# GIC_TA

1. Create a .env File

	•	In the root directory of your project, create a file named .env.
	•	This file will store your environment variables.

2. Add Database Environment Variables to .env

	•	Open the .env file in a text editor and replace the place holder with your database configuration:
        DATABASE_HOST=<your_database_host>
        DATABASE_PORT=<your_database_port>
        DATABASE_USER=<your_database_user>
        DATABASE_PASSWORD=<your_database_password>
        DATABASE_NAME=cafe_employee_db

3. Open terminal and run:
    • docker-compose build
    • docker-compose up

4. Access the webpage at:
    http://localhost:3000/
