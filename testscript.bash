if [ "$( psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='usof_db'" )" = '1' ]
then
    echo "Database already exists"
else
    echo "Database does not exist"
fi