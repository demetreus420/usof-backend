
if [ "$( psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='usof_db'" )" = '1' ]
then
    echo "DB is exist!";
    nodemon ./app.js  
else
    echo "DB is not exist!"
    echo "...Creating db"
    psql -U postgres -a -f ./model/usof.sql
    echo "It is done!"
    nodemon ./app.js  
fi