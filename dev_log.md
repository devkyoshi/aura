# Dev Log

---------------------------
## Notes:
1. **These HTTP Status codes are used:**
    - **jwt Auth middleware (UNAUTHORIZED)**
      - (401) - Unauthorized: The client must authenticate itself to get the requested response.
    - **userPermission middleware (FORBIDDEN)**
      - (403) - Forbidden: The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource.

---------------------------
## Iteration 03: Dev Log 03 - 2025-02-02
- Checked the refresh token functionality. It works fine.
- Completed add classroom controller
- Added get all classroom endpoint
- (concerns) : Currently instructor data is populating. Need to populate only the instructor required fields.


---------------------------
## Iteration 02: Dev Log 02 - 2025-02-01
- Added refresh token functionality
  - Created a refresh token column in the user model
  - Added the logic to login and register routes to generate a refresh token
  - Please check whether it works

---------------------------
## Iteration 01: Dev Log 01 - 2025-01-19
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