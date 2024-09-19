#!/bin/bash

# Function to check if PostgreSQL is installed
check_postgres_installed() {
    if command -v psql > /dev/null; then
        echo "PostgreSQL is already installed."
    else
        echo "PostgreSQL is not installed. Installing..."
        install_postgres
    fi
}

# Function to install PostgreSQL for Linux (Ubuntu/Debian)
install_postgres_linux() {
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib
}

# Function to install PostgreSQL for Mac (using Homebrew)
install_postgres_mac() {
    if command -v brew > /dev/null; then
        brew update
        brew install postgresql
    else
        echo "Homebrew is not installed. Please install Homebrew first."
        exit 1
    fi
}

# Function to install PostgreSQL based on OS
install_postgres() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        install_postgres_linux
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        install_postgres_mac
    else
        echo "Unsupported OS: $OSTYPE"
        exit 1
    fi
}

# Function to start PostgreSQL service
start_postgres_service() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo service postgresql start
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start postgresql
    else
        echo "Unsupported OS: $OSTYPE"
        exit 1
    fi
}

# Function to set up PostgreSQL database and user
setup_postgres_db() {
    echo "Creating PostgreSQL database and user..."

    sudo -u postgres psql -c "CREATE USER myuser WITH PASSWORD 'mypassword';"
    sudo -u postgres psql -c "CREATE DATABASE mydb;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;"

    echo "PostgreSQL setup complete."
}

# Main script execution
check_postgres_installed
start_postgres_service
setup_postgres_db
