### Kanban Board/Application

Kanban is a task management application that can be used to track completed tasks, pending tasks, and tasks that are not completed. This application allows us to manage tasks and create lists for various projects. It is designed to handle multiple projects and track their respective tasks.

I have created a Kanban board, which is a Single Page Application (SPA). I used the Vue.js framework for the frontend and the Flask framework for the backend. Kanban offers a convenient way to manage tasks and list them along with their completion status.


**Objective of the Application:**

1. The application is designed to be multi-user and secured with JWT token.
2. Users have the ability to create lists or projects and add tasks to them.
3. Users can move tasks between sections such as completed, pending, or deadline passed.
4. Users can access a summary that provides insights into completed projects versus ongoing projects. Detailed task information is also available.
5. Users will receive daily email reminders to complete pending tasks promptly.
6. Users will receive monthly reports via email in PDF format, containing comprehensive monthly statistics.
7. Users can download their tasks in CSV format at any time and share them with others.


**Technologies Used:**

This application consists of two parts: the backend and frontend.

In the 'backend' folder, I have created the server that generates the API, utilizing caching for faster processing, and employing Celery workers for asynchronous tasks.

In the 'frontend' folder, I have used Vue.js for the user interface, which transforms the application into a Single Page Application (SPA).


<u>Languages Used:</u>
1. Python
2. Javascript


<u>Backend Technologies:</u>

1. Flask: Used for building the backend of the application.
2. Flask Restful: Utilized to create APIs that facilitate data transfer to the frontend.
3. Celery: Employed for asynchronous tasks to enhance performance. Celery is particularly helpful for parallel operations.
4. Celery Beat: Utilized for scheduling jobs, with "Crontab" being used for specifying timing. This is applied for tasks such as daily reminders and monthly reports, which are sent to users' email addresses at specific times.
5. Flask Caching: Implemented to improve app performance. Caching is applied to every GET request, while the cache is updated for POST and other types of requests.
6. Flask Security: Implements Token-Based Authentication to secure and protect API endpoints.
7. SMTPLib: Used for sending emails.
8. Mailhog: While the application is not in production, a fake SMTP server, Mailhog, is used for testing and development. It is used to receive emails during these phases.
9. Pandas/Numpy: Utilized for data manipulation on the backend.
10. WeasyPrint: Employed for generating PDF documents from HTML templates.



<u>Database Technologies:</u>

1. SQLite3: This SQL database is used in this application.
2. SQLAlchemy: It serves as an Object Relational Mapper (ORM) for SQLite3.
3. Redis: It is used as the database for Celery (workers) and caching. This database is known for its speed, as it is a distributed, in-memory key–value database.

<u>Frontend Technologies:</u>

1. VueJS CDN: The VueJS framework is employed for the frontend.
2. Vuex Store: It is used to store data in VueJS on the frontend.
3. HTML/CSS: Utilized for creating and styling the contents within the app.
4. Chart.js: Employed for creating graphs. All graphs on the summary page are generated using Chart.js.


<u>Tools Utilized:</u>

I have used some tools or GUI tools, for testing and development of the application. These tools are as follows:
1. dbbrowser: Used for visualizing the SQLite database.
2. resp.app: Employed for interacting with the Redis database.
3. Insomnia: Utilized for testing and managing API endpoints.






**How to run the application:** 

Step 1: Install all the required dependencies. Refer to the 'requirements.txt' file.
If you want to install all the requirements in one go, use the following command:
```
pip install -r requirements.txt
```
Ensure that you are in the correct directory, and pip should be installed on your machine.


Step 2: Start the Redis server. Since caching is done using Redis, it needs to be started beforehand.
Below is the command to start the Redis server:
```
redis-server
```


Step 3: Run the server. We only need to execute one file, 'app.py'.
```
python3 app.py
```
Note: I used Python3.


Step4: With the server running, most of the backend work is already done. Now, we need to start or execute Celery and Celery Beat. I've included the commands in 'local_workers.sh' and 'local_beat.sh' files for the convenience.
```
sh local_workers.sh
```
```
sh local_beat.sh
```


Step5: Navigate to the frontend directory and serve the Vue.js application.
```
live-server .
```
Make sure you are in the correct directory.


Step6: Run MailHog to Check Emails.
First, install MailHog since it's not installed via pip. Below is the command to install it:
```
go get github.com/mailhog/MailHog
```
Once the installation is complete, we can start MailHog by running the following command:
```
Mailhog
```

Note: This application is not in the production phase, so it runs on the localhost after executing the provided commands. These commands must be executed in the terminal.
