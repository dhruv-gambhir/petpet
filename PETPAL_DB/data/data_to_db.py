import os
import pandas as pd
from sqlalchemy import create_engine

# Database connection function updated to create a SQLAlchemy engine
def connect_db():
    # Create a SQLAlchemy engine for PostgreSQL
    engine = create_engine('postgresql+psycopg2://postgres:ENTERPASSWORD@localhost:5432/mydb')  # ENTER PASSWORD FOR postgres
    return engine

# Load CSV function updated to use SQLAlchemy engine
def load_csv_into_table(engine, table_name, csv_file_path, columns):
    try:
        df = pd.read_csv(csv_file_path)
        # Convert the DataFrame's column names to lowercase
        df.columns = df.columns.str.lower()
        if df.shape[1] > len(columns.split(',')):  # Check if there's an extra column
            df.drop(df.columns[0], axis=1, inplace=True)  # Drop the first column (index column)
        # Load DataFrame into the database
        df.to_sql(table_name, engine, if_exists='append', index=False)
        print(f"{len(df)} rows of data loaded into {table_name} from {csv_file_path}")
    except Exception as e:
        print(f"Error loading data into {table_name} from {csv_file_path}: {e}")

def main():
    # Directory containing the CSV files
    csv_dir = os.path.join(os.getcwd(), "PETPAL_DB", "data", "csv")

    # Map each table to its corresponding CSV file and column list
    table_csv_map = {
        "users": ("user.csv", "userid, Name, Email, PhoneNumber, CreatedAt, updatedAt, Bio, IsAgency, Address, LicenseNumber, ImageUrl"),
        "pets": ("pet.csv", "id, ownerid, name, age, sex, species, breed, createdat, ImageUrl"),
        "sitting_requests": ("sitting.csv", "id, userid, pay, startdate, enddate, status, description, createdat, location, tasktype"),
        "sitter_interests": ("sitting_interest.csv", "id, userid, sittingrequestid, createdat, status"),
        "pets_sitting_requests": ("pet_sitting_request.csv", "id, sittingrequestid, petid"),
        "events": ("event.csv", "id, createdby, event_name, description, location, startdate, createdat, cost, ImageUrl, status"),
        "event_interests": ("event_interest.csv", "id, userid, eventid, createdat, status"),
        "adoption_listings": ("adoption.csv", "id, agentid, petid, description, status, createdat, updatedat"),
        "adoption_interests": ("adoption_interest.csv", "id, userid, adoptionlistingid, createdat, status")
    }

    # Connect to the database
    engine = connect_db()

    try:
        # Loop through the mapping and load each CSV into the respective table
        for table_name, (csv_file, columns) in table_csv_map.items():
            csv_file_path = os.path.join(csv_dir, csv_file)
            if os.path.exists(csv_file_path):  # Check if CSV file exists
                load_csv_into_table(engine, table_name, csv_file_path, columns)
            else:
                print(f"CSV file {csv_file_path} does not exist.")
    finally:
        # No need to explicitly close the engine; it handles connections internally
        pass

if __name__ == "__main__":
    main()