#!/bin/bash
set -euo pipefail

#############################################################################
# Script for deleting backups older then 7 days and backup the SVS database #
#############################################################################

SCRIPT_FILE="$(readlink -f "$0")"
SCRIPT_DIR=$(dirname "${SCRIPT_FILE}")

source "$SCRIPT_DIR/.env"

if [ -z "$DB_USER" ]; then
    echo "DB user is missing"
    exit 1
fi
if [ -z "$DB_PASSWORD" ]; then
    echo "DB password is missing"
    exit 1
fi
if [ -z "$DB_NAME" ]; then
    echo "DB name is missing"
    exit 1
fi
if [ -z "$DB_BACKUP_DIR" ]; then
    echo "DB backup dir is missing"
    exit 1
fi

TIMESTAMP=$(date +"%F")
BACKUP_DIR="$SCRIPT_DIR/$DB_BACKUP_DIR"
MYSQL_USER="$DB_USER"
MYSQL_PASSWORD="$DB_PASSWORD"
MYSQL_DATABASE="$DB_NAME"
MYSQLDUMP=/usr/bin/mysqldump

mkdir -p "$BACKUP_DIR"

echo ""
echo "███████╗██╗   ██╗███████╗    ██████╗  █████╗  ██████╗██╗  ██╗██╗   ██╗██████╗ "
echo "██╔════╝██║   ██║██╔════╝    ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██║   ██║██╔══██╗"
echo "███████╗██║   ██║███████╗    ██████╔╝███████║██║     █████╔╝ ██║   ██║██████╔╝"
echo "╚════██║╚██╗ ██╔╝╚════██║    ██╔══██╗██╔══██║██║     ██╔═██╗ ██║   ██║██╔═══╝ "
echo "███████║ ╚████╔╝ ███████║    ██████╔╝██║  ██║╚██████╗██║  ██╗╚██████╔╝██║     "
echo "╚══════╝  ╚═══╝  ╚══════╝    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     "
echo ""

cd "$BACKUP_DIR" || exit 1

echo "Deleting old database backups:"
find ./ -maxdepth 1 -name "*.gz" -mtime +6 -type f -print0 | 
while IFS= read -r -d '' backup
do 
    echo "Deleting backup: \"$backup\""
    rm -fv "$backup"
done

echo "Start backup database $MYSQL_DATABASE"
$MYSQLDUMP -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --databases "$MYSQL_DATABASE" | gzip > "$MYSQL_DATABASE-$TIMESTAMP.gz"

echo "Backup completed"
