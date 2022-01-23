#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER tsbackenduser WITH PASSWORD '123456';
    CREATE DATABASE tsbackend;
    GRANT ALL PRIVILEGES ON DATABASE tsbackend TO tsbackenduser;
EOSQL