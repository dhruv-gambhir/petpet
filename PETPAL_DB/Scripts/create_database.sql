-- Create custom ENUM type for status
CREATE TYPE status_enum AS ENUM ('pending', 'decided');

-- Create custom ENUM type for sex
CREATE TYPE sex_enum AS ENUM ('male', 'female');
-- Create custom ENUM type for TaskType
CREATE TYPE task_enum AS ENUM ('day_boarding', 'doggy_day_care', 'dog_walking', 'home_visits', 'house_sitting');

-- Users Table
CREATE TABLE Users (
    UserId UUID PRIMARY KEY,
    Name VARCHAR(255),
    Email VARCHAR(255) UNIQUE NOT NULL,
    PhoneNumber VARCHAR(20),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Bio TEXT,
    ImageUrl TEXT,
    IsAgency BOOLEAN DEFAULT FALSE,
    Address VARCHAR(255),
    LicenseNumber VARCHAR(100)
);

-- Pets Table
CREATE TABLE Pets (
    Id UUID PRIMARY KEY,
    OwnerId UUID REFERENCES Users(UserId) ON DELETE CASCADE,
    Name VARCHAR(100),
    Sex sex_enum,  -- Using the custom ENUM type for sex
    Species VARCHAR(50),
    Breed VARCHAR(100),
    Age INT,
    ImageUrl TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adoption_Listings Table
CREATE TABLE Adoption_Listings (
    Id UUID PRIMARY KEY,
    AgentId UUID REFERENCES Users(UserId) ON DELETE CASCADE,
    PetId UUID REFERENCES Pets(Id) ON DELETE CASCADE,
    Description TEXT,
    Status status_enum DEFAULT 'pending',  -- Using the custom ENUM type for status
    TaskType task_enum,  -- Using the custom ENUM type for TaskType
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adoption_Interests Table
CREATE TABLE Adoption_Interests (
    Id UUID PRIMARY KEY,
    UserId UUID REFERENCES Users(UserId) ON DELETE CASCADE,
    AdoptionListingId UUID REFERENCES Adoption_Listings(Id) ON DELETE CASCADE,
    Status status_enum DEFAULT 'pending',  -- Using the custom ENUM type for status
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sitting_Requests Table
CREATE TABLE Sitting_Requests (
    Id UUID PRIMARY KEY,
    UserId UUID REFERENCES Users(UserId) ON DELETE CASCADE,
    Pay INT,
    StartDate DATE,
    EndDate DATE,
    Description TEXT,
    Status status_enum DEFAULT 'pending',  -- Using the custom ENUM type for status
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sitter_Interests Table
CREATE TABLE Sitter_Interests (
    Id UUID PRIMARY KEY,
    UserId UUID REFERENCES Users(UserId) ON DELETE CASCADE,
    SittingRequestId UUID REFERENCES Sitting_Requests(Id) ON DELETE CASCADE,
    Status status_enum DEFAULT 'pending',  -- Using the custom ENUM type for status
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE Events (
    Id UUID PRIMARY KEY,
    CreatedBy UUID REFERENCES Users(UserId) ON DELETE CASCADE,
    Event_name VARCHAR(255),
    Description TEXT,
    Location VARCHAR(255),
    StartDate DATE,
    Cost INT,
    Status status_enum DEFAULT 'pending',  -- Using the custom ENUM type for status
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event_Interests Table
CREATE TABLE Event_Interests (
    Id UUID PRIMARY KEY,
    EventId UUID REFERENCES Events(Id) ON DELETE CASCADE,
    UserId UUID REFERENCES Users(UserId) ON DELETE CASCADE,
    Status status_enum DEFAULT 'pending',  -- Using the custom ENUM type for status
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pets_Sitting_Requests Table
CREATE TABLE Pets_Sitting_Requests (
    Id UUID PRIMARY KEY,
    SittingRequestId UUID REFERENCES Sitting_Requests(Id) ON DELETE CASCADE,
    PetId UUID REFERENCES Pets(Id) ON DELETE CASCADE
);
