1. Setup postgresSQL and create database with Scripts
    If there is an outdated mydb which needs to be deleted
    a. psql -U postgres -d postgres
    b. DROP DATABASE mydb;
    c. \q
    d. Rerun Scripts (setup_postgreSQL.sh and create_database.sql)
2. Ensure dependencies pandas, sqlalchemy, faker (for create_data.py) are installed
3. Look for the ENTER PASSWORD comment in data_to_db.py and replace it with your postgres role password
4. Ensure current directory is petpet
5. python ./PETPAL_DB/data/data_to_db.py

Checking created data:

1. Open postgreSQL shell with psql -U postgres -d postgres
2. \l to list all databases, check mydb is present
3. \c mydb
4. \dt to list all tables in mydb
5. Use SELECT statements to check data from tables 
