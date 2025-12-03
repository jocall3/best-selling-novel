openapi: 3.0.0
info:
  title: My Awesome Project API
  version: 1.0.0
  description: Detailed documentation for the backend API, following the OpenAPI specification. Describes all endpoints, request/response schemas, and authentication methods.
servers:
  - url: /api/v1
    description: Production server
paths:
  /users:
    get:
      summary: Get a list of all users
      operationId: getUsers
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    post:
      summary: Create a new user
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NewUser'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /users/{userId}:
    get:
      summary: Get a specific user by ID
      operationId: getUserById
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
          description: The ID of the user to retrieve
      responses:
        '200':
          description: User details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    put:
      summary: Update a user by ID
      operationId: updateUserById
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
          description: The ID of the user to update
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUser'
      responses:
        '200':
          description: User updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    delete:
      summary: Delete a user by ID
      operationId: deleteUserById
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
          description: The ID of the user to delete
      responses:
        '204':
          description: User deleted successfully
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /auth/login:
    post:
      summary: User login
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginCredentials'
      responses:
        '200':
          description: Login successful, returns JWT token
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                    description: JWT token for authentication
        '400':
          description: Bad request (e.g., missing credentials)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: Unique identifier for the user
        username:
          type: string
          description: The user's chosen username
        email:
          type: string
          format: email
          description: The user's email address
        createdAt:
          type: string
          format: date-time
          description: Timestamp when the user was created
        updatedAt:
          type: string
          format: date-time
          description: Timestamp when the user was last updated
      required:
        - id
        - username
        - email
        - createdAt
        - updatedAt
    NewUser:
      type: object
      properties:
        username:
          type: string
          description: The user's chosen username
        email:
          type: string
          format: email
          description: The user's email address
        password:
          type: string
          format: password
          description: The user's password
      required:
        - username
        - email
        - password
    UpdateUser:
      type: object
      properties:
        username:
          type: string
          description: The user's chosen username
        email:
          type: string
          format: email
          description: The user's email address
      required:
        - username
        - email
    LoginCredentials:
      type: object
      properties:
        email:
          type: string
          format: email
          description: The user's email address
        password:
          type: string
          format: password
          description: The user's password
      required:
        - email
        - password
    Error:
      type: object
      properties:
        message:
          type: string
          description: A human-readable error message
        code:
          type: string
          description: An error code for programmatic handling
      required:
        - message
        - code
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - bearerAuth: []