# PetPal-DB

Creating the DB in your machine
CLONE this GIT
1.  Run cd PETPAL_DB/Scripts
2.  Run 'chmod +x ./setup_postgreSQL.sh' in your terminal
3.  Run './setup_postgreSQL.sh' in the terminal
4.  Create postgres role if it does not exist
5.  Run 'sudo -u postgres psql -d mydb -a -f create_database.sql'
