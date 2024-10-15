def get_swagger_spec():

    return {
            "swagger": "2.0",
            "info": {
                "title": "Pet Sitting & Adoption API",
                "description": "API for managing pet adoption, sitting requests, and events.",
                "version": "1.0.0"
            },
            "host": "127.0.0.1:5001",
            "basePath": "/",
            "schemes": ["http"],
            "paths": {
                # Users
                "/users": {
                    "post": {
                        "summary": "Create a new user",
                        "description": "Create a new user in the database.",
                        "parameters": [
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "name": {"type": "string"},
                                        "email": {"type": "string"},
                                        "phonenumber": {"type": "string"},
                                        "bio": {"type": "string"},
                                        "imageurl": {"type": "string"},
                                        "isagency": {"type": "boolean"},
                                        "address": {"type": "string"},
                                        "licensenumber": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "201": {
                                "description": "User created successfully"
                            },
                            "400": {
                                "description": "Invalid user data"
                            }
                        }
                    }
                },
                "/users/{user_id}": {
                    "get": {
                        "summary": "Fetch a specific user",
                        "description": "Retrieve a user by ID.",
                        "parameters": [
                            {
                                "name": "user_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "User ID"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "User details",
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "userid": {"type": "string"},
                                        "name": {"type": "string"},
                                        "email": {"type": "string"},
                                        "phonenumber": {"type": "string"},
                                        "createdat": {"type": "string"},
                                        "updatedat": {"type": "string"},
                                        "bio": {"type": "string"},
                                        "imageurl": {"type": "string"},
                                        "isagency": {"type": "boolean"},
                                        "address": {"type": "string"},
                                        "licensenumber": {"type": "string"}
                                    }
                                }
                            },
                            "404": {
                                "description": "User not found"
                            }
                        }
                    },
                    "put": {
                        "summary": "Update a specific user",
                        "description": "Update a user by ID.",
                        "parameters": [
                            {
                                "name": "user_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "User ID"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "name": {"type": "string"},
                                        "email": {"type": "string"},
                                        "phonenumber": {"type": "string"},
                                        "bio": {"type": "string"},
                                        "imageurl": {"type": "string"},
                                        "isagency": {"type": "boolean"},
                                        "address": {"type": "string"},
                                        "licensenumber": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "User updated successfully"
                            },
                            "404": {
                                "description": "User not found"
                            }
                        }
                    }
                },
                # Users by Email
                "/users/email/{email}": {
                    "get": {
                        "summary": "Fetch a specific user by email",
                        "description": "Retrieve a user by email.",
                        "parameters": [
                            {
                                "name": "email",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "User Email"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "User details",
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "userid": {"type": "string"},
                                        "name": {"type": "string"},
                                        "email": {"type": "string"},
                                        "phonenumber": {"type": "string"},
                                        "createdat": {"type": "string"},
                                        "updatedat": {"type": "string"},
                                        "bio": {"type": "string"},
                                        "imageurl": {"type": "string"},
                                        "isagency": {"type": "boolean"},
                                        "address": {"type": "string"},
                                        "licensenumber": {"type": "string"}
                                    }
                                }
                            },
                            "404": {
                                "description": "User not found"
                            }
                        }
                    },
                    "put": {
                        "summary": "Update a specific user by email",
                        "description": "Update a user by email.",
                        "parameters": [
                            {
                                "name": "email",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "User Email"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "name": {"type": "string"},
                                        "email": {"type": "string"},
                                        "phonenumber": {"type": "string"},
                                        "bio": {"type": "string"},
                                        "imageurl": {"type": "string"},
                                        "isagency": {"type": "boolean"},
                                        "address": {"type": "string"},
                                        "licensenumber": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "User updated successfully"
                            },
                            "404": {
                                "description": "User not found"
                            }
                        }
                    }
                },
                # Events
                "/events": {
                    "get": {
                        "summary": "Fetch all events",
                        "description": "Retrieve all events from the database.",
                        "produces": ["application/json"],
                        "responses": {
                            "200": {
                                "description": "A list of events",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "id": {"type": "string"},
                                            "createdby": {"type": "string"},
                                            "event_name": {"type": "string"},
                                            "description": {"type": "string"},
                                            "location": {"type": "string"},
                                            "startdate": {"type": "string"},
                                            "cost": {"type": "integer"},
                                            "status": {"type": "string"},
                                            "imageurl": {"type": "string"},
                                            "createdat": {"type": "string"}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "/events/{event_id}": {
                    "get": {
                        "summary": "Fetch a specific event",
                        "description": "Retrieve an event by ID.",
                        "parameters": [
                            {
                                "name": "event_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Event ID"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Event details",
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "createdby": {"type": "string"},
                                        "event_name": {"type": "string"},
                                        "description": {"type": "string"},
                                        "location": {"type": "string"},
                                        "startdate": {"type": "string"},
                                        "cost": {"type": "integer"},
                                        "status": {"type": "string"},
                                        "imageurl": {"type": "string"},
                                        "createdat": {"type": "string"}
                                    }
                                }
                            },
                            "404": {
                                "description": "Event not found"
                            }
                        }
                    },
                    "post": {
                        "summary": "Create a new event under a specific ID",
                        "description": "Create a new event in the database.",
                        "parameters": [
                            {
                                "name": "event_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Event ID"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "createdby": {"type": "string"},
                                        "event_name": {"type": "string"},
                                        "description": {"type": "string"},
                                        "location": {"type": "string"},
                                        "startdate": {"type": "string"},
                                        "cost": {"type": "integer"},
                                        "status": {"type": "string"},
                                        "imageurl": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "201": {
                                "description": "Event created successfully"
                            },
                            "400": {
                                "description": "Invalid event data"
                            }
                        }
                    },
                    "put": {
                        "summary": "Update a specific event",
                        "description": "Update an event by ID.",
                        "parameters": [
                            {
                                "name": "event_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Event ID"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "event_name": {"type": "string"},
                                        "description": {"type": "string"},
                                        "location": {"type": "string"},
                                        "startdate": {"type": "string"},
                                        "cost": {"type": "integer"},
                                        "status": {"type": "string"},
                                        "imageurl": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Event updated successfully"
                            },
                            "404": {
                                "description": "Event not found"
                            }
                        }
                    },
                    "delete": {
                        "summary": "Delete a specific event",
                        "description": "Delete an event by ID.",
                        "parameters": [
                            {
                                "name": "event_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Event ID"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Event deleted successfully"
                            },
                            "404": {
                                "description": "Event not found"
                            }
                        }
                    }
                },
                # Events by User
                "/events/user/{user_id}": {
                    "get": {
                        "summary": "Fetch all events by a specific user",
                        "description": "Retrieve all events from the database by the user_id.",
                        "parameters": [
                            {
                                "name": "user_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "User ID"
                            }
                        ],
                        "produces": ["application/json"],
                        "responses": {
                            "200": {
                                "description": "A list of events by the user",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "id": {"type": "string"},
                                            "createdby": {"type": "string"},
                                            "event_name": {"type": "string"},
                                            "description": {"type": "string"},
                                            "location": {"type": "string"},
                                            "startdate": {"type": "string"},
                                            "cost": {"type": "integer"},
                                            "status": {"type": "string"},
                                            "imageurl": {"type": "string"},
                                            "createdat": {"type": "string"}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                # Event Interests
                "/event_interests": {
                    "get": {
                        "summary": "Fetch all event interests",
                        "description": "Retrieve all event interests from the database.",
                        "produces": ["application/json"],
                        "responses": {
                            "200": {
                                "description": "A list of event interests",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "id": {"type": "string"},
                                            "eventid": {"type": "string"},
                                            "userid": {"type": "string"},
                                            "status": {"type": "string"},
                                            "createdat": {"type": "string"}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "/event_interests/{event_interest_id}": {
                    "get": {
                        "summary": "Fetch a specific event interest",
                        "description": "Retrieve an event interest by ID.",
                        "parameters": [
                            {
                                "name": "event_interest_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Event interest ID"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Event interest details",
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "eventid": {"type": "string"},
                                        "userid": {"type": "string"},
                                        "status": {"type": "string"},
                                        "createdat": {"type": "string"}
                                    }
                                }
                            },
                            "404": {
                                "description": "Event interest not found"
                            }
                        }
                    },
                    "post": {
                        "summary": "Create a new event interest under a specific ID",
                        "description": "Create a new event interest in the database.",
                        "parameters": [
                            {
                                "name": "event_interest_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Event interest ID"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "eventid": {"type": "string"},
                                        "userid": {"type": "string"},
                                        "status": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "201": {
                                "description": "Event interest created successfully"
                            },
                            "400": {
                                "description": "Invalid event interest data"
                            }
                        }
                    },
                    "put": {
                        "summary": "Update a specific event interest",
                        "description": "Update an event interest by ID.",
                        "parameters": [
                            {
                                "name": "event_interest_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Event interest ID"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "eventid": {"type": "string"},
                                        "userid": {"type": "string"},
                                        "status": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Event interest updated successfully"
                            },
                            "404": {
                                "description": "Event interest not found"
                            }
                        }
                    },
                    "delete": {
                        "summary": "Delete a specific event interest",
                        "description": "Delete an event interest by ID.",
                        "parameters": [
                            {
                                "name": "event_interest_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Event interest ID"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Event interest deleted successfully"
                            },
                            "404": {
                                "description": "Event interest not found"
                            }
                        }
                    }
                },
                # Adoption Listings
                "/adoption_listings": {
                    "get": {
                        "summary": "Fetch all adoption listings",
                        "description": "Retrieve all adoption listings from the database.",
                        "produces": ["application/json"],
                        "responses": {
                            "200": {
                                "description": "A list of adoption listings",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "id": {"type": "string"},
                                            "agentid": {"type": "string"},
                                            "petid": {"type": "string"},
                                            "description": {"type": "string"},
                                            "status": {"type": "string"},
                                            "createdat": {"type": "string"},
                                            "updatedat": {"type": "string"}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                # Adoption Listings
                "/adoption_listings/{adoption_id}": {
                    "get": {
                        "summary": "Fetch a specific adoption listing",
                        "description": "Retrieve an adoption listing by ID.",
                        "parameters": [
                            {
                                "name": "adoption_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Adoption listing ID"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Adoption listing details",
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "agentid": {"type": "string"},
                                        "petid": {"type": "string"},
                                        "description": {"type": "string"},
                                        "status": {"type": "string"},
                                        "createdat": {"type": "string"},
                                        "updatedat": {"type": "string"}
                                    }
                                }
                            },
                            "404": {
                                "description": "Adoption listing not found"
                            }
                        }
                    },
                    "post": {
                        "summary": "Create a new adoption listing under a specific ID",
                        "description": "Create a new adoption listing in the database.",
                        "parameters": [
                            {
                                "name": "adoption_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Adoption listing ID"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "agentid": {"type": "string"},
                                        "petid": {"type": "string"},
                                        "description": {"type": "string"},
                                        "status": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "201": {
                                "description": "Adoption listing created successfully"
                            },
                            "400": {
                                "description": "Invalid adoption listing data"
                            }
                        }
                    },
                    "put": {
                        "summary": "Update a specific adoption listing",
                        "description": "Update an adoption listing by ID.",
                        "parameters": [
                            {
                                "name": "adoption_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Adoption listing ID"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "agentid": {"type": "string"},
                                        "petid": {"type": "string"},
                                        "description": {"type": "string"},
                                        "status": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Adoption listing updated successfully"
                            },
                            "404": {
                                "description": "Adoption listing not found"
                            }
                        }
                    },
                    "delete": {
                        "summary": "Delete a specific adoption listing",
                        "description": "Delete an adoption listing by ID.",
                        "parameters": [
                            {
                                "name": "adoption_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Adoption listing ID"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Adoption listing deleted successfully"
                            },
                            "404": {
                                "description": "Adoption listing not found"
                            }
                        }
                    }
                },
                # Sitting Requests and Interests are similarly structured, adjust accordingly for specific IDs
                "/adoption_interests": {
                    "get": {
                        "summary": "Fetch all adoption interests",
                        "description": "Retrieve all adoption interests from the database.",
                        "produces": ["application/json"],
                        "responses": {
                            "200": {
                                "description": "A list of adoption interests",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "id": {"type": "string"},
                                            "userid": {"type": "string"},
                                            "status": {"type": "string"},
                                            "createdat": {"type": "string"}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "/adoption_interests/{adoption_interest_id}": {
                    "get": {
                        "summary": "Fetch a specific adoption interest",
                        "description": "Retrieve an adoption interest by ID.",
                        "parameters": [
                            {
                                "name": "adoption_interest_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Adoption interest ID"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Adoption interest details",
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "userid": {"type": "string"},
                                        "status": {"type": "string"},
                                        "createdat": {"type": "string"}
                                    }
                                }
                            },
                            "404": {
                                "description": "Adoption interest not found"
                            }
                        }
                    },
                    "post": {
                        "summary": "Create a new adoption interest under a specific ID",
                        "description": "Create a new adoption interest in the database.",
                        "parameters": [
                            {
                                "name": "adoption_interest_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Adoption interest ID"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "userid": {"type": "string"},
                                        "status": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "201": {
                                "description": "Adoption interest created successfully"
                            },
                            "400": {
                                "description": "Invalid adoption interest data"
                            }
                        }
                    },
                    "put": {
                        "summary": "Update a specific adoption interest",
                        "description": "Update an adoption interest by ID.",
                        "parameters": [
                            {
                                "name": "adoption_interest_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Adoption interest ID"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "userid": {"type": "string"},
                                        "status": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Adoption interest updated successfully"
                            },
                            "404": {
                                "description": "Adoption interest not found"
                            }
                        }
                    },
                    "delete": {
                        "summary": "Delete a specific adoption interest",
                        "description": "Delete an adoption interest by ID.",
                        "parameters": [
                            {
                                "name": "adoption_interest_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Adoption interest ID"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Adoption interest deleted successfully"
                            },
                            "404": {
                                "description": "Adoption interest not found"
                            }
                        }
                    }
                },
                # Sitting Requests
                "/sitting_requests": {
                    "get": {
                        "summary": "Fetch all sitting requests",
                        "description": "Retrieve all sitting requests from the database.",
                        "produces": ["application/json"],
                        "responses": {
                            "200": {
                                "description": "A list of sitting requests",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "id": {"type": "string"},
                                            "userid": {"type": "string"},
                                            "pay": {"type": "integer"},
                                            "startdate": {"type": "string"},
                                            "enddate": {"type": "string"},
                                            "description": {"type": "string"},
                                            "status": {"type": "string"},
                                            "createdat": {"type": "string"},
                                            "location": {"type": "string"},
                                            "tasktype": {"type": "string"}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "/sitting_requests/{sitting_request_id}": {
                    "get": {
                        "summary": "Fetch a specific sitting request",
                        "description": "Retrieve a sitting request by ID.",
                        "parameters": [
                            {
                                "name": "sitting_request_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Sitting request ID"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Sitting request details",
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "userid": {"type": "string"},
                                        "pay": {"type": "integer"},
                                        "startdate": {"type": "string"},
                                        "enddate": {"type": "string"},
                                        "description": {"type": "string"},
                                        "status": {"type": "string"},
                                        "createdat": {"type": "string"},
                                        "location": {"type": "string"},
                                        "tasktype": {"type": "string"}
                                    }
                                }
                            },
                            "404": {
                                "description": "Sitting request not found"
                            }
                        }
                    },
                    "post": {
                        "summary": "Create a new sitting request under a specific ID",
                        "description": "Create a new sitting request in the database.",
                        "parameters": [
                            {
                                "name": "sitting_request_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Sitting request ID"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "userid": {"type": "string"},
                                        "pay": {"type": "integer"},
                                        "startdate": {"type": "string"},
                                        "enddate": {"type": "string"},
                                        "description": {"type": "string"},
                                        "status": {"type": "string"},
                                        "location": {"type": "string"},
                                        "tasktype": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "201": {
                                "description": "Sitting request created successfully"
                            },
                            "400": {
                                "description": "Invalid sitting request data"
                            }
                        }
                    },
                    "put": {
                        "summary": "Update a specific sitting request",
                        "description": "Update a sitting request by ID.",
                        "parameters": [
                            {
                                "name": "sitting_request_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Sitting request ID"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "userid": {"type": "string"},
                                        "pay": {"type": "integer"},
                                        "startdate": {"type": "string"},
                                        "enddate": {"type": "string"},
                                        "description": {"type": "string"},
                                        "status": {"type": "string"},
                                        "location": {"type": "string"},
                                        "tasktype": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Sitting request updated successfully"
                            },
                            "404": {
                                "description": "Sitting request not found"
                            }
                        }
                    },
                    "delete": {
                        "summary": "Delete a specific sitting request",
                        "description": "Delete a sitting request by ID.",
                        "parameters": [
                            {
                                "name": "sitting_request_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Sitting request ID"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Sitting request deleted successfully"
                            },
                            "404": {
                                "description": "Sitting request not found"
                            }
                        }
                    }
                },
                # Sitting Interests
                "/sitter_interests": {
                    "get": {
                        "summary": "Fetch all sitter interests",
                        "description": "Retrieve all sitter interests from the database.",
                        "produces": ["application/json"],
                        "responses": {
                            "200": {
                                "description": "A list of sitter interests",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "id": {"type": "string"},
                                            "userid": {"type": "string"},
                                            "sittingrequestid": {"type": "string"},
                                            "status": {"type": "string"},
                                            "createdat": {"type": "string"}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "/sitter_interests/{sitter_interest_id}": {
                    "get": {
                        "summary": "Fetch a specific sitter interest",
                        "description": "Retrieve a sitter interest by ID.",
                        "parameters": [
                            {
                                "name": "sitter_interest_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Sitter interest ID"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Sitter interest details",
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "userid": {"type": "string"},
                                        "sittingrequestid": {"type": "string"},
                                        "status": {"type": "string"},
                                        "createdat": {"type": "string"}
                                    }
                                }
                            },
                            "404": {
                                "description": "Sitter interest not found"
                            }
                        }
                    },
                    "post": {
                        "summary": "Create a new sitter interest under a specific ID",
                        "description": "Create a new sitter interest in the database.",
                        "parameters": [
                            {
                                "name": "sitter_interest_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Sitter interest ID"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "userid": {"type": "string"},
                                        "sittingrequestid": {"type": "string"},
                                        "status": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "201": {
                                "description": "Sitter interest created successfully"
                            },
                            "400": {
                                "description": "Invalid sitter interest data"
                            }
                        }
                    },
                    "put": {
                        "summary": "Update a specific sitter interest",
                        "description": "Update a sitter interest by ID.",
                        "parameters": [
                            {
                                "name": "sitter_interest_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Sitter interest ID"
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "required": True,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "userid": {"type": "string"},
                                        "sittingrequestid": {"type": "string"},
                                        "status": {"type": "string"}
                                    }
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Sitter interest updated successfully"
                            },
                            "404": {
                                "description": "Sitter interest not found"
                            }
                        }
                    },
                    "delete": {
                        "summary": "Delete a specific sitter interest",
                        "description": "Delete a sitter interest by ID.",
                        "parameters": [
                            {
                                "name": "sitter_interest_id",
                                "in": "path",
                                "required": True,
                                "type": "string",
                                "description": "Sitter interest ID"
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Sitter interest deleted successfully"
                            },
                            "404": {
                                "description": "Sitter interest not found"
                            }
                        }
                    }
                }
            }
        }
