#!/bin/bash
set -e

####################################################
# Script for restoring backups of the SVS database #
####################################################

SCRIPT_FILE="$(readlink -f "$0")"
SCRIPT_DIR=$(dirname "${SCRIPT_FILE}")

if [ -z "$1" ]; then
    echo "Please specify date of backup to restore in the format YYYY-MM-DD"
    exit 1
fi
BACKUP_DATE="$1"
BACKUP_FILE="svs-$BACKUP_DATE"
BACKUP_ARCHIVE="$BACKUP_FILE.gz"

source "$SCRIPT_DIR/.env"

if [ -z "$DB_USER" ]; then
    echo "DB user is missing"
    exit 1
fi
if [ -z "$DB_PASSWORD" ]; then
    echo "DB password is missing"
    exit 1
fi
if [ -z "$DB_BACKUP_DIR" ]; then
    echo "DB backup dir is missing"
    exit 1
fi

BACKUP_DIR="$SCRIPT_DIR/$DB_BACKUP_DIR"
MYSQL_USER="$DB_USER"
MYSQL_PASSWORD="$DB_PASSWORD"
MYSQL=/usr/bin/mysql

echo ""
echo "███████╗██╗   ██╗███████╗    ██████╗ ███████╗███████╗████████╗ ██████╗ ██████╗ ███████╗"
echo "██╔════╝██║   ██║██╔════╝    ██╔══██╗██╔════╝██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝"
echo "███████╗██║   ██║███████╗    ██████╔╝█████╗  ███████╗   ██║   ██║   ██║██████╔╝█████╗  "
echo "╚════██║╚██╗ ██╔╝╚════██║    ██╔══██╗██╔══╝  ╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝  "
echo "███████║ ╚████╔╝ ███████║    ██║  ██║███████╗███████║   ██║   ╚██████╔╝██║  ██║███████╗"
echo "╚══════╝  ╚═══╝  ╚══════╝    ╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝"
echo ""

cd "$BACKUP_DIR" || exit 1

if [ ! -f "$BACKUP_ARCHIVE" ]; then
    echo "Could not find backup archive $BACKUP_ARCHIVE"
    exit 1
fi

gunzip -k "$BACKUP_ARCHIVE"
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Could not find backup file $BACKUP_FILE"
    exit 1
fi

echo "Restoring backup $BACKUP_FILE ..."
$MYSQL -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" < "$BACKUP_FILE"
echo "Restore completed"
echo "Cleaning up"
rm "$BACKUP_FILE"

echo "Restore was successful"
