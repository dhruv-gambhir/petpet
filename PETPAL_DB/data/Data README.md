1. Setup postgresSQL and create database with Scripts
2. Ensure dependencies pandas, sqlalchemy, faker (for create_data.py) are installed
3. If csv files are not already present under data/csv
    - change directory to petpet
    - python ./PETPAL_DB/data/create_data.py
5. Look for the ENTER PASSWORD comment in data_to_db.py and replace it with your postgres role password
6. Ensure current directory is petpet
7. python data_to_db.py

Checking created data:

7. Open postgreSQL shell with psql -U postgres -d postgres
8. \l to list all databases, check mydb is present
9. \c mydb
10. \dt to list all tables in mydb
11. Use SELECT statements to check data from tables 
