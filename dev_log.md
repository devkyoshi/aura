# Dev Log

---------------------------
## Notes:
1. **These HTTP Status codes are used:**
    - **jwt Auth middleware (UNAUTHORIZED)**
      - (401) - Unauthorized: The client must authenticate itself to get the requested response.
    - **userPermission middleware (FORBIDDEN)**
      - (403) - Forbidden: The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource.


---------------------------
## Dev Log 07 - 2025-02-07
- I checked the refresh token part. now it will refresh the access_token by sending a request to the backend.
- created logout functionality(backend) which removes the cookie and the refresh token from the user's database.
---------------------------
## Dev Log 06 - 2025-02-06
- Created the instructor dashboard.
- Displayed the classrooms in the dashboard.
- Added classroom provider
---------------------------
## Dev Log 05 - 2025-02-02
- I added template dashboards for the instructor and student
- admins are also currently using the instructor dashboard
- 
---------------------------
## Dev Log 04 - 2025-02-01
- I created frontend using Next.js and Tailwind CSS
- Used shadeCn library for the UI components
- Created login and register pages

## Dev Log 03 - 2025-02-02
- Checked the refresh token functionality. It works fine.
- Completed add classroom controller
- Added get all classroom endpoint
- (concerns) : Currently instructor data is populating. Need to populate only the instructor required fields.

---------------------------
## Dev Log 02 - 2025-02-01
- Added refresh token functionality
  - Created a refresh token column in the user model
  - Added the logic to login and register routes to generate a refresh token
  - Please check whether it works

---------------------------
## Dev Log 01 - 2025-01-19
### Authentication and Registration
- Set up the project structure
- Install dependencies
- Created a basic server
- Set up the database connection
- Implemented user registration
- Implemented user login
- Implemented JWT generation
- Implemented password hashing
- Implemented user authentication middleware
- Implemented protected routes
- Implemented middleware to check user roles

### Models for Classroom, Lessons, and Quiz
- Created models for Classroom, Lessons and Quiz
- Created classroom DTOs